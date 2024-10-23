using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Helpers{

    public class JwtHelper {
        private readonly IConfiguration _configuration;
        public JwtHelper(IConfiguration configuration) {
            _configuration = configuration;
        }

        public string generateToken(string userId){
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(new[]{
                    new Claim(ClaimTypes.NameIdentifier, userId)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token  = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public JwtSecurityToken ReadJwtToken(string tokenString){
            var handler = new JwtSecurityTokenHandler();

            if (handler.CanReadToken(tokenString)){
                // Read the token
                var token = handler.ReadJwtToken(tokenString);

                // Display token information
                Console.WriteLine("Issuer: " + token.Issuer);
                Console.WriteLine("Audience: " + token.Audiences.FirstOrDefault());
                Console.WriteLine("Expiration: " + token.ValidTo);
                return token;
            }else{
                Console.WriteLine("Invalid JWT token.");
                return null;
            }
        }


    }
}