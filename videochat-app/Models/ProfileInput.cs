
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
// using Newtonsoft.Json;

namespace Models {
    public class ProfileInput {
        [StringLength(100,MinimumLength =2,ErrorMessage ="Enter a valid first name")]
        public required string FirstName {get; set;}
        [StringLength(100,MinimumLength =2,ErrorMessage ="Enter a valid last name")]
        
        public required string LastName {get; set;}
        public required string[]? ProgrammingLanguages {get; set;}
        [Length(1,1000,ErrorMessage ="Enter at least one framework ")]
        public required string[] Frameworks {get; set;}
        [StringLength(100,MinimumLength =2,ErrorMessage ="Enter a valid role")]
        public required string CurrentRole {get; set;}
        [StringLength(100,MinimumLength =2,ErrorMessage ="Enter a valid industry")]
        public required string Industry {get; set;}
        public string[]? DevelopmentInterests {get; set;}
        // public string[]? Languages {get; set;}
        [StringLength(500,MinimumLength =20,ErrorMessage ="Enter a bio of at least 20 characters")]
        public required string Description {get; set;}
        public required string Availability {get; set;}
        [StringLength(30,MinimumLength =2   ,ErrorMessage ="Enter a valid experience level")]
        public required string Experience {get;set;}
        [StringLength(30,MinimumLength =2,ErrorMessage ="Enter a valid  timezone")]
        public required string Timezone {get;set;}
        // [Length(1,1000,ErrorMessage ="Enter at least one framework ")]
        public string[]? Skills {get;set;}
         public string GithubUrl{get; set;} = string.Empty;
        public string PortfolioUrl{get; set;} = string.Empty;
        public string LinkedInUrl{get; set;} = string.Empty;
        public string TwitterUrl{get; set;} = string.Empty;




        public string[]? DatabasesUsed {get; set;}
        public  string[]? Certifications {get; set;}
        public  string[]? Languages {get; set;}
    }
}