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

        // Capture original isActive state
        const originalIsActive = user.isActive;

        // Mark as verified
        user.isEmailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;

        // If user has already paid (isActive: true), preserve their 365-day expiry
        if (originalIsActive) {
            user.isActive = true;
            await user.save();
            return NextResponse.redirect(new URL('/login?verified=true&redirect=/admin/dashboard', req.url));
        }

        // If user hasn't paid yet but has purchase intent
        if (user.intendedAction === 'purchase' || user.packageType !== 'trial') {
            // Give a 1-day grace period to complete payment if not already active
            const graceExpiry = new Date();
            graceExpiry.setDate(graceExpiry.getDate() + 1);
            user.subscriptionExpiry = graceExpiry;
            user.isActive = true; // Activate for login
            await user.save();
            return NextResponse.redirect(new URL('/login?verified=true&redirect=/packages', req.url));
        }

        // For true trials
        // Reset trial start date to NOW (so they get full 3 days from verification)
        const freshExpiry = new Date();
        freshExpiry.setDate(freshExpiry.getDate() + 3);
        user.subscriptionExpiry = freshExpiry;
        user.isActive = true;
        await user.save();

        // Default redirect for trial
        return NextResponse.redirect(new URL(`/checkout/success?verified=true&email=${encodeURIComponent(email)}&token=${token}`, req.url));

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(new URL('/login?error=server_error', req.url));
    }
}
