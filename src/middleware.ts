import { NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PREFIXES = [
  "/dashboard",
  "/planner",
  "/explore",
  "/history",
  "/settings",
];

const isProtectedPath = (pathname: string) =>
  AUTH_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = !!sessionToken;

  if (isAuthenticated && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/explore/map", request.url));
  }

  if (!isAuthenticated && isProtectedPath(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/planner/:path*",
    "/explore/:path*",
    "/history/:path*",
    "/settings/:path*",
  ],
};
