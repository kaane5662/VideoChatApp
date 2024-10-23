using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Helpers{

    public class UserHelper{
        private static  MyDBContext _context;
        public UserHelper(MyDBContext context){
            _context = context;
        }
        
        public async Task<User> checkUserExists(string email){
            var res = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (res == null) return null;
            return res;
        }
        public async Task createUser(string email, string password){
            Console.WriteLine("Creating the user");
            var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(password));
            var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            _context.Users.Add(new User{
                Email = email,
                PasswordHash = passwordHash
            });
            await _context.SaveChangesAsync();
        }
        public async Task<bool> signInUser(string email, string password){
            var res = await _context.Users.AddAsync(new User{
                Email = email,
                PasswordHash = password
            });
            if (res == null) return false;
            return true;
        }


    }
}
