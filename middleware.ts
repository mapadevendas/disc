import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isLogin = request.nextUrl.pathname === '/admin/login';
  const hasSupabaseSession = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token');
  if (isAdmin && !isLogin && process.env.NEXT_PUBLIC_SUPABASE_URL && !hasSupabaseSession) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
