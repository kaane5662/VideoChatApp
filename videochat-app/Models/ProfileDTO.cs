namespace Models {
    public class ProfileDTO {
        public ProfileDTO(Profile profile){
            this.ProgrammingLanguages = profile.ProgrammingLanguages;
            this.Frameworks = profile.Frameworks;
            this.CurrentRole = profile.CurrentRole;
            this.Industry = profile.Industry;
            this.DevelopmentInterests = profile.DevelopmentInterests;
            this.Description = profile.Description;
            this.Availability = profile.Availability;
            this.Experience = profile.Experience;
            this.Skills = profile.Skills;
        }
        public string[]? ProgrammingLanguages {get; set;}
        public string[]? Frameworks {get; set;}
        public string? CurrentRole {get; set;}
        public string? Industry {get; set;}
        public string[]? DevelopmentInterests {get; set;}
        public string? Description {get; set;}
        public string? Availability {get; set;}
        public string? Experience {get;set;}
        public string[]? Skills {get;set;}

    }
}