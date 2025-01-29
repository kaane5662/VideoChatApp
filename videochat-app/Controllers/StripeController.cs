// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Logging;
// using Stripe;
// using System;
// using System.IO;
// using System.Threading.Tasks;
// using Models;
// using Stripe;
// using Stripe;

// [ApiController]
// [Route("api/[controller]")]
// public class StripeWebhookController : ControllerBase
// {
//     private readonly MyDBContext _context;
//     private readonly ILogger<StripeWebhookController> _logger;
//     private readonly string _stripeSecret;

//     public StripeWebhookController(MyDBContext context, ILogger<StripeWebhookController> logger)
//     {
//         _context = context;
//         _logger = logger;
//         _stripeSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET") ?? throw new InvalidOperationException("Stripe secret not configured");
//     }

//     [HttpPost]
//     public async Task<IActionResult> HandleWebhook()
//     {
//         var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
//         var stripeSignature = Request.Headers["Stripe-Signature"];

//         try
//         {
//             var stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, _stripeSecret);

//             switch (stripeEvent.Type)
//             {
//                 case Stripe.Events.:
//                     await HandleCheckoutSessionCompleted(stripeEvent);
//                     break;

//                 case Stripe.Events.InvoicePaymentSucceeded:
//                     await HandleInvoicePaymentSucceeded(stripeEvent);
//                     break;

//                 case Stripe.Events.CustomerSubscriptionDeleted:
//                     await HandleSubscriptionDeleted(stripeEvent);
//                     break;

//                 default:
//                     _logger.LogInformation($"Unhandled event type: {stripeEvent.Type}");
//                     break;
//             }

//             return Ok();
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Error processing Stripe webhook");
//             return StatusCode(500, new { error = "Something bad happened" });
//         }
//     }

//     private async Task HandleCheckoutSessionCompleted(Event stripeEvent)
//     {
//         var session = stripeEvent.Data.Object as Session;
//         var lineItems = await new SessionService().ListLineItemsAsync(session.Id);
//         var customerId = session.CustomerId;
//         var userId = session.Metadata?["userId"];

//         if (string.IsNullOrEmpty(userId)) return;

//         var user = await _context.Users.FindAsync(Guid.Parse(userId));
//         if (user == null) return;

//         var priceId = lineItems.Data[0].Price.Id;
//         if (priceId == "price_yearly")
//         {
//             user.Subscribed = true;
//             user.AnnualPlan = true;
//             user.StripeCustomerId = user.StripeCustomerId ?? customerId;
//             user.Credits = 100; // Example value for yearly credits
//         }
//         else if (priceId == "price_regular")
//         {
//             user.Subscribed = true;
//             user.StripeCustomerId = user.StripeCustomerId ?? customerId;
//             user.Credits = 50; // Example value for regular credits
//         }

//         await _context.SaveChangesAsync();
//     }

//     private async Task HandleInvoicePaymentSucceeded(Event stripeEvent)
//     {
//         var invoice = stripeEvent.Data.Object as Invoice;
//         var customerId = invoice.CustomerId;
//         var priceId = invoice.Lines.Data[^1].Price.Id;
//         var isNewSubscription = invoice.BillingReason == "subscription_create";

//         var users = _context.Users.Where(u => u.StripeCustomerId == customerId);

//         foreach (var user in users)
//         {
//             user.Subscribed = true;
//             user.AnnualPlan = priceId == "price_yearly";
//             if (!isNewSubscription)
//             {
//                 user.Credits += priceId == "price_yearly" ? 100 : 50; // Example credit values
//             }
//         }

//         await _context.SaveChangesAsync();
//     }

//     private async Task HandleSubscriptionDeleted(Event stripeEvent)
//     {
//         var subscription = stripeEvent.Data.Object as Subscription;
//         var customerId = subscription.CustomerId;

//         var users = _context.Users.Where(u => u.StripeCustomerId == customerId);

//         foreach (var user in users)
//         {
//             user.Subscribed = false;
//             user.AnnualPlan = false;
//             user.Credits = 0; // Example reset credits value
//         }

//         await _context.SaveChangesAsync();
//     }
// }
