using VulnerableApp.API.Models;

namespace VulnerableApp.API.Services
{
    public interface IUserService
    {
        Task<User?> AuthenticateAsync(string username, string password);
        Task<UserProfile?> GetUserProfileAsync(int userId);
        Task<List<User>> GetAllUsersAsync();
        string GenerateJwtToken(User user);
    }
}



