using System.Net;

namespace Helpers {
    public class CookieHelper(){
        public static CookieOptions GenerateCookie(int expiresInHours){
            return new CookieOptions{
                Expires = DateTime.UtcNow.AddHours(expiresInHours),
                SameSite = SameSiteMode.Lax,
                HttpOnly = true,
                Secure = false
            };
        }

        public static void ExpireCookie(Cookie cookie) => cookie.Expired = true;

    }

}