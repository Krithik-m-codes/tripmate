import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// Middleware for Authentication
// Middleware to check if a user is authenticated
// and if not, redirect them to the sign-in page
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // console.log("Token [middleware] : ", token);
  const url = request.nextUrl;
  console.log("URL access [middleware]: ", url.pathname);
  if (
    token &&
    (url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/verify-email" ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/map", request.url));
  } else {
    if (
      !token &&
      (url.pathname === "/dashboard" ||
        url.pathname === "/api/profile" ||
        url.pathname === "/api/check-username-unique" ||
        url.pathname === "/api/weather-report" ||
        url.pathname === "/api/verify-code" ||
        url.pathname === "/api/resend-verify-code" ||
        url.pathname === "/api/saved-places" ||
        url.pathname === "/api/logout" ||
        url.pathname === "/api/search-history" ||
        url.pathname === "/api/search-history/[userId]" ||
        url.pathname === "/api/search-history/add" ||
        url.pathname === "/api/saved-places/[userId]" ||
        url.pathname === "/api/saved-places/add")
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

// Configuration for the middleware to run on the below paths
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/verify/:path*", "/dashboard/:path*"],
};
