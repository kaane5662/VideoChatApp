using Microsoft.EntityFrameworkCore;
using Models;
public class MyDBContext : DbContext{
    public MyDBContext(DbContextOptions<MyDBContext> options)  : base(options) {}
    public DbSet<User> Users { get; set;}
    public DbSet<Profile> Profiles { get; set;}
    public DbSet<DirectMessage> DirectMessages{ get; set;}
    public DbSet<Message> Messages{ get; set;}
    public DbSet<UserFeedback> UserFeedback {get;set;}
    public DbSet<LookingForProfile> LookingForProfiles {get;set;}
    protected override void OnModelCreating(ModelBuilder builder){
        // builder.Entity<Project>().HasNoKey();

    }
}