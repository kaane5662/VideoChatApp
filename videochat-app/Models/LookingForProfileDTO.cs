namespace Models {
    public class LookingForProfileDTO {
        public LookingForProfileDTO(LookingForProfile profile){
            // this.ProgrammingLanguages = profile.Frameworks;
            this.Frameworks = profile.Frameworks;
            this.Role = profile.Role;
            this.Industry = profile.Industry;
            this.Description = profile.Description;
            this.Availability = profile.Availability;
            this.Skills = profile.Skills;
            this.Experience = profile.Experience;
        
        }
        public string[]? ProgrammingLanguages {get; set;}
        public string[]? Frameworks {get; set;}
        public string[]? Skills {get; set;}
        public string? Role {get; set;}
        public string Industry {get; set;}
        public string Description {get; set;}
        public string Experience {get; set;}
        public string? Availability {get; set;}

    }
}