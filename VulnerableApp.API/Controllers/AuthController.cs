using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using VulnerableApp.API.Models;
using VulnerableApp.API.Services;

namespace VulnerableApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // No input validation - Security vulnerability
            var user = await _userService.AuthenticateAsync(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _userService.GenerateJwtToken(user);

            return Ok(new LoginResponse
            {
                Token = token,
                User = user // Returning sensitive data including password
            });
        }

        [HttpPost("deserialize")]
        public IActionResult DeserializeData([FromBody] string jsonData)
        {
            try
            {
                // Insecure deserialization - Security vulnerability
                var settings = new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.All // Dangerous setting
                };
                
                var deserializedObject = JsonConvert.DeserializeObject(jsonData, settings);
                return Ok(new { message = "Deserialization successful", data = deserializedObject });
            }
            catch (Exception ex)
            {
                // Exposing sensitive error information
                return BadRequest(new { error = ex.ToString() });
            }
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users); // Returns all user data including passwords
        }

        [HttpGet("profile/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetProfile(string userId)
        {
            // No authorization check - any authenticated user can access any profile
            // Also potential SQL injection via userId parameter
            if (!int.TryParse(userId, out int id))
            {
                return BadRequest("Invalid user ID");
            }

            var profile = await _userService.GetUserProfileAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }

        // Debug endpoint that shouldn't be in production
        [HttpGet("debug/config")]
        public IActionResult GetConfig()
        {
            var config = new
            {
                DatabaseConnection = "Server=localhost;Database=VulnerableAppDB;User Id=sa;Password=Admin123!;",
                JwtSecret = "MyHardcodedSecretKey123456789",
                AdminPassword = "admin123",
                Environment = Environment.GetEnvironmentVariables()
            };

            return Ok(config);
        }
    }
}



