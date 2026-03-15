import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';

// DELETE - Delete a single order from history
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { orderId } = await params;

        // Find and delete the order
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
        }

        console.log('[Delete Order] Deleted order:', orderId, order.orderNo);

        return NextResponse.json({ 
            message: 'Sipariş silindi',
            orderNo: order.orderNo
        });

    } catch (error: any) {
        console.error('[Delete Order Error]', error);
        return NextResponse.json({ error: 'Sipariş silinemedi.' }, { status: 500 });
    }
}
