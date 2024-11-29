namespace Models {
    public class DirectMessage {
        public int Id { get; set; }
        public required int Profile1Id { get; set; }
        public required int Profile2Id { get; set;}
        
    }
}