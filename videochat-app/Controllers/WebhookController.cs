using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using OneOf.Types;
using Stripe;
using Stripe.Checkout;
using Consts;

[Route("api/[controller]")]
[ApiController]
public class WebhookController : ControllerBase {
    private readonly MyDBContext _context;
    private readonly IConfiguration _configuration;
    private readonly string _webhookSecret;
    public WebhookController(MyDBContext context, IConfiguration configuration) {
        _context = context;
        _configuration = configuration;
        _webhookSecret = _configuration["Stripe:WebhookSecret"];
    }
    
    [HttpPost("stripe")]
    public async Task<IActionResult> StripeWebhook()
    {
        Console.WriteLine("Hello there from webhook");
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _webhookSecret,
                throwOnApiVersionMismatch:false
            );

            switch (stripeEvent.Type)
            {
                
                case Stripe.EventTypes.CheckoutSessionCompleted:
                    await HandleCheckoutSessionCompleted(stripeEvent);
                    break;
                case Stripe.EventTypes.InvoicePaymentSucceeded:
                    await HandleInvoicePaymentSucceeded(stripeEvent);
                    break;
                case Stripe.EventTypes.CustomerSubscriptionDeleted:
                    await HandleCustomerSubscriptionDeleted(stripeEvent);
                    break;
            }

            return Ok();
        }
        catch (StripeException e)
        {
            Console.WriteLine(e.Message);
            return BadRequest(new { error = e.Message });
        }
    }

    private async Task HandleCheckoutSessionCompleted(Event stripeEvent)
    {
        var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
        var service = new Stripe.Checkout.SessionService();
        var lineItems = await service.ListLineItemsAsync(session.Id);
        var customerId = session.CustomerId;
        var metadata = session.Metadata;

        if (metadata == null || !metadata.TryGetValue("userId", out string userId))
        {
            throw new Exception("Missing user ID in session metadata");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var priceId = lineItems.Data[0].Price.Id;
        
        if (priceId == StripeConstants.Prices.Yearly)
        {
            user.Subscribed = true;
            user.AnnualPlan = true;
            user.StripeCustomerId = user.StripeCustomerId ?? customerId;
          
        }
        else if (priceId == StripeConstants.Prices.Regular)
        {
            user.Subscribed = true;
            user.StripeCustomerId = user.StripeCustomerId ?? customerId;
       
        }
        _context.Update(user);
        await _context.SaveChangesAsync();
    }

    private async Task HandleInvoicePaymentSucceeded(Event stripeEvent)
    {
        var invoice = stripeEvent.Data.Object as Invoice;
        var customerId = invoice.CustomerId;
        var lastLineItem = invoice.Lines.Data[invoice.Lines.Data.Count - 1];
        var priceId = lastLineItem.Price.Id;
        var isNewSubscription = invoice.BillingReason == "subscription_create";

        var user = await _context.Users.FirstOrDefaultAsync(u=>u.StripeCustomerId == customerId);
        if (user == null) return; // Or handle the error as needed

        if (priceId == StripeConstants.Prices.Yearly)
        {
            user.Subscribed = true;
            user.AnnualPlan = true;
            // if (!isNewSubscription)
            // {
            //     user.Credits = Credits.Yearly;
            // }
        }
        else if (priceId == StripeConstants.Prices.Regular)
        {
            user.Subscribed = true;
            user.AnnualPlan = false;
            // if (!isNewSubscription)
            // {
            //     user.Credits = Credits.Premium;
            // }
        }

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    private async Task HandleCustomerSubscriptionDeleted(Event stripeEvent)
    {
        var subscription = stripeEvent.Data.Object as Subscription;
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.StripeCustomerId == subscription.CustomerId);
        if(user == null) throw new Exception("No user found");
        user.Subscribed = false;
        user.AnnualPlan = false;


        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}