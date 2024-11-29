namespace Models {
    public class Message {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string Text { get; set; }
        public required int FromProfileId { get; set; }
        public required int DirectMessageId { get; set; }

    }
}