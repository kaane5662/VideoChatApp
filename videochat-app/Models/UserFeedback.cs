using System.ComponentModel.DataAnnotations;

namespace Models {
    public class UserFeedback {
        public int Id { get; set; }
        public string? UserId {get; set;}
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string Feature {get;set;}
        public required string Feedback {get;set;}

    }
}