import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Order } from '@/models/Order';
import Package from '@/models/Package';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { ShopierCheckout } from '@/lib/payment/shopier';

// Ensure the options are set
const shopierOptions = {
    apiKey: process.env.SHOPIER_API_KEY || '',
    apiSecret: process.env.SHOPIER_API_SECRET || '',
};

export async function POST(req: Request) {
    try {
        const { orderNo } = await req.json();

        if (!orderNo) {
            return NextResponse.json({ success: false, error: 'Sipariş numarası eksik.' }, { status: 400 });
        }

        await dbConnect();

        // 1. Get Pending Order
        const order = await Order.findOne({ orderNo }).populate('packageId');

        if (!order) {
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı.' }, { status: 404 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ success: false, error: 'Bu sipariş zaten işlenmiş veya iptal edilmiş.' }, { status: 400 });
        }

        const selectedPackage = order.packageId;

        // 2. Prevent purchasing a free package via Shopier
        if (selectedPackage.price <= 0) {
            return NextResponse.json({ success: false, error: 'Bu paket ücretsizdir, ödeme yapılamaz.' }, { status: 400 });
        }

        // 3. Generate Shopier Payment Form HTML using Draft Data
        const shopier = new ShopierCheckout(shopierOptions);
        const draftUser = order.draftUserData || {};

        const userData = {
            id: order.orderNo, // Pass the Order No to relate the callback
            amount: order.amount,
            currency: 'TRY' as const,
            buyer: {
                id: order._id.toString(), // Shopier requires an ID string
                name: draftUser.name || 'FotoPlan',
                surname: draftUser.studioName || 'Müşteri',
                email: draftUser.email || 'musteri@fotoplan.com',
                phone: draftUser.phone || '05555555555',
            },
            billing_address: {
                address: draftUser.address || draftUser.billingInfo?.address || 'FotoPlan Dijital Hizmetler Bilişim',
                city: 'Istanbul',
                country: 'Turkey',
                postcode: '34000',
            }
        };

        const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payment/shopier/callback`;
        const paymentFormHtml = shopier.generatePaymentForm(userData, callbackUrl);

        // 5. Return the raw HTML for the browser to auto-submit
        return NextResponse.json({ success: true, html: paymentFormHtml });

    } catch (error: any) {
        console.error('Checkout Error:', error.message);
        return NextResponse.json({ success: false, error: 'Ödeme başlatılırken bir sorun oluştu.' }, { status: 500 });
    }
}
