import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Token eksik' }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.findOne({ autoLoginToken: token });

        if (!order) {
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı veya bağlantı süresi dolmuş' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            status: order.status,
            orderNo: order.orderNo,
        });

    } catch (error: any) {
        console.error('[PayTR Status API] Error:', error);
        return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
    }
}
