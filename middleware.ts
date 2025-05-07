import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Removed redirection to allow landing page to be visible
  // if (request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
}

export const config = {
  matcher: '/',
};
