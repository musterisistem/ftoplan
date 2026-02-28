import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ShopierCheckout } from '@/lib/payment/shopier';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderNo } = body;

        if (!orderNo) {
            return NextResponse.json({ success: false, error: 'Sipariş numarası eksik.' }, { status: 400 });
        }

        await dbConnect();

        // Use dynamic imports to ensure models are registered in the current connection
        const { Order } = await import('@/models/Order');
        const { default: SystemSetting } = await import('@/models/SystemSetting');
        const { default: Package } = await import('@/models/Package'); // Ensure Package model is loaded for populate

        // Try to get keys from DB first, then Env
        const settings = await SystemSetting.findOne({});
        const shopierAccessToken = settings?.shopierAccessToken || process.env.SHOPIER_ACCESS_TOKEN;

        console.log('[Checkout] PAT Detection:', shopierAccessToken ? 'Found' : 'MISSING');

        // Get Pending Order with package info
        const order = await Order.findOne({ orderNo }).populate('packageId');

        if (!order) {
            console.error('[Checkout] Order not found:', orderNo);
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı. Lütfen paket seçimini tekrar yapın.' }, { status: 404 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ success: false, error: 'Bu sipariş zaten işlenmiş veya geçersiz.' }, { status: 400 });
        }

        const selectedPackage = order.packageId;
        if (!selectedPackage) {
            return NextResponse.json({ success: false, error: 'Paket bilgisi siparişte bulunamadı.' }, { status: 400 });
        }

        // Build Shopier payment request
        const shopier = new ShopierCheckout({
            accessToken: shopierAccessToken
        });

        const draftUser = order.draftUserData || {};

        const userData = {
            id: order.orderNo,
            amount: order.amount,
            currency: 'TRY' as const,
            buyer: {
                id: order._id.toString(),
                name: draftUser.name || 'Musteri',
                surname: draftUser.surname || draftUser.studioName || 'Kullanici',
                email: draftUser.email || 'destek@weey.net',
                phone: (draftUser.phone || '05555555555').replace(/\s/g, ''),
            },
            billing_address: {
                address: draftUser.address || draftUser.billingInfo?.address || 'Turkiye',
                city: draftUser.city || 'Istanbul',
                country: 'Turkey',
                postcode: '34000',
            },
        };

        const callbackUrl = `${process.env.NEXTAUTH_URL || 'https://www.weey.net'}/api/payment/shopier/callback`;

        try {
            const paymentUrl = await shopier.createCheckout(userData, callbackUrl);
            return NextResponse.json({ success: true, url: paymentUrl });
        } catch (apiErr: any) {
            console.error('[Checkout] Shopier API Error:', apiErr.message);
            return NextResponse.json({
                success: false,
                error: apiErr.message || 'Ödeme sayfası oluşturulamadı.',
                details: apiErr.stack // Add stack for debugging (temporary)
            }, { status: 502 });
        }

    } catch (error: any) {
        console.error('[Checkout] Fatal Error:', error.message, error.stack);
        return NextResponse.json({
            success: false,
            error: 'Ödeme sunucusu hatası (500). Görünüşe göre bir kod hatası var.',
            debug: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
