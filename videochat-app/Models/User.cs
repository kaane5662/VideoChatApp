using Microsoft.AspNetCore.Identity;

namespace Models {
    public class User : IdentityUser {
        // public string UserName { get; set;}
        public Boolean Subscribed { get; set; } = false;
        public Boolean AnnualPlan { get; set; } = false;
        public string? StripeCustomerId { get; set; }

    }

}