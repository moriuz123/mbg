import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect /admin routes
  if (path.startsWith('/admin')) {
    try {
      // better-auth uses /api/auth/get-session to return session data
      const res = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const session = await res.json();
      
      if (!session || !session.user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const userRole = session.user.role || 'super_admin';

      // ==========================================
      // ROLE-BASED ACCESS CONTROL (RBAC) RULES
      // ==========================================
      
      // 1. Data SPPG: Hanya untuk Super Admin & SPPG
      if (path.startsWith('/admin/sppg') && !['super_admin', 'sppg'].includes(userRole)) {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
      }
      
      // 2. Penggilingan Gabah: Hanya untuk Super Admin & Penggilingan
      if (path.startsWith('/admin/penggilingan') && !['super_admin', 'penggilingan_gabah'].includes(userRole)) {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
      }
      
      // 3. Manajemen Menu Sistem: Hanya untuk Super Admin
      if (path.startsWith('/admin/manajemen-menu') && userRole !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
      }

      // Allow access if passed rules
      return NextResponse.next();
      
    } catch (error) {
      console.error('Middleware Auth Error:', error);
      // Fallback redirect if auth check fails completely
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged-in users from seeing login page
  if (path === '/login') {
    try {
      const res = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: { cookie: request.headers.get('cookie') || '' },
      });
      if (res.ok) {
        const session = await res.json();
        if (session && session.user) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
