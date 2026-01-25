import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

export async function GET() {
    try {
        // Get current session with authOptions
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { isCorporateMember: false, corporateMembershipExpiry: null },
                { status: 200 }
            );
        }

        await dbConnect();

        // Find user
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({
                isCorporateMember: false,
                corporateMembershipExpiry: null,
            });
        }

        // If no customerId, user is not linked to a customer
        if (!user.customerId) {
            return NextResponse.json({
                isCorporateMember: false,
                corporateMembershipExpiry: null,
            });
        }

        // Find customer
        const customer = await Customer.findById(user.customerId);

        if (!customer) {
            return NextResponse.json({
                isCorporateMember: false,
                corporateMembershipExpiry: null,
            });
        }

        // Return corporate membership status
        return NextResponse.json({
            isCorporateMember: customer.isCorporateMember || false,
            corporateMembershipExpiry: customer.corporateMembershipExpiry || null,
        });

    } catch (error) {
        console.error('Error checking corporate membership:', error);
        return NextResponse.json(
            { isCorporateMember: false, corporateMembershipExpiry: null },
            { status: 200 }
        );
    }
}
