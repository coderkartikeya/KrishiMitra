import { NextResponse } from 'next/server';
import { verifyToken } from './utils/jwt.js';
import { authHelpers } from './store/authStore.js';


// Define protected routes that require authentication
const protectedRoutes = [
  // '/dashboard',
  // '/profile',
  // '/mycrops',
  // '/plantDisease',
  // '/plantscan',
  '/market',
  // '/schemes',
  // '/soilAnalysis',
  // '/community',
  // '/help'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
];

// Function to verify JWT token
async function verifyAuthToken(token) {
  try {
    if (!token) return false;
    const decoded = verifyToken(token);
    return decoded && decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  console.log(pathname);
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  // console.log(accessToken);
  
  // Verify the token
  const isAuthenticated = authHelpers.isAuthenticated();
  
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