
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Models {
    [Index(nameof(ProfileId))] // Single-column index
    [Index(nameof(IdentityUserId))] // Single-column index

    public class LookingForProfile {
        public int Id {get; set;}
        [Required]
        public required string IdentityUserId {get;set;}
        public required int ProfileId{get; set;}
        public required string FirstName {get; set;}
        public required string LastName {get; set;}
        public required string Timezone {get; set;}
        public string? Availability {get; set;}
        public required string Description{get;set;}
        public required string Role{get;set;}
        public required string[] Frameworks{get;set;}
        public required string Experience{get;set;}
        public  string[]? Skills{get;set;}
        public required string Industry{get;set;}
        [NotMapped]
        public float SimilarityScore {get; set;}
        

       
    }
}