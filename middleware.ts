import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Public pages that should always be accessible
  if (
    request.nextUrl.pathname === "/dashboard/va-disability-calculator" ||
    request.nextUrl.pathname.startsWith("/community") ||
    request.nextUrl.pathname.startsWith("/dashboard/community")
  ) {
    return NextResponse.next();
  }

  // Removed redirection to allow landing page to be visible
  // if (request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // Prevent accessing admin dashboard from user dashboard and vice versa
  // This ensures complete separation between the two areas
  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    request.headers.get("referer")?.includes("/bdoc")
  ) {
    // If coming from admin section, redirect to admin overview
    return NextResponse.redirect(new URL("/bdoc/overview", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/bdoc")) {
    // In a real implementation, add actual authentication check here
    // For now, just ensure complete separation from user dashboard
    if (request.headers.get("referer")?.includes("/dashboard")) {
      // If coming from user dashboard, redirect back to user dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // In production, you would add real auth check here
    // const isAuthenticated = checkAdminAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/bdoc/:path*", "/community/:path*"]
};
