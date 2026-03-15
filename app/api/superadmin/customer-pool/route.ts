import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all customers with photographer details
        const customers = await Customer.find({})
            .populate('photographerId', 'name email studioName')
            .sort({ createdAt: -1 })
            .lean();

        console.log(`[Customer Pool] Fetched ${customers.length} customers`);

        return NextResponse.json(customers);

    } catch (error: any) {
        console.error('[Customer Pool] Error:', error);
        return NextResponse.json({ error: 'Müşteri verileri alınamadı' }, { status: 500 });
    }
}
