import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/landing",
    "/privacy",
    // "/developer",
    // "/exploreServers",
    
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is the auth page
  const isAuthPage = pathname.startsWith("/auth");

  // Check if the current path is the root path
  const isRootPath = pathname === "/";

  // Handle root path redirects
  if (isRootPath) {
    if (token) {
      // If user has token, redirect to home
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      // If user doesn't have token, redirect to landing
      return NextResponse.redirect(new URL("/landing", request.url));
    }
  }

  // If user has a token and tries to access auth page, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If user has a token, allow access to all routes (except auth which is handled above)
  if (token) {
    return NextResponse.next();
  }

  // If user doesn't have a token
  if (!token) {
    // Allow access to public routes and auth page
    if (isPublicRoute || isAuthPage) {
      return NextResponse.next();
    }

    // Redirect to landing page for all other routes (protected routes)
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
