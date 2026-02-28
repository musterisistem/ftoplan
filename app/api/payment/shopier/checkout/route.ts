import { NextResponse } from 'next/server';
import { Order } from '@/models/Order';
import dbConnect from '@/lib/mongodb';
import { ShopierCheckout } from '@/lib/payment/shopier';

export async function POST(req: Request) {
    try {
        const { orderNo } = await req.json();

        if (!orderNo) {
            return NextResponse.json({ success: false, error: 'Sipariş numarası eksik.' }, { status: 400 });
        }

        await dbConnect();
        const { Order } = await import('@/models/Order');
        const SystemSetting = (await import('@/models/SystemSetting')).default;

        // Try to get keys from DB first, then Env
        const settings = await SystemSetting.findOne({});
        const apiKey = settings?.shopierApiKey || process.env.SHOPIER_API_KEY;
        const apiSecret = settings?.shopierApiSecret || process.env.SHOPIER_API_SECRET;

        console.log('[Checkout] API Key source:', settings?.shopierApiKey ? 'Database' : (process.env.SHOPIER_API_KEY ? 'Environment' : 'MISSING'));
        console.log('[Checkout] Order requested:', orderNo);

        if (!apiKey || !apiSecret) {
            console.error('[Checkout] Shopier API keys are missing in both DB and Env');
            return NextResponse.json({
                success: false,
                error: 'Ödeme altyapısı henüz yapılandırılmamış. Lütfen tekrar deneyin.',
            }, { status: 503 });
        }

        // Get Pending Order with package info
        const order = await Order.findOne({ orderNo }).populate('packageId');

        if (!order) {
            console.error('[Checkout] Order not found:', orderNo);
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı. Kayıt formunu tekrar doldurun.' }, { status: 404 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ success: false, error: 'Bu sipariş zaten işlenmiş veya iptal edilmiştir.' }, { status: 400 });
        }

        const selectedPackage = order.packageId;

        if (!selectedPackage || selectedPackage.price <= 0) {
            return NextResponse.json({ success: false, error: 'Bu paket ücretsizdir, ödeme yapılamaz.' }, { status: 400 });
        }

        // Build Shopier payment request using REST API
        const shopier = new ShopierCheckout({
            accessToken: settings?.shopierAccessToken || process.env.SHOPIER_ACCESS_TOKEN
        });

        const draftUser = order.draftUserData || {};

        const userData = {
            id: order.orderNo,
            amount: order.amount,
            currency: 'TRY' as const,
            buyer: {
                id: order._id.toString(),
                name: draftUser.name || 'Musteri',
                surname: draftUser.studioName || 'Fotograf',
                email: draftUser.email || 'musteri@weey.net',
                phone: (draftUser.phone || '05555555555').replace(/\s/g, ''),
            },
            billing_address: {
                address: draftUser.billingInfo?.address || draftUser.address || 'Turkiye',
                city: 'Istanbul',
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
            return NextResponse.json({ success: false, error: apiErr.message || 'Shopier ile bağlantı kurulamadı.' }, { status: 502 });
        }

    } catch (error: any) {
        console.error('[Checkout] Fatal Error:', error.message, error.stack);
        return NextResponse.json({ success: false, error: 'Ödeme başlatılırken beklenmedik bir sorun oluştu. Lütfen tekrar deneyin.' }, { status: 500 });
    }
}
