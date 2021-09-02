using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TokenAuthAPI.Models;

namespace TokenAuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly JWTSettings _jwtsettings;

        public LoginController(IOptions<JWTSettings> jwtsettings)
        {
            _jwtsettings = jwtsettings.Value;
        }

        [HttpGet]
        public async Task<string> Login()
        {
            return "This is a secure call";
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserWithToken>> Login([FromBody] User user)
        {
            // normally would be db call to check if user is valid
            user.UserId = new Random().Next();
            user.EmailAddress = "test@prutech.com";

            var loggedInUser = new UserWithToken(user)
            {
                username = user.username
            };

            //sign your token here here..
            loggedInUser.AccessToken = GenerateAccessToken(user.UserId);
            return loggedInUser;
        }


        private string GenerateAccessToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtsettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, Convert.ToString(userId))
                }),
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}