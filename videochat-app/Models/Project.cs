namespace Models {
    
    public class Project {
        public required int Id {get; set;}
        public required string title {get; set;}
        public required string description {get; set;}
        public required string[] tools {get; set;}
        
        public DateOnly? StartDate {get; set;}
        public DateOnly? EndDate {get; set;}


    }
}