import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const isDashboardRoute = url.pathname.startsWith('/dashboard');
  const isSignInRegistrationRoute = url.pathname === '/signin_registration';
  const isAuthApiRoute = url.pathname === '/api/auth';

  // Allow access to auth API routes and public pages
  if (isAuthApiRoute || url.pathname === '/' || url.pathname === '/vehicles') {
    return NextResponse.next();
  }

  // Get user data from session
  const session = request.cookies.get('session');
  if (!session) {
    // If no session, redirect to sign in
    if (isDashboardRoute) {
      url.pathname = '/signin_registration';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    // Parse session data
    const userData = JSON.parse(atob(session.value));
    
    // Log session data for debugging
    console.log('Session data in middleware:', userData);
    
    // Check if user is admin (role_id = 3)
    const isAdmin = userData.roles?.some(role => role.id === 3);
    console.log('Is admin:', isAdmin);

    // Protect dashboard routes
    if (isDashboardRoute && !isAdmin) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users from sign-in page
    if (isSignInRegistrationRoute && isAdmin) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If session parsing fails, treat as unauthenticated
    if (isDashboardRoute) {
      url.pathname = '/signin_registration';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin_registration',
    '/api/auth',
    '/',
    '/vehicles'
  ],
}; 