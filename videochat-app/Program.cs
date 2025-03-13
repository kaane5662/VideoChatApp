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
using AspNet.Security.OAuth.GitHub;
using Microsoft.AspNetCore.Authentication.Cookies;
using Stripe;
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
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    // options.DefaultSignInScheme = "GithubCookie"; // Specify the sign-in scheme
    // options.DefaultChallengeScheme = "GitHub";
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
                // Console.WriteLine("Cookie exists");
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
});


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins("http://localhost:5133",
                                "http://localhost:3000","http://localhost:5173", "https://accounts.google.com", "https://video-chat-app-eight-zeta.vercel.app", "https://videochatapp-fwil.onrender.com", "https://videochatapp-frontend.onrender.com", "https://techmatch.live", "https://www.techmatch.live")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//background tasks and dependency injection for signalR
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});
builder.Services.AddSingleton<ConcurrentQueue<UserTask>>();
builder.Services.AddSingleton<ConnectedRoomsDictionary>();
builder.Services.AddSingleton<ConnectionsDictionary>();
builder.Services.AddSingleton<PreviousConnectionsDictionary>();
builder.Services.AddHostedService<BackgroundTaskWorker>();

builder.Services.AddDbContextFactory<MyDBContext>(options=> options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddScoped  <UserHelper>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
StripeConfiguration.ApiKey=builder.Configuration["Stripe:SecretKey"];
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




