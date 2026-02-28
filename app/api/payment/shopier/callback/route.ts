import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';
import { ShopierCheckout } from '@/lib/payment/shopier';

const shopierApiKey = process.env.SHOPIER_API_KEY || '';
const shopierApiSecret = process.env.SHOPIER_API_SECRET || '';
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';

export async function POST(req: Request) {
    try {
        // Shopier sends POST with application/x-www-form-urlencoded containing 'res' and 'hash'
        const formData = await req.formData();
        const postData: Record<string, string> = {};
        formData.forEach((value, key) => {
            postData[key] = value.toString();
        });

        // --------------- Validation ---------------
        if (!shopierApiKey || !shopierApiSecret) {
            console.error('[Shopier OSB] API credentials not configured');
            // Return plain text "success" so Shopier doesn't keep retrying
            return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const shopier = new ShopierCheckout({ apiKey: shopierApiKey, apiSecret: shopierApiSecret });

        // Use OSB format validation (res + hash)
        const callbackData = shopier.validateOSBCallback(postData);

        if (!callbackData) {
            console.error('[Shopier OSB] Invalid signature or missing res/hash fields. PostData keys:', Object.keys(postData));
            // Return success to prevent Shopier spam retries; log the issue
            return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const { orderid, istest, email, buyername } = callbackData;
        console.log(`[Shopier OSB] Callback received. OrderId: ${orderid}, isTest: ${istest}, buyer: ${email}`);

        await dbConnect();

        // --------------- Find Pending Order ---------------
        const order = await Order.findOne({ orderNo: orderid });

        if (!order) {
            // This is normal for OSB test calls or unknown orders — return success
            console.warn(`[Shopier OSB] No order found for orderid: ${orderid} (could be OSB test)`);
            return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // Already completed — prevent double processing
        if (order.status === 'completed') {
            console.log(`[Shopier OSB] Order ${orderid} already completed, skipping.`);
            return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // --------------- Process Payment Success ---------------
        order.status = 'completed';
        order.completedAt = new Date();
        await order.save();

        const draftUser = order.draftUserData;
        const purchasedPackage = await Package.findById(order.packageId);

        if (!draftUser || !purchasedPackage) {
            console.error('[Shopier OSB] Missing draftUserData or package for order:', orderid);
            return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // --------------- Create User ---------------
        const Subscriber = (await import('@/models/Subscriber')).default;
        const subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

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
            isEmailVerified: true, // Paid users get auto-verified
            verificationToken: null,
            verificationTokenExpiry: null,
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

        // Send welcome email
        try {
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');
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
        } catch (emailErr) {
            console.error('[Shopier OSB] Failed to send welcome email:', emailErr);
        }

        console.log(`[Shopier OSB] ✅ User created successfully: ${draftUser.email}`);

        // Shopier expects plain text "success" response
        return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });

    } catch (error: any) {
        console.error('[Shopier OSB] Callback Error:', error.message);
        // Always return 200 so Shopier doesn't spam retries
        return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
}
