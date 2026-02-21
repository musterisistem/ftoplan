import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.redirect(new URL('/login?error=missing_params', req.url));
        }

        await dbConnect();

        const user = await User.findOne({
            email,
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
        }

        // Activate User and Clear Token
        user.isActive = true;
        user.isEmailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;

        if (user.intendedAction === 'purchase' || user.packageType !== 'trial') {
            // For paid packages, we do NOT give 7 days. We just verify email.
            // Expiry remains in the past (or whatever default it had, we set it to now so it is "expired" until they pay).
            user.subscriptionExpiry = new Date(Date.now() - 1000); // Expire immediately so they must pay
            await user.save();
            return NextResponse.redirect(new URL('/login?verified=true&redirect=/packages', req.url));
        }

        // For true trials
        // Reset trial start date to NOW (so they get full 7 days from verification)
        const freshExpiry = new Date();
        freshExpiry.setDate(freshExpiry.getDate() + 7);
        user.subscriptionExpiry = freshExpiry;
        await user.save();

        // Default redirect for trial
        return NextResponse.redirect(new URL('/login?verified=true', req.url));

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
    }
}
