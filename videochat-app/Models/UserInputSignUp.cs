using System.ComponentModel.DataAnnotations;

namespace Models {
    public class UserInputSignUp {
        [Required]
        public required string Email { get; set; }
        public string? UserName { get; set;}
        [Required]
        [StringLength(100, MinimumLength =8)]
        public required string Password { get; set;}
        [Compare("Password")]
        [Required]
        public required string ConfirmPassword { get; set;}
    }

}