using Microsoft.EntityFrameworkCore;
using Models;
public class MyDBContext : DbContext{
    public MyDBContext(DbContextOptions<MyDBContext> options)  : base(options) {}
    public DbSet<User> Users { get; set;}
    public DbSet<Profile> Profiles { get; set;}

    protected override void OnModelCreating(ModelBuilder builder){
        // builder.Entity<Project>().HasNoKey();

    }
}