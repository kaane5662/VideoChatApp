
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models {
    public class Profile {
        public int Id {get; set;}
        [Required]
        public string IdentityUserId {get; set;}
        
        public string? FirstName {get; set;}
        public string? LastName {get; set;}
        public required string[] ProgrammingLanguages {get; set;}
        public string[]? Frameworks {get; set;}
        public required string CurrentRole {get; set;}
        public string? Industry {get; set;}
        public string[]? DevelopmentInterests {get; set;}
        public string[]? Languages {get; set;}
        public required string Description {get; set;}
        public required string Avaliability {get; set;}
        public Project[]? projects{get; set;}
        public string[]? DatabasesUsed {get; set;}
        public  string[]? Certifications {get; set;}
        [NotMapped]
        public float SimilarityScore {get; set;}

        //for video chats
        public int Sessions{get; set;} = 0;
        public int Matches{get; set;} = 0;

        //urls
        public string GithubUrl{get; set;} = string.Empty;
        public string PortfolioUrl{get; set;} = string.Empty;
        public string LinkedInUrl{get; set;} = string.Empty;
        public string TwitterUrl{get; set;} = string.Empty;

       
    }
}