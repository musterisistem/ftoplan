import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // ── Admin route protection ─────────────────────────────
        if (pathname.startsWith('/admin')) {
            // Not logged in → go to login
            if (!token) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            // Superadmin routes — no email verification required
            if (pathname.startsWith('/admin/superadmin')) {
                return NextResponse.next();
            }

            // For admin (photographer) role: enforce phone verification
            if (token.role === 'admin') {
                // 1. Enforce Phone Verification for ALL admin users
                if (!token.isPhoneVerified) {
                    if (pathname === '/verify-phone') return NextResponse.next();
                    // Don't redirect verify-success or signout related flows if any
                    return NextResponse.redirect(new URL('/verify-phone', req.url));
                }
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Ensure token exists before running middleware function
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        '/admin/:path*',
        '/verify-phone',
    ],
};
