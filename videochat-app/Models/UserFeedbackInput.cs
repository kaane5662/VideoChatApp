using System.ComponentModel.DataAnnotations;

namespace Models {
    public class UserFeedbackInput {
        
        [RegularExpression("^(Profile Database|Direct Messages|AI Matches)$", ErrorMessage = "Invalid feature")]

        public required string Feature {get;set;}
        [StringLength(500,MinimumLength =50,ErrorMessage ="Feedback requires at least 50 characters")]
        public required string Feedback {get;set;}

    }
}