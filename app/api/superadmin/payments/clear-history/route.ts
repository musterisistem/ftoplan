import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function DELETE() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // Delete all bank transfer orders that are completed or failed (history items)
        const result = await Order.deleteMany({
            paymentMethod: 'bank_transfer',
            status: { $in: ['completed', 'failed'] }
        });

        console.log('[Clear History] Deleted orders:', result.deletedCount);

        return NextResponse.json({ 
            message: `${result.deletedCount} adet geçmiş işlem silindi`,
            deletedCount: result.deletedCount
        });

    } catch (error: any) {
        console.error('[Clear History Error]', error);
        return NextResponse.json({ error: 'Geçmiş işlemler silinemedi.' }, { status: 500 });
    }
}
