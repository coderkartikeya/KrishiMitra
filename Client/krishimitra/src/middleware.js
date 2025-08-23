import { NextResponse } from 'next/server';

// Define protected routes that require authentication
// '/dashboard',
//   '/profile',
//   '/crops',
//   '/plantDisease',
//   '/schemes',
//   '/community',
//   '/finance',
const protectedRoutes = [
  
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
];

export function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if user is authenticated by looking for the auth cookie
  // In a real app, you would validate the token properly
  const authCookie = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authCookie;
  
  // If trying to access a protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page with a return URL
    const url = new URL('/login', request.url);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // If already authenticated and trying to access login/signup pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Match all request paths except for static files, api routes, etc.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};