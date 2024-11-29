using System;
using System.Text.Json;


public class GithubHelper{
    public static async Task<string> GetPrimaryEmail(dynamic context){
         var emailRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
        emailRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", context.AccessToken);

        var emailResponse = await context.Backchannel.SendAsync(emailRequest, context.HttpContext.RequestAborted);
        emailResponse.EnsureSuccessStatusCode();

        var emailJson = JsonDocument.Parse(await emailResponse.Content.ReadAsStringAsync());
        var emails = emailJson.RootElement.EnumerateArray();

        // Find the primary email
        string? primaryEmail = null;
        foreach (var email in emails)
        {
            if (email.GetProperty("primary").GetBoolean())
            {
                primaryEmail = email.GetProperty("email").GetString();
                break;
            }
        }

        return primaryEmail;
        // Add the primary email as a claim
        // if (primaryEmail != null)
        // {
        //     context.Identity.AddClaim(new Claim(ClaimTypes.Email, primaryEmail));
        // }
    }
}