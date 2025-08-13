using Microsoft.EntityFrameworkCore;
using VulnerableApp.API.Models;

namespace VulnerableApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed data with hardcoded credentials
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Password = "admin123", // Plain text password
                    Email = "admin@vulnerable.com",
                    FullName = "Administrator",
                    Role = "Admin",
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    Id = 2,
                    Username = "user",
                    Password = "password", // Plain text password
                    Email = "user@vulnerable.com",
                    FullName = "Regular User",
                    Role = "User",
                    CreatedAt = DateTime.Now
                }
            );
        }
    }
}



