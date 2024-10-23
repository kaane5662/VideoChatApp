using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Models {
    public class UserInput {
        [Required]
        public required string Email { get; set; }
        public string? UserName { get; set;}
        [Required]
        [StringLength(100, MinimumLength =8)]
        public required string Password { get; set;}
    }

}