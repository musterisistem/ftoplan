import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';
import { PayTRCheckout } from '@/lib/payment/paytr';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const SystemSetting = (await import('@/models/SystemSetting')).default;

        // Try to get keys from DB first, then Env
        const settings = await SystemSetting.findOne({});
        const merchantId = settings?.paytrMerchantId || process.env.PAYTR_MERCHANT_ID || '';
        const merchantKey = settings?.paytrMerchantKey || process.env.PAYTR_MERCHANT_KEY || '';
        const merchantSalt = settings?.paytrMerchantSalt || process.env.PAYTR_MERCHANT_SALT || '';
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';

        // PayTR sends POST with application/x-www-form-urlencoded
        const formData = await req.formData();
        const postData: Record<string, string> = {};
        formData.forEach((value, key) => {
            postData[key] = value.toString();
        });

        // --------------- Validation ---------------
        if (!merchantId || !merchantKey || !merchantSalt) {
            console.error('[PayTR Callback] API credentials not configured');
            // PayTR'a "OK" dönerek tekrar tekrar atmasını engelliyoruz. Zaten hata bizden kaynaklı.
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const paytr = new PayTRCheckout({ merchantId, merchantKey, merchantSalt });

        // Use Hash validation
        const isValid = paytr.validateCallback(postData);

        if (!isValid) {
            console.error('[PayTR Callback] Invalid signature. PostData:', postData);
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const { merchant_oid, status, total_amount, failed_reason_code = '', failed_reason_msg = '' } = postData;

        console.log(`[PayTR Callback] Received Valid Callback. OrderId: ${merchant_oid}, Status: ${status}`);

        // Status "success" ya da "failed" olabilir. 
        // Eğer "failed" ise kullanıcı reddedilmiş / limit yetersiz vb demektir.
        if (status !== 'success') {
            console.error(`[PayTR Callback] Payment failed for order ${merchant_oid}. Reason: ${failed_reason_msg} (${failed_reason_code})`);

            // Veritabanında sipariş durumunu "failed" yapabiliriz.
            const order = await Order.findOne({ orderNo: merchant_oid });
            if (order && order.status === 'pending') {
                order.status = 'failed';
                await order.save();
            }

            // PayTR expects 'OK' even if payment failed, to acknowledge receipt
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // --------------- Find Pending Order ---------------
        const order = await Order.findOne({ orderNo: merchant_oid });

        if (!order) {
            console.warn(`[PayTR Callback] No order found for orderid: ${merchant_oid}`);
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // Already completed — prevent double processing
        if (order.status === 'completed') {
            console.log(`[PayTR Callback] Order ${merchant_oid} already completed, skipping.`);
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // --------------- Process Payment Success ---------------
        order.status = 'completed';
        order.completedAt = new Date();
        await order.save();

        const draftUser = order.draftUserData;
        const purchasedPackage = await Package.findById(order.packageId);

        if (!draftUser || !purchasedPackage) {
            console.error('[PayTR Callback] Missing draftUserData or package for order:', merchant_oid);
            return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // --------------- Create User ---------------
        const Subscriber = (await import('@/models/Subscriber')).default;
        const subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

        const crypto = await import('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const limits = {
            storageLimit: (purchasedPackage.storage || 10) * 1024 * 1024 * 1024,
            maxCustomers: purchasedPackage.maxCustomers ?? -1,
            maxPhotos: purchasedPackage.maxPhotos ?? -1,
            maxAppointments: purchasedPackage.maxAppointments ?? -1,
            hasWatermark: purchasedPackage.hasWatermark ?? false,
            hasWebsite: purchasedPackage.hasWebsite ?? false,
            supportType: purchasedPackage.supportType ?? 'E-posta',
        };

        const newUser = await User.create({
            name: draftUser.name,
            studioName: draftUser.studioName,
            slug: draftUser.slug,
            email: draftUser.email,
            password: draftUser.hashedPassword,
            phone: draftUser.phone,
            address: draftUser.address,
            role: 'admin',
            packageType: purchasedPackage.id,
            intendedAction: draftUser.intendedAction || 'purchase',
            heroTitle: draftUser.studioName,
            heroSubtitle: draftUser.phone,
            ...limits,
            subscriptionExpiry,
            billingInfo: draftUser.billingInfo,
            isActive: true,
            isEmailVerified: false,
            verificationToken: verificationToken,
            verificationTokenExpiry: verificationTokenExpiry,
        });

        // Save subscriber record
        await Subscriber.create({
            email: draftUser.email.toLowerCase(),
            name: draftUser.name,
            studioName: draftUser.studioName,
            packageType: purchasedPackage.id,
            isActive: true,
        }).catch(() => { }); // Don't fail if already exists

        // Link order to newly created user
        order.userId = newUser._id;
        await order.save();

        // Send welcome & verification emails
        try {
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');

            // 1. Welcome Email
            await sendEmailWithTemplate({
                to: draftUser.email,
                templateType: EmailTemplateType.WELCOME_PHOTOGRAPHER,
                photographerId: newUser._id.toString(),
                data: {
                    photographerName: draftUser.name,
                    studioName: draftUser.studioName,
                    loginUrl: `${baseUrl}/login`,
                },
            });

            // 2. Email Verification Email
            const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(draftUser.email)}`;
            await sendEmailWithTemplate({
                to: draftUser.email,
                templateType: EmailTemplateType.VERIFY_EMAIL,
                photographerId: newUser._id.toString(),
                data: {
                    photographerName: draftUser.name,
                    verifyUrl,
                },
            });
        } catch (emailErr) {
            console.error('[PayTR Callback] Failed to send welcome/verification email:', emailErr);
        }

        console.log(`[PayTR Callback] ✅ User created successfully: ${draftUser.email}`);

        // PayTR expects plain text "OK" response
        return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });

    } catch (error: any) {
        console.error('[PayTR Callback] Runtime Error:', error.message);
        // Always return OK so PayTR stops retrying
        return new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
}
