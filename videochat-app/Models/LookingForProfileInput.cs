
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Models {

    public class LookingForProfileInput {


        public string? Availability {get; set;}
        [StringLength(250,MinimumLength =15,ErrorMessage ="Description must be at least 50 characters and no more than 250")]
        public required string Description{get;set;}
        [StringLength(100,MinimumLength =5,ErrorMessage ="Role must be at least 5 characters")]
        public required string Role{get;set;}
        [MinLength(1,ErrorMessage ="Enter at least one framework")]
        public required string[] Frameworks{get;set;}
        public required string Industry{get;set;}
        [StringLength(30,MinimumLength =2,ErrorMessage ="Enter a valid experience level")]

        public required string Experience{get;set;}
        public  string[]? Skills{get;set;}
        

       
    }
}