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

[Route("/api/[controller]")]
[ApiController]
public class LookingForController : ControllerBase {
    private readonly MyDBContext _context;
    static readonly HttpClient client = new HttpClient();
    private readonly IDbContextFactory<MyDBContext> _contextFactory;
    private readonly IndexClient _pc; //Pinecone
    private readonly EmbeddingClient _ec; //OpenAI
    public LookingForController(MyDBContext context, IConfiguration configuration, IDbContextFactory<MyDBContext> contextFactory) {
        _context = context;
        Console.WriteLine("Pinecone "+configuration["Pinecone:ApiKey"]);
        PineconeClient pineconeClient= new PineconeClient(configuration["Pinecone:ApiKey"]);
        _pc = pineconeClient.Index("profiles");
        _contextFactory = contextFactory;
        _ec = new (model: "text-embedding-3-small",configuration["OpenAI:ApiKey"]);
    }

    [HttpPost("")]
    [Authorize]
    public async Task<IActionResult> CreateLookingForProfile([FromBody] LookingForProfileInput lookingForProfileInput) {
        try{
            Console.WriteLine("You made it");
            // return BadRequest("Dur dru");
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            if(IdentityUserId== null) return Forbid();
            var profile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId==IdentityUserId);
            var exists = await _context.LookingForProfiles.FirstOrDefaultAsync(lp=>lp.IdentityUserId==IdentityUserId);
            if(exists != null) return BadRequest("Profile already exists");
            var newLookingForProfile = await _context.LookingForProfiles.AddAsync(new LookingForProfile{
                FirstName=profile.FirstName,
                LastName=profile.LastName,
                Description=lookingForProfileInput.Description,
                Availability=lookingForProfileInput.Availability,
                Role=lookingForProfileInput.Role,
                Industry=lookingForProfileInput.Industry,
                Frameworks=lookingForProfileInput.Frameworks,
                ProfileId=profile.Id,
                IdentityUserId=IdentityUserId,
                Timezone=profile.Timezone,
                Experience=lookingForProfileInput.Experience,
                Skills=lookingForProfileInput.Skills

            });
            await _context.SaveChangesAsync();
            // return Ok();
            LookingForProfileDTO copy = new LookingForProfileDTO(newLookingForProfile.Entity);


            string serializedInput = JsonConvert.SerializeObject(copy);
            Console.WriteLine(serializedInput);
            OpenAI.Embeddings.Embedding embedding = await _ec.GenerateEmbeddingAsync(serializedInput);
            Console.WriteLine(embedding);
            await _pc.UpsertAsync(new UpsertRequest{
                Vectors=new[]{
                    new Vector{
                        Id="lookingfor"+IdentityUserId,//add user id
                        Values = embedding.Vector,
                        Metadata=new Pinecone.Metadata{
                            {"type","looking"},
                            {"IdentityUserId",IdentityUserId}
                        }
                    },
                }    
            });
            return Created();

        }catch(Exception err){
            Console.WriteLine("An unexpected error has occured: "+err.ToString());
            return BadRequest(err);
        }

    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetLookingForProfile( int id) {
        try{
            var Profile = await _context.LookingForProfiles.Where(p => p.ProfileId == id).FirstAsync();
            if (Profile == null) return NotFound();
            Console.WriteLine("Profile: "+Profile);
            return Ok(Profile);
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }
    


    [Authorize]
    [HttpGet("")]
    public async Task<IActionResult> GetUserProfile() {
        Console.WriteLine("Dude what is going on");
        try{
            Console.WriteLine("Is this being called");
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            var Profile = await _context.LookingForProfiles.Where(p => p.IdentityUserId == IdentityUserId).FirstOrDefaultAsync();
            if (Profile == null) return NotFound();
            Console.WriteLine("Profile: "+Profile);
            return Ok(Profile);
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }

    [HttpGet("similar/{id}")]
    [Authorize]
    public async Task<IActionResult> GetSimilarProfilesById(int id, [FromQuery] uint results){
        
        try{
            Console.WriteLine(id);
            Profile otherProfile = await _context.Profiles.FirstAsync(p=>p.Id == id);
            
            FetchResponse profile = await _pc.FetchAsync(new FetchRequest{
                Ids=new[] { (string) otherProfile.IdentityUserId},
            });
            float[] profileVector = profile.Vectors.First().Value.Values.ToArray();
            QueryResponse matchingIds = await _pc.QueryAsync(new QueryRequest{
                Vector= profileVector,
                TopK=results,
                IncludeValues=true
            });
            // Console.WriteLine(matchingIds);
            var tasks = matchingIds.Matches
            .Select(async matchingId =>
            {
                using var dbContext = _contextFactory.CreateDbContext(); // Use context factory
                var matchingProfile = await dbContext.Profiles.FirstOrDefaultAsync(p => p.IdentityUserId == matchingId.Id);
                if(matchingProfile==null) return null;
                matchingProfile.SimilarityScore = matchingId.Score.Value;
                return matchingProfile;
            });
            var matchingProfilesPromise = await Task.WhenAll(tasks);
            var matchingProfiles = matchingProfilesPromise.ToList();
            Console.WriteLine("You made it here");
            var matchingProfilesFilter = matchingProfiles.Where(p=> p != null && p.IdentityUserId != (string) otherProfile.IdentityUserId).ToList();
            return Ok(matchingProfilesFilter);
            
        }catch(Exception err){
            Console.WriteLine(err.Message);
            return BadRequest(err.Message);
        }
    }
    [HttpGet("similar/")]
    [Authorize]
    public async Task<IActionResult> GetSimilarLookingForProfiles([FromQuery] uint results = 25){
        Console.WriteLine(results);
        try{
            HttpContext.Items.TryGetValue("UserId", out var UserId);
            var user = await _context.Users.FirstAsync(u=>u.Id==UserId);

            if(!user.Subscribed)
                return StatusCode(403,"User not subscribed");
            FetchResponse profile = await _pc.FetchAsync(new FetchRequest{
                Ids=new[] { (string) UserId},
            });
            var profileVector = profile.Vectors.First().Value.Values;
            Console.WriteLine("Profile Vector: "+profileVector.ToString());
            QueryResponse matchingIds = await _pc.QueryAsync(new QueryRequest{
                Vector= profileVector,
                TopK=results,
                IncludeValues=true,
                IncludeMetadata=true,
                Filter=new Pinecone.Metadata{
                    {"type","looking"}
                }
            
            });
            Console.WriteLine("The array length"+matchingIds.Matches.ToArray().Length);

            var tasks = matchingIds.Matches
            .Select(async matchingId =>
            {
                using var dbContext = _contextFactory.CreateDbContext(); // Use context factory
                var matchingProfile = await dbContext.LookingForProfiles.FirstOrDefaultAsync(p => p.IdentityUserId == matchingId.Metadata["IdentityUserId"].Value);
                if(matchingProfile==null) return null;
                matchingProfile.SimilarityScore = matchingId.Score.Value;
                return matchingProfile;
            });
            var matchingProfilesPromise = await Task.WhenAll(tasks);
            var matchingProfiles = matchingProfilesPromise.ToList();
            Console.WriteLine("You made it here");
            var matchingProfilesFilter = matchingProfiles.Where(p=> p != null && p.IdentityUserId != (string) UserId).ToList();
            return Ok(matchingProfilesFilter);
            
        }catch(Exception err){
            Console.WriteLine(err);
            Console.WriteLine("Error:"+err.Message);
            return BadRequest(err.Message);
        }
    }

    [HttpGet("search")]
    // [Authorize]
    public async Task<IActionResult> SearchLookingForProfiles([FromQuery] string[] avaliability, [FromQuery] string[] industry, [FromQuery] string[] languages, [FromQuery] string[] interests, [FromQuery] string[] currentRole,[FromQuery] int page){
        
        try{
            HttpContext.Items.TryGetValue("UserId", out var UserId);
            var user = _context.Users.First(u=>u.Id==UserId);
            if(!user.Subscribed)
                return StatusCode(403,"User not subscribed");
            
            var query = _context.LookingForProfiles.AsQueryable();
         
            if (avaliability != null && avaliability.Length > 0)
                query = query.Where(p => avaliability.Any(avail => p.Availability.Contains(avail)));

            // if (languages != null && languages.Length > 0)
            //     query = query.Where(p => languages.Any(lang => p.ProgrammingLanguages.Contains(lang)));
            
            if (industry != null && industry.Length > 0)
                query = query.Where(p => industry.Any(indus => p.Industry.Contains(indus)));
            
            // if (interests != null && interests.Length > 0)
            //     query = query.Where(p => interests.Any(inter => p.DevelopmentInterests.Contains(inter)));

            if (currentRole != null && currentRole.Length > 0)
                query = query.Where(p => currentRole.Any(cr => p.Role.Contains(cr)));
            
            var count = await query.CountAsync();
            var paginatedResults = await query.OrderBy(p=>p.Id).Skip((page-1)*6).Take(6).ToListAsync();
            
            return Ok(new{paginatedResults,count=Math.Ceiling( (double)count/6)});
            
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }


    [HttpPut("")]
    [Authorize]
    public async Task<IActionResult> UpdateLookingForProfile([FromBody] LookingForProfileInput lookingForProfileInput) {
        try{
            // Console.WriteLine("Looking for profile :"+lo)
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            Console.WriteLine("Cool input"+ lookingForProfileInput.Industry);
            var lookingForProfile = await _context.LookingForProfiles.FirstAsync(p=> p.IdentityUserId == IdentityUserId);
            if(lookingForProfile == null) return Forbid();


            lookingForProfile.Frameworks = lookingForProfileInput.Frameworks ?? lookingForProfile.Frameworks;
            lookingForProfile.Industry = lookingForProfileInput.Industry ?? lookingForProfile.Industry;
            lookingForProfile.Description = lookingForProfileInput.Description ?? lookingForProfile.Description;
            lookingForProfile.Availability = lookingForProfileInput.Availability ?? lookingForProfile.Availability;
            lookingForProfile.Skills = lookingForProfileInput.Skills ?? lookingForProfile.Skills;
            lookingForProfile.Experience = lookingForProfileInput.Experience ?? lookingForProfile.Experience;
       
          

            var newProfile = _context.LookingForProfiles.Update(lookingForProfile);
            await _context.SaveChangesAsync();
            // return Ok();
            LookingForProfileDTO copy = new LookingForProfileDTO(newProfile.Entity);
            string serializedProfile = JsonConvert.SerializeObject(copy);
            Console.WriteLine(serializedProfile);
            OpenAI.Embeddings.Embedding embedding = await _ec.GenerateEmbeddingAsync(serializedProfile);
            await _pc.UpdateAsync(new UpdateRequest{
                    Id = "lookingfor"+IdentityUserId,
                    Values = embedding.Vector,   
            });
            return Ok();
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

        


}