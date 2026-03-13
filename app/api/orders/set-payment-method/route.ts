import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';

// Sets paymentMethod on a pending order (called when user clicks "Havale" tab)
export async function POST(req: Request) {
    try {
        await dbConnect();
        const { orderNo, paymentMethod } = await req.json();

        if (!orderNo || !paymentMethod) {
            return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
        }

        const order = await Order.findOneAndUpdate(
            { orderNo, status: 'pending' },
            { paymentMethod },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
    }
}
