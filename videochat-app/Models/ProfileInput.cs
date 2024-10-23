
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
// using Newtonsoft.Json;

namespace Models {
    public class ProfileInput:Profile {
        [JsonIgnore]
        public int Id { get; set; } 
        [JsonIgnore]
        public DateTime CreatedAt { get; set; } 
        [JsonIgnore]
        [NotMapped]
        public string? IdentityUserId { get; set; } =null;
        
        [JsonIgnore]
        public float SimilarityScore { get; set; }
        [JsonIgnore]
        public float Sessions { get; set; }
        [JsonIgnore]
        public float Matches { get; set; }
       
    }
}