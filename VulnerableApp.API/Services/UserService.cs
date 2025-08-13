using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VulnerableApp.API.Data;
using VulnerableApp.API.Models;

namespace VulnerableApp.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private const string JwtSecret = "MyHardcodedSecretKey123456789"; // Hardcoded secret

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        // SQL Injection vulnerability - using raw SQL with string concatenation
        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            var sql = "SELECT * FROM Users WHERE Username = @username AND Password = @password";
            var users = await _context.Users.FromSqlRaw(sql, new Microsoft.Data.SqlClient.SqlParameter("@username", username), new Microsoft.Data.SqlClient.SqlParameter("@password", password)).ToListAsync();
            return users.FirstOrDefault();
        }

        // Another SQL Injection vulnerability
        public async Task<UserProfile?> GetUserProfileAsync(int userId)
        {
            var sql = $"SELECT * FROM Users WHERE Id = {userId}";
            var user = await _context.Users.FromSqlRaw(sql).FirstOrDefaultAsync();
            
            if (user == null) return null;

            return new UserProfile
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(JwtSecret);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddYears(1), // Extremely long token expiry - Security issue
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}



