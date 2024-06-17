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
  console.log("Token : ", token);
  const url = request.nextUrl;
  console.log("URL access : ", url.pathname);
  if (
    token &&
    (url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname === "/verify" ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    if (
      (!token && url.pathname === "/dashboard") ||
      url.pathname === "/api/profile"
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
