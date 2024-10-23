using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.BearerToken;
using SignalRChat;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Helpers;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authentication.Google;
using Grpc.Core;
using System.Collections.Concurrent;
using Services;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())  // Set the base path for configuration files
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true) // Load from appsettings.json
    .AddEnvironmentVariables(); 
    

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

Console.WriteLine("Key: "+builder.Configuration["Jwt:Key"]);

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
// builder.Logging.AddConsole();
builder.Services.AddAuthentication(options=>{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    // options.DefaultSignInScheme = GoogleDefaults.AuthenticationScheme;
    // options.DefaultAuthenticateScheme = "DefaultScheme"; // Set the default authentication scheme
    // options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme; // Set the default challenge scheme
    // options.DefaultSignInScheme = "GoogleScheme"; // Set the default sign-in scheme
})
.AddJwtBearer(options=>{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, //for now
        ValidateAudience = false, //for now
        ValidateLifetime = false,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    options.Events = new JwtBearerEvents{
        OnMessageReceived = context =>{
            // Console.WriteLine("MIddleware part 1: ");
            if(context.Request.Cookies.ContainsKey("token")){
                Console.WriteLine("Cookie exists");
                context.Token = context.Request.Cookies["token"];
                // Console.WriteLine(context.Token);
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>{
            // Console.WriteLine("Middleware Part 2");
            var userId = context.Principal.FindFirst(ClaimTypes.NameIdentifier).Value;
            // Console.WriteLine(userId);
            context.HttpContext.Items["UserId"] = userId;
            // Console.WriteLine("Http context UserId: " + context.HttpContext.Items["UserId"]);
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>{
           Console.WriteLine("How did this fail");
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        },
        OnForbidden = context => {
            Console.WriteLine("Forbidden entry");
            return Task.CompletedTask;
        }
        
    };
}).AddCookie("GoogleCookie", options =>
    {
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.LoginPath = "/api/user/google"; // Redirect path for login
        options.LogoutPath = "/api/user/logout"; // Redirect path for logout
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
    })
.AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"];
        options.ClientSecret = builder.Configuration["Google:ClientSecret"];
        options.SignInScheme = "GoogleCookie";
        // options.CallbackPath = "/signin-google";
        options.SaveTokens = true;
        options.Scope.Add("email");
        options.Scope.Add("profile");
        // options.
        options.Events = new OAuthEvents
        {
            OnCreatingTicket = async context =>
            {
                // Retrieve the access token
                var accessToken = context.AccessToken;
                var email = context.Identity.FindFirst(ClaimTypes.Email)?.Value;
                var _userHelper = context.HttpContext.RequestServices.GetRequiredService<UserHelper>();
                Console.WriteLine("Hello there from on creating ticket "+email);
                var existingUser = await _userHelper.checkUserExists(email);
                if(existingUser != null){
                    context.HttpContext.Items["UserId"] = existingUser.Id;
                    context.Identity.AddClaim(new Claim("UserId", existingUser.Id));
                }else{
                    Console.WriteLine("Creating the user");
                    await _userHelper.createUser(email,Guid.NewGuid().ToString());
                    var newUser = await _userHelper.checkUserExists(email);
                    context.HttpContext.Items["UserId"] = newUser.Id;
                    context.Identity.AddClaim(new Claim("UserId", newUser.Id));
                    Console.WriteLine("Hello");
                }
                Console.WriteLine(context.HttpContext.Items?["UserId"]);
                // Additional processing if needed
                Console.WriteLine("Created ticket successfully");
                // await Task.CompletedTask;
            },
            OnRemoteFailure = context =>
            {
                
                Console.WriteLine("Why did Google oauth fail"+context.Failure.Message);
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            },
           
        };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:5133",
                                "http://localhost:3000","http://localhost:5173", "https://accounts.google.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//background tasks and dependency injection for signalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<ConcurrentQueue<UserTask>>();
builder.Services.AddSingleton<ConnectedRoomsDictionary>();
builder.Services.AddSingleton<ConnectionsDictionary>();
builder.Services.AddHostedService<BackgroundTaskWorker>();

builder.Services.AddDbContext<MyDBContext>(options=> options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddScoped  <UserHelper>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
    {
        endpoints.MapHub<ChatHub>("/chatHub");
        endpoints.MapControllers();
        // Other endpoints
});
// app.MapControllers();



app.Run();




