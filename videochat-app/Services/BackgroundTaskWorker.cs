using System.Collections.Concurrent;
using Helpers;
using Microsoft.AspNetCore.SignalR;
using Pinecone;
using SignalRChat;
public class UserTask{
    public required string ConnectionId { get; set; }
    public required string IdentityUserId { get; set; }
    public int Retires {get; set; } = 10;
}

namespace Services {
    public class BackgroundTaskWorker:BackgroundService{
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly ConcurrentQueue<UserTask> _userTasks;
        private readonly IndexClient _pcRooms;
        private readonly IndexClient _pcProfiles;
        private readonly MyDBContext _context;
        private readonly ConnectedRoomsDictionary _connectedRooms;
        private readonly ConnectionsDictionary _connections;

        public BackgroundTaskWorker(IHubContext<ChatHub> hubContext, ConcurrentQueue<UserTask> userQueue, IConfiguration configuration,  ConnectedRoomsDictionary connectedRooms, ConnectionsDictionary connections)
        {
            _hubContext = hubContext;
            _userTasks = userQueue;
            _connectedRooms = connectedRooms;
            _connections = connections;
            PineconeClient pc = new PineconeClient(configuration["Pinecone:ApiKey"]);
            _pcRooms = pc.Index("chatroom");
            _pcProfiles = pc.Index("profiles");
            // _context = context;
        }

        private async Task<bool> matchedUser(UserTask user){
            
            if(_connectedRooms.ContainsKey(user.ConnectionId)) return true;
            FetchResponse profile = await _pcProfiles.FetchAsync(new FetchRequest{
                Ids=new[] { (string) user.IdentityUserId},
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
            var similarProfilesList = similarProfiles.Matches.ToList();
            int count = 0;
            foreach(var similarProfile in similarProfilesList){
                count++;
                if(count == 1) continue;
                Console.WriteLine(""+similarProfile.Score.Value);
                if(similarProfile.Score < .75) break;
                if(!_connections.ContainsKey(similarProfile.Id)) continue;
                if(_connectedRooms.ContainsKey(similarProfile.Id)) continue;
                // passed cases for pairing the user
                string newRoomId = Guid.NewGuid().ToString();
                Console.WriteLine($"Paired {user.IdentityUserId} with {similarProfile.Id}: {similarProfile.Score.Value}");
                await _hubContext.Groups.AddToGroupAsync(user.ConnectionId, newRoomId);
                await _hubContext.Groups.AddToGroupAsync(_connections[similarProfile.Id], newRoomId);
                _connectedRooms[user.ConnectionId] = newRoomId;
                _connectedRooms[_connections[similarProfile.Id]] = newRoomId;
                
                await _pcProfiles.UpdateAsync(new UpdateRequest{
                    Id = user.IdentityUserId,
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
                await _hubContext.Clients.Group(newRoomId).SendAsync("RoomJoined");
                return true;
            }

            return false;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Starting the background task");
            while(!stoppingToken.IsCancellationRequested){
                await Task.Delay(500);
                if(_userTasks.IsEmpty) continue;
                _userTasks.TryDequeue(out var current);
                if(current.Retires == 0) continue;
                current.Retires -=1;
                Console.WriteLine("Matching user");
                if(await matchedUser(current)) continue;
                Console.WriteLine("Failed to match user");
                _userTasks.Enqueue(current);
                
            }
        }
    }

}