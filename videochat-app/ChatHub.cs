
using Grpc.Core;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Models;
using OneOf.Types;
using Pinecone;
using System.Collections.Concurrent;
using System.Net;


namespace SignalRChat {
    [Authorize]
    public class ChatHub : Hub {
        IndexClient _pcRooms;
        IndexClient _pcProfiles;
        private readonly MyDBContext _context;
        private readonly ConnectedRoomsDictionary _connectedRooms;
        private readonly ConnectionsDictionary _connections;
        private readonly ConcurrentQueue<UserTask> _userTasks= new ConcurrentQueue<UserTask>();

        
        public ChatHub(MyDBContext context, IConfiguration configuration, ConnectedRoomsDictionary connectedRooms, ConnectionsDictionary connections, ConcurrentQueue<UserTask> userTasks) {
            PineconeClient pc = new PineconeClient(configuration["Pinecone:ApiKey"]);
            _pcRooms = pc.Index("chatroom");
            _pcProfiles = pc.Index("profiles");
            _context = context;
            _connections = connections;
            _connectedRooms = connectedRooms;
            _userTasks = userTasks;
            
        }

        //potentially may be single threaded for bottlenecking
        public async Task<Object> JoinRoom(){

            string IdentityUserId = Context.GetHttpContext().Items["UserId"]?.ToString();
            if(_connectedRooms.ContainsKey(Context.ConnectionId)) return new {StatusCode=400,Message="Room already found",Success=false};
            Console.WriteLine("Pairing "+Context.ConnectionId);
            //get profile vector
            FetchResponse profile = await _pcProfiles.FetchAsync(new FetchRequest{
                Ids=new[] { (string) IdentityUserId},
            });
            float[] profileVector = profile.Vectors.First().Value.Values.ToArray();

            //get matching profile vectors
            QueryResponse similarProfiles = await _pcProfiles.QueryAsync(new QueryRequest{
                Vector=profileVector,
                TopK=7,
                IncludeValues=true,
                Filter = new Pinecone.Metadata{
                    ["status"] = new Pinecone.Metadata{
                        ["$eq"] = "avaliable"
                    }
                }
            });
            

            //for each similar profile find the room they are in and add them only if they are status 1
            var similarProfilesList = similarProfiles.Matches.ToList();
            int count = 0;
            foreach(var similarProfile in similarProfilesList){
                count++;
                if(count == 1) continue;
                Console.WriteLine(""+similarProfile.Score.Value);
                if(similarProfile.Score < .75) break;
                if(!_connections.ContainsKey(similarProfile.Id)) continue;
                if(_connectedRooms.ContainsKey(similarProfile.Id)) continue;
                // if(_connectionStatus[similarProfile.Id] != 1) continue;
                // passed cases for pairing the user
                string newRoomId = Guid.NewGuid().ToString();
                Console.WriteLine($"Paired {IdentityUserId} with {similarProfile.Id}: {similarProfile.Score.Value}");
                await Groups.AddToGroupAsync(Context.ConnectionId, newRoomId);
                await Groups.AddToGroupAsync(_connections[similarProfile.Id], newRoomId);
                _connectedRooms[Context.ConnectionId] = newRoomId;
                _connectedRooms[_connections[similarProfile.Id]] = newRoomId;

                await _pcProfiles.UpdateAsync(new UpdateRequest{
                    Id = IdentityUserId,
                    SetMetadata = new Pinecone.Metadata{
                        ["status"] = new("occupied")
                    }
                });

                await _pcProfiles.UpdateAsync(new UpdateRequest{
                    Id = similarProfile.Id,
                    SetMetadata = new Pinecone.Metadata{
                        ["status"] = new("occupied")
                    }
                });
                await Clients.Group(newRoomId).SendAsync("RoomJoined");
                return new {StatusCode=200,Success=true,Message="Matched the user"};
            }
            // throw new HubException("A similar peer could not be found");
            Console.WriteLine($"Falied to pair {IdentityUserId}");
            return new {StatusCode=404, Success=false,Message="Failed to match user"};
            // Context.GetHttpContext().Response.StatusCode = (int) HttpStatusCode.BadRequest;

        }

        public async Task JoinPool(){
            string IdentityUserId = Context.GetHttpContext().Items["UserId"]?.ToString();
            await _pcProfiles.UpdateAsync(new UpdateRequest{
                Id = IdentityUserId,
                SetMetadata = new Pinecone.Metadata{
                    ["status"] = new("avaliable")
                }
            });
            _userTasks.Enqueue(new UserTask{ConnectionId=Context.ConnectionId, IdentityUserId=IdentityUserId});
            // if(!backgroundTaskRunning) StartWorkers(1);
            // _connections[IdentityUserId] = Context.ConnectionId;


            // var profileDoc = await _context.Profiles.FirstAsync(p=> p.IdentityUserId == IdentityUserId);
            // profileDoc.Sessions +=1;
            // _context.Profiles.Update(profileDoc);
            // await _context.SaveChangesAsync();
        }

        


        public async Task SendOffer(string offer)
        {   
            
            if(_connectedRooms.TryGetValue(Context.ConnectionId, out var roomId)){
                Console.WriteLine(roomId);
                await Clients.OthersInGroup(roomId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
                return;
            }
            Console.WriteLine("No offer created");
        } 

        public async Task SendAnswer(string toConnectionId, string answer)
        {
            await Clients.Client(toConnectionId).SendAsync("ReceiveAnswer", answer);
        }

        public async Task LeaveRoom(){
            Console.WriteLine("Leaving room");
            string IdentityUserId = Context.GetHttpContext().Items["UserId"]?.ToString();
            //remove connection from current group and broadcast 
            if(_connectedRooms.TryGetValue(Context.ConnectionId, out string roomId)){
                await Clients.OthersInGroup(roomId).SendAsync("LeftRoom", Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
            }
            _connectedRooms.Remove(Context.ConnectionId, out var thing);
            
        }

        public async Task SendIceCandidate(string candidate)
        {
            // Console.WriteLine("Sending ICE canidate");
            await Clients.OthersInGroup(_connectedRooms[Context.ConnectionId]).SendAsync("ReceiveCandidate", candidate);
            // Console.WriteLine("Sent ICE success");
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Connected: {Context.ConnectionId}");
            string IdentityUserId = Context.GetHttpContext().Items["UserId"]?.ToString();
            
            _connections[IdentityUserId] = Context.ConnectionId;

            var profileDoc = await _context.Profiles.FirstAsync(p=> p.IdentityUserId == IdentityUserId);
            profileDoc.Sessions +=1;
            _context.Profiles.Update(profileDoc);
            await _context.SaveChangesAsync();
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected: {Context.ConnectionId}");
            string IdentityUserId = Context.GetHttpContext().Items["UserId"]?.ToString();
            if(_connectedRooms.TryGetValue(Context.ConnectionId, out string roomId)){
                await Clients.OthersInGroup(roomId).SendAsync("LeftRoom",Context.ConnectionId);
                Groups.RemoveFromGroupAsync(Context.ConnectionId,roomId);
            }
            // await _pcRooms.DeleteAsync(new DeleteRequest{
            //     Ids=new[] { Context.ConnectionId}
            // }); 
            await _pcProfiles.UpdateAsync(new UpdateRequest{
                Id = IdentityUserId,
                SetMetadata = new Pinecone.Metadata{
                    ["status"] = new("unavaliable")
                }
            });
            _connectedRooms.Remove(Context.ConnectionId, out var thing);
            _connections.Remove(IdentityUserId, out var thing2);
            await base.OnDisconnectedAsync(exception);
        }

    }

}