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
using Microsoft.AspNetCore.Authentication.BearerToken;
using System.Text.Json;

[Route("/api/[controller]")]
[ApiController]
public class UserController : ControllerBase {
    private readonly MyDBContext _context;
    private readonly IDbContextFactory<MyDBContext> _contextFactory;
    private readonly IConfiguration _configuration;
    private readonly JwtHelper _jwtHelper;
    private readonly UserHelper _userHelper;

    public UserController(MyDBContext context, IConfiguration configuration, JwtHelper jwtHelper, UserHelper userHelper, IDbContextFactory<MyDBContext> contextFactory) {
        _context = context;
        _configuration = configuration;
        _jwtHelper = jwtHelper;
        _userHelper = userHelper;
        _contextFactory = contextFactory;
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
        var dbUser = _context.Users.Add(newUser);  
        string generatedToken = _jwtHelper.generateToken(dbUser.Entity.Id);
        // Console.WriteLine(generatedToken);
        Response.Cookies.Append("token",generatedToken, new CookieOptions{
                Expires = DateTime.UtcNow.AddHours(4),
                SameSite = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? SameSiteMode.None:SameSiteMode.Lax,
                HttpOnly = true,
                Secure = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? true:false,
                Domain= _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? _configuration["Base:Domain"]:null,
                
            });
        await _context.SaveChangesAsync();

        return Created("user",newUser);
        
    }

    [HttpPut("")]
    public async Task<IActionResult> Login([FromForm] UserInput userLogin) {
        Console.WriteLine(userLogin.Email);
        var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Email == userLogin.Email );
        
        if (user == null){
            return BadRequest("User does not exist");
        }
        if(user.LockoutEnd != null && user.LockoutEnd.Value.AddMinutes(5) > DateTime.UtcNow) return StatusCode(429,"Too many wrong attempts, try again in 5 minutes");
        var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(userLogin.Password));
        var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(userLogin.Password)));
        
        Console.WriteLine(passwordHash);
        Console.WriteLine(user.PasswordHash);
        if (user.PasswordHash != passwordHash ) {
            user.AccessFailedCount += 1;
            if(user.AccessFailedCount >= 8){
                Console.WriteLine("Too many attemps");
                user.LockoutEnd = DateTime.UtcNow;
                user.AccessFailedCount = 0;
            }
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return BadRequest("Invalid password");
        }
        // Console.WriteLine(user.Id);
        string generatedToken = _jwtHelper.generateToken(user.Id);
        // Console.WriteLine(generatedToken);
        
        Response.Cookies.Append("token",generatedToken, new CookieOptions{
                Expires = DateTime.UtcNow.AddHours(4),
                SameSite = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? SameSiteMode.None:SameSiteMode.Lax,
                HttpOnly = true,
                Secure = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? true:false,
                Domain= _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? _configuration["Base:Domain"]:null,
                
            });
        return Ok();
    }

    [HttpDelete("")]
    
    public async Task<IActionResult> LogOut() {
        try{
            Response.Cookies.Delete("token");
            Console.WriteLine("Logging out");
            
            return Ok();
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }
    [Authorize]
    [HttpPost("feedback")]
    
    public async Task<IActionResult> SendFeedback([FromBody] UserFeedbackInput feedbackInput) {
        try{
            Console.WriteLine("Passed input check");
            // await _context.UserFeedback.AddAsync(new UserFeedback{
            //     Feedback=feedbackInput.Feedback,
            //     Feature=feedbackInput.Feature
            // });
            
            return Ok();
        }catch(Exception err){
            return BadRequest(err.Message);
        }
    }

    [Authorize]
    [HttpGet("")]
    public async Task<IActionResult> GetUser(){
        Console.WriteLine("Inside the authorized route");
        try{

            HttpContext.Items.TryGetValue("UserId", out var userId);
            Console.WriteLine("Token: ",userId);
            var user = await _context.Users.FirstAsync(u=> u.Id == (string) userId);       
            if(user == null) return NotFound();
            Console.WriteLine("Days:"+(DateTime.Now-user.CreditsRenew).Days);
            if((DateTime.UtcNow-user.CreditsRenew).Days >= 30){
                user.Credits = 50;
                user.CreditsRenew = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            if((DateTime.UtcNow-user.MatchesRenew).Days >= 30){
                user.Matches=3;
                user.MatchesRenew = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            return Ok(user);    
        }catch(Exception err){
            Console.WriteLine(err);
            return BadRequest(err.Message);
        }
        

        
    }

    

    
    // Redirect to Google login page
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // return Challenge(new AuthenticationProperties { RedirectUri = "api/user/auth/google/callback" }, GoogleDefaults.AuthenticationScheme);
        // Console.WriteLine(nameof(GoogleCallback));
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
        // Console.WriteLine("USer ID:"+ userIdClaim);
        var generatedToken = _jwtHelper.generateToken(userIdClaim.Value);
        CookieOptions cookieOptions = CookieHelper.GenerateCookie(4);
        Response.Cookies.Append("token",generatedToken, cookieOptions);
        
       
        return Redirect("http://localhost:3000/dashboard");

        // Generate a JWT token for the user
        // return Ok(new { Token = token });
    }
    [HttpGet("github")]
    public IActionResult GithubLogin()
    {   
        string state = Guid.NewGuid().ToString();
        Response.Cookies.Append("OAuthState", state, new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Ensure this is set to true in production (requires HTTPS)
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(20)
        });
        var oauthUrl = $"https://github.com/login/oauth/authorize?client_id={_configuration["Github:ClientId"]}&redirect_uri={_configuration["Base:Url"]+"/api/user/github/callback"}&scope=user:email&state={state}";
        return Redirect(oauthUrl);
    }

    [HttpGet("github/callback")]
    public async Task<IActionResult> GithubCallback(string code, string state)
    {
        if (string.IsNullOrEmpty(code))
        {
            return BadRequest("No code received from GitHub");
        }

        var client = new HttpClient();
    
    // Token request URL
        var tokenRequestUrl = "https://github.com/login/oauth/access_token";
        var requestContent = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("client_id", _configuration["Github:ClientId"]),
            new KeyValuePair<string, string>("client_secret", _configuration["Github:ClientSecret"]),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", _configuration["Base:Url"]+"/api/user/github/callback"),
        });

        var response = await client.PostAsync(tokenRequestUrl, requestContent);

        if (!response.IsSuccessStatusCode)
        {
            return Unauthorized("GitHub token exchange failed");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var queryParams = System.Web.HttpUtility.ParseQueryString(responseContent);
        var accessToken =  queryParams["access_token"];
        var requestMessage = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
        
        // Add Authorization header to the request
        requestMessage.Headers.Add("Authorization", $"Bearer {accessToken}");
        requestMessage.Headers.Add("User-Agent", "YourApp");  // GitHub requires a User-Agent header

        var tokenResponse = await client.SendAsync(requestMessage);
        if (!tokenResponse.IsSuccessStatusCode)
        {
            throw new Exception("Failed to retrieve user email from GitHub.");
        }

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        
        var emailInfo = JsonSerializer.Deserialize<List<GithubProfile>>(tokenContent);
        Console.WriteLine(emailInfo.Count);
       
        var primaryEmail = emailInfo.FirstOrDefault();
        if(primaryEmail == null) return NotFound();
        User userExists = await _userHelper.checkUserExists(primaryEmail.Email);
        if(userExists == null){
            userExists = await _userHelper.createUser(primaryEmail.Email,Guid.NewGuid().ToString());
        }
        string generatedToken = _jwtHelper.generateToken(userExists.Id);
        CookieOptions cookieOptions = CookieHelper.GenerateCookie(4);
        Response.Cookies.Append("token",generatedToken, new CookieOptions{
                Expires = DateTime.UtcNow.AddHours(4),
                SameSite = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? SameSiteMode.None:SameSiteMode.Lax,
                HttpOnly = true,
                Secure = _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? true:false,
                Domain= _configuration["ASPNETCORE_ENVIRONMENT"] == "Production" ? _configuration["Base:Domain"]:null,
                
            });
        


        return Redirect("http://localhost:3000/platform/dashboard");

    }

    
}