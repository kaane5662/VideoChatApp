using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using System;
using System.IO;
using System.Threading.Tasks;
using Models;
using Stripe.Checkout;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Consts;


[Route("api/[controller]")]
[ApiController]
public class SubscriptionController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly MyDBContext _context;


    public SubscriptionController(IConfiguration configuration, MyDBContext context)
    {
        _configuration = configuration;
        _context = context;
    }
    
    [HttpPost("")]
    [Authorize]
    public async Task<IActionResult> CheckoutSession([FromBody] Dictionary<string,bool> request ) {
        Console.WriteLine("Hello there");
        try{
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            User user = await _context.Users.FirstOrDefaultAsync(u=>u.Id == IdentityUserId);
            if(user == null) return Forbid("Failed to fetch user");

            bool annualPlan = request["annualPlan"];
            Console.WriteLine(annualPlan);
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = annualPlan ? StripeConstants.Prices.Yearly:StripeConstants.Prices.Regular, // The Stripe Price ID for the subscription product
                        Quantity = 1,
                    },
                },
                Mode = "subscription",
                SuccessUrl = "https://yourwebsite.com/success",
                CancelUrl = "https://yourwebsite.com/cancel",
                Metadata = new Dictionary<string, string>
                {
                    { "userId", user.Id }
                }
                

            };
            if(user.StripeCustomerId != null)
                options.Customer = user.StripeCustomerId;
            var service = new SessionService();
            Session session = service.Create(options);
            return Created("",new {url=session.Url});
        }catch(Exception err){
            Console.WriteLine(err);
            return BadRequest(err.Message);
        }

    }

    [HttpGet("")]
    [Authorize]
    public async Task<IActionResult> BillingPortal() {
        try{
            
            string IdentityUserId = HttpContext.Items["UserId"]?.ToString();
            User user = await _context.Users.FirstOrDefaultAsync(u=>u.Id == IdentityUserId);
            if(user.StripeCustomerId==null) return NotFound("No stripe customer id");
            var options = new Stripe.BillingPortal.SessionCreateOptions
            {
                Customer = user.StripeCustomerId,
                ReturnUrl = "https://yourwebsite.com/account" // Redirect URL after the portal session ends
            };
            var service = new Stripe.BillingPortal.SessionService();
            var session = service.Create(options);
            return Ok(new {url=session.Url});
        }catch(Exception err){
            Console.WriteLine(err.ToString());
            return BadRequest(err.Message);
        }
    }

   
}
