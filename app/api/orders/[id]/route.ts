import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(req: Request, context: any) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Sipariş numarası eksik.' }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.findOne({ orderNo: id }).populate('packageId');

        if (!order) {
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı.' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                orderNo: order.orderNo,
                amount: order.amount,
                currency: order.currency,
                packageName: order.packageId?.name || 'Paket',
                packageId: order.packageId?.id || order.packageId?._id
            }
        });

    } catch (error: any) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ success: false, error: 'Sistem hatası.' }, { status: 500 });
    }
}
