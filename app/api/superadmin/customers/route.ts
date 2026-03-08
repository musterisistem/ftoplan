import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Find all customers and populate the photographer details
        const customers = await Customer.find()
            .sort({ createdAt: -1 })
            .lean()
            .populate({
                path: 'photographerId',
                select: 'name studioName email',
                model: User
            });

        return NextResponse.json(customers);

    } catch (error: any) {
        console.error('Customer pool fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
