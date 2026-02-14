import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Get all customers for this photographer and populate user data
        const customers = await Customer.find({ photographerId: session.user.id })
            .populate('userId', 'email name isBlocked')
            .sort({ brideName: 1 });

        // Transform data for frontend
        const result = customers.map(c => ({
            id: c._id,
            userId: (c.userId as any)?._id,
            username: c.plainUsername || (c.userId as any)?.email, // Fallback to email if username missing
            name: `${c.brideName}${c.groomName ? ' & ' + c.groomName : ''}`,
            isBlocked: (c.userId as any)?.isBlocked || false,
            email: (c.userId as any)?.email
        }));

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { userId, isBlocked } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
        }

        await dbConnect();

        // Security check: Ensure this customer belongs to this photographer
        const customer = await Customer.findOne({ userId, photographerId: session.user.id });
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı veya yetkiniz yok' }, { status: 404 });
        }

        // Update User model's isBlocked field
        await User.findByIdAndUpdate(userId, { isBlocked });

        return NextResponse.json({ success: true, isBlocked });
    } catch (error: any) {
        console.error('Error toggling block status:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
