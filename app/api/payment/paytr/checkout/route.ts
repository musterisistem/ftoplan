import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PayTRCheckout } from '@/lib/payment/paytr';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderNo } = body;

        if (!orderNo) {
            return NextResponse.json({ success: false, error: 'Sipariş numarası eksik.' }, { status: 400 });
        }

        await dbConnect();

        // Dynamically import models
        const { Order } = await import('@/models/Order');
        const { default: SystemSetting } = await import('@/models/SystemSetting');
        await import('@/models/Package'); // Ensure Package model is loaded for populate

        // Try to get keys from DB first, then Env
        const settings = await SystemSetting.findOne({});
        const merchantId = settings?.paytrMerchantId || process.env.PAYTR_MERCHANT_ID;
        const merchantKey = settings?.paytrMerchantKey || process.env.PAYTR_MERCHANT_KEY;
        const merchantSalt = settings?.paytrMerchantSalt || process.env.PAYTR_MERCHANT_SALT;

        console.log('[PayTR Checkout] API Key Detection:', merchantId ? 'Found' : 'MISSING');

        if (!merchantId || !merchantKey || !merchantSalt) {
            console.error('[PayTR Checkout] PayTR API keys are missing in both DB and Env');
            return NextResponse.json({
                success: false,
                error: 'Ödeme altyapısı henüz yapılandırılmamış. Lütfen yönetici ile iletişime geçin.',
            }, { status: 503 });
        }

        // Get Pending Order
        const order = await Order.findOne({ orderNo }).populate('packageId');

        if (!order) {
            console.error('[PayTR Checkout] Order not found:', orderNo);
            return NextResponse.json({ success: false, error: 'Sipariş bulunamadı. Lütfen paket seçimini tekrar yapın.' }, { status: 404 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ success: false, error: 'Bu sipariş zaten işlenmiş veya geçersiz.' }, { status: 400 });
        }

        const selectedPackage = order.packageId;
        if (!selectedPackage) {
            return NextResponse.json({ success: false, error: 'Paket bilgisi siparişte bulunamadı.' }, { status: 400 });
        }

        // Build PayTR payment request
        const paytr = new PayTRCheckout({
            merchantId,
            merchantKey,
            merchantSalt,
            testMode: false // Canlı da false kalmalı, gerekirse env'den alınabilir
        });

        const draftUser = order.draftUserData || {};
        const baseUrl = process.env.NEXTAUTH_URL || 'https://www.weey.net';

        // Get client IP
        const forwardedFor = req.headers.get('x-forwarded-for');
        let userIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'; // Bazen lokalde 127.0.0.1 ya da ::1 gelebilir.
        if (userIp === '::1') userIp = '127.0.0.1'; // PayTR doesn't always like IPv6

        const orderData = {
            orderNo: order.orderNo,
            amount: order.amount,
            currency: 'TL' as const,
            userEmail: draftUser.email || 'destek@weey.net',
            userName: `${draftUser.name || 'Musteri'} ${draftUser.surname || draftUser.studioName || ''}`.trim(),
            userAddress: draftUser.address || draftUser.billingInfo?.address || 'Turkiye',
            userPhone: (draftUser.phone || '05555555555').replace(/\s/g, ''),
            userIp: userIp,
            basket: [
                [`FotoPlan Yazılım Paketi - ${selectedPackage.title}`, order.amount.toString(), 1]
            ] as Array<[string, string, number]>,
            okUrl: `${baseUrl}/checkout/success`, // The page user sees after successful payment in frame (If auto-redirected)
            failUrl: `${baseUrl}/checkout/fail`   // The page user sees if payment fails
        };

        try {
            const token = await paytr.getToken(orderData);
            return NextResponse.json({ success: true, token });
        } catch (apiErr: any) {
            console.error('[PayTR Checkout] API Error:', apiErr.message);
            return NextResponse.json({
                success: false,
                error: apiErr.message || 'Ödeme oturumu başlatılamadı.',
                details: apiErr.stack
            }, { status: 502 });
        }

    } catch (error: any) {
        console.error('[PayTR Checkout] Fatal Error:', error.message, error.stack);
        return NextResponse.json({
            success: false,
            error: 'Ödeme sunucusu hatası (500).',
            debug: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
