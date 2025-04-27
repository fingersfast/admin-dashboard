import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" || path === "/auth/login" || path === "/auth/register";

  // Get the token from session cookies
  const token = request.cookies.get("session")?.value || "";

  // Redirect logic for authenticated and unauthenticated users
  if (isPublicPath && token) {
    // If user is authenticated but trying to access public routes, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated and trying to access protected routes, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configure what paths should be processed by this middleware
export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/login", "/auth/register"],
};
