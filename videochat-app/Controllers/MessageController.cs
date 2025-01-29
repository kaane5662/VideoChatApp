using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Pinecone;
using OpenAI;
using OpenAI.Embeddings;
// using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using System.Text.Json;
using System.Runtime.InteropServices;

[Authorize]
[Route("/api/[controller]")]
[ApiController]

public class MessagesController : ControllerBase {
    private readonly MyDBContext _context;
    private readonly IndexClient _pc; //Pinecone
    private readonly EmbeddingClient _ec; //OpenAI
    public MessagesController(MyDBContext context, IConfiguration configuration) {
        _context = context;
        Console.WriteLine("Pinecone "+configuration["Pinecone:ApiKey"]);
        PineconeClient pineconeClient= new PineconeClient(configuration["Pinecone:ApiKey"]);
        _pc = pineconeClient.Index("profiles");
        _ec = new (model: "text-embedding-3-small",configuration["OpenAI:ApiKey"]);
    }
    [HttpGet("")]
   
    public async Task<IActionResult> GetDirectMessages() {
        
        try{
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            Console.WriteLine("Im getting the direct messages");
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var dms =  await (
            from dm in _context.DirectMessages
            join p in _context.Profiles
            on dm.Profile1Id == profile.Id ? dm.Profile2Id : dm.Profile1Id equals p.Id
            join m in _context.Messages
            on dm.Id equals m.DirectMessageId
            where dm.Profile1Id == profile.Id || dm.Profile2Id == profile.Id
            orderby m.CreatedAt descending
            group new{dm,p,m} by dm.Id into groupedDms
            
            
            // group new{dm,m,p} by m.Id into groupedMessages
            // where groupedMessages.Any()
            // let latestMessage = groupedMessages
            // .OrderByDescending(g => g.m.CreatedAt)
            // .FirstOrDefault()
            select new { 
                RoomId=groupedDms.FirstOrDefault().dm.Id,
                RecentText = groupedDms.FirstOrDefault().m.Text,
                RecentCreatedAt = groupedDms.FirstOrDefault().m.CreatedAt,
                ProfileId = groupedDms.FirstOrDefault().p.Id,
                ProfileName = groupedDms.FirstOrDefault().p.FirstName,
                ProfileIndustry = groupedDms.FirstOrDefault().p.Industry
            }
            ).ToListAsync();
            Console.WriteLine("Done getting the direct messages"+dms);
            return Ok(dms);
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }
    [HttpGet("{id}")]

    public async Task<IActionResult> GetDirectMessageThread(int id) {
        try{
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var validDm = await _context.DirectMessages.FirstOrDefaultAsync(dm=> dm.Id == id && (dm.Profile1Id == profile.Id || dm.Profile2Id == profile.Id));
            if(validDm == null) return Forbid();
            var messages =  await (
                from m in _context.Messages
                join p in _context.Profiles
                on m.FromProfileId equals p.Id
                where m.DirectMessageId == id
                // orderby m.CreatedAt descending
                
                select new {
                    Text = m.Text,
                    CreatedAt = m.CreatedAt,
                    FirstName = p.FirstName,
                    FromProfileId=m.FromProfileId,
                }
            ).ToListAsync();
            var profileOther = await _context.Profiles.FirstOrDefaultAsync(p=> p.Id == (profile.Id == validDm.Profile1Id ? validDm.Profile2Id:validDm.Profile1Id) ) ;
            return Ok(profileOther);
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }
    [HttpGet("thread/{id}")]
    public async Task<IActionResult> GetMessagesInThread(int id, [FromQuery] DateTime date) {
        try{
            Console.WriteLine("Hello from get mesages in thread");
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var validDm = await _context.DirectMessages.FirstOrDefaultAsync(dm=> dm.Id == id && (dm.Profile1Id == profile.Id || dm.Profile2Id == profile.Id));
            if(validDm == null) return Forbid();
            var messages =  await (
                from m in _context.Messages
                join p in _context.Profiles
                on m.FromProfileId equals p.Id
                where m.DirectMessageId == id && m.CreatedAt < date
                orderby m.CreatedAt descending
                
                select new {
                    Text = m.Text,
                    CreatedAt = m.CreatedAt,
                    FirstName = p.FirstName,
                    FromProfileId=m.FromProfileId,
                    Id=m.Id
                }
            ).Take(10).ToListAsync();
            // messages = messages.OrderByDescending(m => m.CreatedAt).ToList();
            Console.WriteLine(messages);
            return Ok(messages);
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

    [HttpPost("")]
    
    public async Task<IActionResult> CreateDirectMessageThread([FromBody] Dictionary<string, int> request) {
        try{
            Console.WriteLine(request);
            if(request["targetProfileId"] == null) return NotFound();
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var existingDm = await _context.DirectMessages.FirstOrDefaultAsync(dm=> dm.Profile1Id == profile.Id || dm.Profile2Id == profile.Id);
            Console.WriteLine("Past the thing",existingDm,request["targetProfileId"]);
            if(existingDm == null) {
                var newDm = new DirectMessage {Profile1Id=profile.Id, Profile2Id=request["targetProfileId"]};
                await _context.DirectMessages.AddAsync(newDm);
                await _context.SaveChangesAsync();
                return Ok(newDm.Id);
                return Ok();
            }else{
                return Ok(existingDm.Id);
            } 
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

    [HttpDelete("bubble/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteMessageBubble(int id) {
        try{
            
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var existingMessage = await _context.Messages.FirstOrDefaultAsync(m=> m.FromProfileId == profile.Id && m.Id == id);
            if(existingMessage == null) return Forbid();
            _context.Messages.Remove(existingMessage);
            await _context.SaveChangesAsync();
            return Ok();
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }
    [HttpPut("bubble/{id}")]
    [Authorize]
    public async Task<IActionResult> EditMessageBubble(int id, [FromBody] Dictionary<string,string> req) {
        try{
            Console.WriteLine("Editing message");
            string text = req["text"];
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
            var existingMessage = await _context.Messages.FirstOrDefaultAsync(m=> m.FromProfileId == profile.Id && m.Id == id);
            if(existingMessage == null) return Forbid();
            existingMessage.Text = text ?? existingMessage.Text;
            _context.Messages.Update(existingMessage);
            await _context.SaveChangesAsync();
            return Ok();
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

    

    // [HttpPost]
    // public async Task<IActionResult> CreateDirectMessageThreadWith([FromBody] Dictionary<string, int> request) {
    //     try{
    //         Console.WriteLine(request);
    //         var text = request["message"];
    //         var targetProfileId = request["targetProfileId"];
    //         if(targetProfileId == null) return NotFound();
    //         string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
    //         var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == IdentityUserId);
    //         var existingDm = await _context.DirectMessages.FirstOrDefaultAsync(dm=> dm.Profile1Id == profile.Id || dm.Profile2Id == profile.Id);
    //         Console.WriteLine("Past the thing",existingDm,request["targetProfileId"]);
    //         if(existingDm == null) {
    //             var newDm = new DirectMessage {Profile1Id=profile.Id, Profile2Id=request["targetProfileId"]};
    //             await _context.DirectMessages.AddAsync(newDm);
    //             await _context.SaveChangesAsync();
    //             return Ok(new{RoomId = newDm.Id});
    //             return Ok();
    //         }else{
    //             return Ok(existingDm.Id);
    //         } 
    //     }catch(Exception err){
    //         Console.WriteLine(err.ToString());
    //         return BadRequest(err.Message);
    //     }
    // }


}