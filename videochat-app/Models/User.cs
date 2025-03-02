using Microsoft.AspNetCore.Identity;

namespace Models {
    public class User : IdentityUser {
        // public string UserName { get; set;}
        public Boolean Subscribed { get; set; } = false;
        public Boolean AnnualPlan { get; set; } = false;
        public string? StripeCustomerId { get; set; }

        public int Credits {get;set;}  = 50;   
        public DateTime CreditsRenew {get;set;}  = DateTime.UtcNow;   
        public int Matches {get;set;}  = 3;   
        public DateTime MatchesRenew {get;set;}  = DateTime.UtcNow;   
    }

}