import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Define the cookie name you're checking for
  const authCookie = request.cookies.get('token');
    console.log("Hello auth")
  // If the cookie is not found, redirect to the authentication page
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue with the request if the cookie is present
  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
//   matcher: ['/*:path*'], // Apply middleware to routes under /protected
    matcher: '/platform/:path*', // Matches all routes
};