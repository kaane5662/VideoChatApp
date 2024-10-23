using System.Text;
using Microsoft.AspNetCore.Mvc;
using Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;

[Route("/api/[controller]")]
[ApiController]
public class UserController : ControllerBase {
    private readonly MyDBContext _context;
    private readonly IConfiguration _configuration;
    private readonly JwtHelper _jwtHelper;

    public UserController(MyDBContext context, IConfiguration configuration, JwtHelper jwtHelper) {
        _context = context;
        _configuration = configuration;
        _jwtHelper = jwtHelper;
    }

    [HttpPost("")]
    public async Task<IActionResult> Signup([FromForm] UserInputSignUp userSignUp){
        Console.WriteLine("Signing up");
        
        var result = await _context.Users.AnyAsync(u=>  u.Email == userSignUp.Email);
        Console.WriteLine(result);
        if(result ){
            return BadRequest("Username or email already exists");
        }
        Console.WriteLine(userSignUp.Email);
        Console.WriteLine(userSignUp.Password);
        var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(userSignUp.Password));
        var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(userSignUp.Password)));
        
        var newUser = new User{
            Email = userSignUp.Email,   
            PasswordHash = passwordHash, 
            UserName = userSignUp.UserName,
        };      
         _context.Users.Add(newUser);   
         await _context.SaveChangesAsync();
        return Created("user",newUser);
        
    }

    [HttpPut("")]
    public async Task<IActionResult> Login([FromForm] UserInput userLogin) {
        Console.WriteLine(userLogin.Email);
        var user = await _context.Users
        .FirstAsync(u => u.Email == userLogin.Email );
        if (user == null){
            return BadRequest("Invalid login attempt.");
        }
        var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(userLogin.Password));
        var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(userLogin.Password)));
        Console.WriteLine(passwordHash);
        Console.WriteLine(user.PasswordHash);
        if (user.PasswordHash != passwordHash ) {
            return BadRequest("Invalid password");
        }
        Console.WriteLine(user.Id);
        string generatedToken = _jwtHelper.generateToken(user.Id);
        Console.WriteLine(generatedToken);
        CookieOptions cookieOptions = CookieHelper.GenerateCookie(4);
        Response.Cookies.Append("token",generatedToken, cookieOptions);
        return Ok();
    }

    [HttpDelete("")]
    [Authorize]
    public async Task<IActionResult> LogOut() {
        Console.WriteLine("Logging out");
        try{
            string token = Request.Cookies["token"].ToString();
            CookieOptions expiredOptions = CookieHelper.GenerateCookie(-1);
            Response.Cookies.Append("token","", expiredOptions);
            return Ok();
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }

    [Authorize]
    [HttpGet("")]
    public async Task<IActionResult> GetUser(){
        Console.WriteLine("Inside the authorized route");
        if(HttpContext.Items.TryGetValue("UserId", out var userId)){
            Console.WriteLine("Token: ",userId);
            var user = await _context.Users.FirstAsync(u=> u.Id == (string) userId);
            if(user == null) return NotFound();
            return Ok(user);    
        }

        return Forbid();
    }

    // Redirect to Google login page
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // return Challenge(new AuthenticationProperties { RedirectUri = "api/user/auth/google/callback" }, GoogleDefaults.AuthenticationScheme);
        Console.WriteLine(nameof(GoogleCallback));
        var redirectUrl = Url.Action(nameof(GoogleCallback), "User", new { returnUrl="http://localhost:3000/dashboard" }); // URL callback
        var properties = new    AuthenticationProperties() { 
            RedirectUri = redirectUrl,
            Items =
            {
                { "LoginProvider", "Google" },
            },
            AllowRefresh = true,
        };
        properties.Items["state"] = Guid.NewGuid().ToString();
        return Challenge(properties,  "Google");
    }
    [HttpGet("google/callback")]
    
    public async Task<IActionResult> GoogleCallback()
    {
        Console.WriteLine("Hello from google callback");
        var result = await HttpContext.AuthenticateAsync("GoogleCookie");
        if (!result.Succeeded)
        {
            Console.WriteLine("Something wrong with auth");
            return Forbid(); // Handle failed authentication
        }

        // Retrieve the user ID stored during the OnCreatingTicket
        var userIdClaim = result.Principal.FindFirst("UserId");
        Console.WriteLine("USer ID:"+ userIdClaim);
        var generatedToken = _jwtHelper.generateToken(userIdClaim.Value);
        CookieOptions cookieOptions = CookieHelper.GenerateCookie(4);
        Response.Cookies.Append("token",generatedToken, cookieOptions);
        
       
        return Redirect("http://localhost:3000/dashboard");

        // Generate a JWT token for the user
        // return Ok(new { Token = token });
    }

    
}