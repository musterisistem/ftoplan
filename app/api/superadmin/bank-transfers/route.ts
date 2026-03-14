import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';

// GET: List all bank transfer orders (pending + completed)
export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const orders = await Order.find({
            paymentMethod: 'bank_transfer',
        })
            .populate('userId', 'name email studioName paymentStatus')
            .populate('packageId', 'name price')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('[SuperAdmin BankTransfers GET]', error);
        return NextResponse.json({ error: 'Havale listesi alınamadı.' }, { status: 500 });
    }
}

// POST: Approve or Reject a bank transfer
export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { orderId, action } = await req.json();
        if (!orderId || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
        }

        if (action === 'approve') {
            order.status = 'completed';
            order.completedAt = new Date();
            await order.save();

            // Activate the user's panel
            if (order.userId) {
                const user = await User.findById(order.userId);
                if (user) {
                    user.paymentStatus = 'active';
                    await user.save();

                    // Send Success SMS
                    try {
                        const { sendSMS } = await import('@/lib/netgsm');
                        const amount = order.amount || 0;
                        const successMsg = `${amount} TL lik isleminiz basari ile sonuclanmistir. Fatura bilgileriniz ile faturaniz tarafiniza mail adresinize iletilecektir. Iyi gunlerde kullaniniz. Weey.Net`;
                        await sendSMS(user.phone || '', successMsg);
                    } catch (smsErr) {
                        console.error('[BankTransfer Approval] SMS failed:', smsErr);
                    }
                }
            }

            return NextResponse.json({ success: true, message: 'Havale onaylandı, kullanıcı paneli aktif edildi.' });
        } else {
            order.status = 'failed';
            await order.save();

            return NextResponse.json({ success: true, message: 'Havale reddedildi.' });
        }
    } catch (error: any) {
        console.error('[SuperAdmin BankTransfers POST]', error);
        return NextResponse.json({ error: 'İşlem sırasında hata oluştu.' }, { status: 500 });
    }
}
