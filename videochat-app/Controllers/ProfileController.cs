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
public class ProfileController : ControllerBase {
    private readonly MyDBContext _context;
    private readonly IndexClient _pc; //Pinecone
    private readonly EmbeddingClient _ec; //OpenAI
    public ProfileController(MyDBContext context, IConfiguration configuration) {
        _context = context;
        Console.WriteLine("Pinecone "+configuration["Pinecone:ApiKey"]);
        PineconeClient pineconeClient= new PineconeClient(configuration["Pinecone:ApiKey"]);
        _pc = pineconeClient.Index("profiles");
        _ec = new (model: "text-embedding-3-small",configuration["OpenAI:ApiKey"]);
    }

    [HttpPost("")]
    [Authorize]
    public async Task<IActionResult> CreateProfile([FromBody] ProfileInput profileInput) {
        try{
            
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            if(IdentityUserId== null) return Forbid();
            Console.WriteLine("The user id: "+IdentityUserId);
            // Console.WriteLine("The profile:"+JsonConvert.SerializeObject(profileInput));
            // string serializedInput = JsonConvert.SerializeObject(profileInput);
            if(await _context.Profiles.AnyAsync(p=> p.IdentityUserId == IdentityUserId)) return BadRequest();
            var newProfile = await _context.Profiles.AddAsync(new Profile{
                IdentityUserId = IdentityUserId,
                ProgrammingLanguages = profileInput.ProgrammingLanguages,
                Frameworks = profileInput.Frameworks,
                CurrentRole = profileInput.CurrentRole,
                // DatabasesUsed = profileInput.DatabasesUsed,
                Certifications = profileInput.Certifications,
                Industry = profileInput.Industry,
                DevelopmentInterests = profileInput.DevelopmentInterests,
                // Languages = profileInput.Languages,
                Description = profileInput.Description,
                Avaliability = profileInput.Avaliability,
                FirstName = profileInput.FirstName,
                LastName = profileInput.LastName,
                GithubUrl = profileInput.GithubUrl,
                LinkedInUrl = profileInput.LinkedInUrl,
                PortfolioUrl = profileInput.PortfolioUrl,
                TwitterUrl = profileInput.TwitterUrl,
            });
            await _context.SaveChangesAsync();
            ProfileDTO copy = new ProfileDTO(profileInput);
            // var input = pro

            string serializedInput = JsonConvert.SerializeObject(copy);
            Console.WriteLine(serializedInput);
            OpenAI.Embeddings.Embedding embedding = await _ec.GenerateEmbeddingAsync(serializedInput);
            Console.WriteLine(embedding);
            await _pc.UpsertAsync(new UpsertRequest{
                Vectors=new[]{
                    new Vector{
                        Id=IdentityUserId,//add user id
                        Values = embedding.Vector
                    }
                }    
            });
            return Created();

        }catch(Exception err){
            Console.WriteLine("An unexpected error has occured: "+err.ToString());
            return BadRequest(err);
        }

    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile( int id) {
        try{
            var Profile = await _context.Profiles.Where(p => p.Id == id).FirstAsync();
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
            var Profile = await _context.Profiles.Where(p => p.IdentityUserId == IdentityUserId).FirstAsync();
            if (Profile == null) return NotFound();
            Console.WriteLine("Profile: "+Profile);
            return Ok(Profile);
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }

    [HttpGet("similar/{id}")]
    [Authorize]
    public async Task<IActionResult> GetSimilarProfilesById(int id){
        
        try{
            Console.WriteLine(id);
            Profile otherProfile = await _context.Profiles.FirstAsync(p=>p.Id == id);
            
            FetchResponse profile = await _pc.FetchAsync(new FetchRequest{
                Ids=new[] { (string) otherProfile.IdentityUserId},
            });
            float[] profileVector = profile.Vectors.First().Value.Values.ToArray();
            QueryResponse matchingIds = await _pc.QueryAsync(new QueryRequest{
                Vector= profileVector,
                TopK=4,
                IncludeValues=true
            });
            // Console.WriteLine(matchingIds);
            var matchingProfiles = new List<Profile>();
            foreach(var matchingId in matchingIds.Matches.ToList()){
                var matchingProfile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == matchingId.Id);
                matchingProfile.SimilarityScore = matchingId.Score.Value;
                matchingProfiles.Add(matchingProfile);
            }
            Console.WriteLine(matchingProfiles.ToArray().ToString());
            return Ok(matchingProfiles);
            
        }catch(Exception err){
            Console.WriteLine(err.Message);
            return BadRequest(err.Message);
        }
    }
    [HttpGet("similar/")]
    [Authorize]
    public async Task<IActionResult> GetSimilarProfiles(){
        HttpContext.Items.TryGetValue("UserId", out var UserId);
        try{
            FetchResponse profile = await _pc.FetchAsync(new FetchRequest{
                Ids=new[] { (string) UserId},
            });
            float[] profileVector = profile.Vectors.First().Value.Values.ToArray();
            QueryResponse matchingIds = await _pc.QueryAsync(new QueryRequest{
                Vector= profileVector,
                TopK=25,
                IncludeValues=true,
                
                Filter =new Pinecone.Metadata
                {
                    ["Id"] =
                        new Pinecone.Metadata
                        {
                            ["$ne"] = (string) UserId,
                        }
                },
                        });
            
            // Console.WriteLine(matchingIds);
            var matchingProfiles = new List<Profile>();
            foreach(var matchingId in matchingIds.Matches.ToList()){
                var matchingProfile = await _context.Profiles.FirstAsync(p=>p.IdentityUserId == matchingId.Id);
                matchingProfile.SimilarityScore = matchingId.Score.Value;
                matchingProfiles.Add(matchingProfile);
            }
            return Ok(matchingProfiles);
            
        }catch(Exception err){
            Console.WriteLine(err.Message);
            return BadRequest(err.Message);
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchProfiles([FromQuery] string[] avaliability, [FromQuery] string[] industry, [FromQuery] string[] languages, [FromQuery] string[] interests, [FromQuery] string[] currentRole,[FromQuery] int page){
        
        try{
            var query = _context.Profiles.AsQueryable();
         
            if (avaliability != null && avaliability.Length > 0)
                query = query.Where(p => avaliability.Any(avail => p.Avaliability.Contains(avail)));

            if (languages != null && languages.Length > 0)
                query = query.Where(p => languages.Any(lang => p.ProgrammingLanguages.Contains(lang)));
            
            if (industry != null && industry.Length > 0)
                query = query.Where(p => industry.Any(indus => p.Industry.Contains(indus)));
            
            if (interests != null && interests.Length > 0)
                query = query.Where(p => interests.Any(inter => p.DevelopmentInterests.Contains(inter)));

            if (currentRole != null && currentRole.Length > 0)
                query = query.Where(p => currentRole.Any(cr => p.CurrentRole.Contains(cr)));
            
            var count = await query.CountAsync();
            var paginatedResults = await query.OrderBy(p=>p.Id).Skip((page-1)*3).Take(3).ToListAsync();
            
            return Ok(new{paginatedResults,count=Math.Ceiling( (double)count/3)});
            
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }


    [HttpPut("")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] ProfileInput profileInput) {
        try{
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            Console.WriteLine("Ideinty user id", IdentityUserId);
            var profile = await _context.Profiles.FirstAsync(p=> p.IdentityUserId == IdentityUserId);
            if(profile == null) return Forbid();

            profile.ProgrammingLanguages = profileInput.ProgrammingLanguages ?? profile.ProgrammingLanguages;
            profile.Frameworks = profileInput.Frameworks ?? profile.Frameworks;
            profile.CurrentRole = profileInput.CurrentRole ?? profile.CurrentRole;
            profile.DatabasesUsed = profileInput.DatabasesUsed ?? profile.DatabasesUsed;
            profile.Certifications = profileInput.Certifications ?? profile.Certifications;
            profile.Industry = profileInput.Industry ?? profile.Industry;
            profile.DevelopmentInterests = profileInput.DevelopmentInterests ?? profile.DevelopmentInterests;
            profile.Languages = profileInput.Languages ?? profile.Languages;
            profile.Description = profileInput.Description ?? profile.Description;
            profile.Avaliability = profileInput.Avaliability ?? profile.Avaliability;
            profile.FirstName = profileInput.FirstName ?? profile.FirstName;
            profile.LastName = profileInput.LastName ?? profile.LastName;
            profile.GithubUrl = profileInput.GithubUrl ?? profile.GithubUrl;
            profile.PortfolioUrl = profileInput.PortfolioUrl ?? profile.PortfolioUrl;
            profile.LinkedInUrl = profileInput.LinkedInUrl ?? profile.LinkedInUrl;
            profile.TwitterUrl = profileInput.TwitterUrl ?? profile.TwitterUrl;

            _context.Profiles.Update(profile);
            await _context.SaveChangesAsync();
            ProfileDTO copy = new ProfileDTO(profile);
            string serializedProfile = JsonConvert.SerializeObject(copy);
            Console.WriteLine(serializedProfile);
            OpenAI.Embeddings.Embedding embedding = await _ec.GenerateEmbeddingAsync(serializedProfile);
            await _pc.UpdateAsync(new UpdateRequest{
                    Id = IdentityUserId,
                    Values = embedding.Vector,   
            });
            return Ok();
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

    


}