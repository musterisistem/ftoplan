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

            // For admin (photographer) role: enforce email verification and payment
            if (token.role === 'admin') {
                // 1. Enforce Email Verification for ALL admin users
                if (!token.isEmailVerified) {
                    if (pathname === '/verify-required') return NextResponse.next();
                    // Don't redirect verify-success or signout related flows if any
                    return NextResponse.redirect(new URL('/verify-required', req.url));
                }

                // 2. Enforce Payment for paid packages
                if (token.isActive === false) {
                    if (token.packageType === 'standart' || token.packageType === 'kurumsal') {
                        if (pathname === '/checkout') return NextResponse.next();
                        return NextResponse.redirect(new URL(`/checkout?package=${token.packageType}`, req.url));
                    }
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
        '/verify-required',
    ],
};
