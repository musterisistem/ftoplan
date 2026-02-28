import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';
import { ShopierCheckout } from '@/lib/payment/shopier';

const shopierApiKey = process.env.SHOPIER_API_KEY || '';
const shopierApiSecret = process.env.SHOPIER_API_SECRET || '';

export async function POST(req: Request) {
    try {
        // Shopier sends POST request with application/x-www-form-urlencoded
        const formData = await req.formData();
        const postData: Record<string, string> = {};
        formData.forEach((value, key) => {
            postData[key] = value.toString();
        });

        if (!shopierApiKey || !shopierApiSecret) {
            console.error('Shopier API key/secret not configured in environment variables.');
            return new Response('Configuration Error', { status: 200 }); // Return 200 so Shopier does not spam retries
        }

        const shopier = new ShopierCheckout({ apiKey: shopierApiKey, apiSecret: shopierApiSecret });
        const isValid = shopier.validateCallback(postData);

        if (!isValid) {
            console.error('Shopier Invalid Signature Callback:', postData);
            // Still return 200 to stop Shopier from retrying - just log the rejection
            return new Response('Invalid Signature', { status: 200 });
        }

        const { status, random_nr } = postData; // random_nr is our OrderNo

        await dbConnect();

        // Find the pending order
        const order = await Order.findOne({ orderNo: random_nr });

        if (!order) {
            console.warn('Shopier OSB Test or Unknown Order Callback:', random_nr);
            // Return 200 OK so Shopier OSB test passes. This is normal for test callbacks.
            return new Response('OK', { status: 200 });
        }

        if (status.toLowerCase() === 'success') {
            // Check if already completed to prevent double processing
            if (order.status === 'completed') {
                return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/admin/dashboard?payment=success`);
            }

            // 1. Update Order
            order.status = 'completed';
            order.completedAt = new Date();
            await order.save();

            // 2. We don't have a user yet. We must create one from draftUserData.
            const draftUser = order.draftUserData;
            const purchasedPackage = await Package.findById(order.packageId);

            if (!draftUser || !purchasedPackage) {
                console.error('Missing Draft Data or Package details:', draftUser, purchasedPackage);
                return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/packages?payment=draft-missing`);
            }

            // 3. Setup package limits
            const Subscriber = (await import('@/models/Subscriber')).default;
            const subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

            // Base limit definition mapped directly from the package
            const limits = {
                storageLimit: purchasedPackage.storage * 1024 * 1024 * 1024,
                maxCustomers: purchasedPackage.maxCustomers,
                maxPhotos: purchasedPackage.maxPhotos,
                maxAppointments: purchasedPackage.maxAppointments,
                hasWatermark: purchasedPackage.hasWatermark,
                hasWebsite: purchasedPackage.hasWebsite,
                supportType: purchasedPackage.supportType
            };

            // 4. Create User
            const newUser = await User.create({
                name: draftUser.name,
                studioName: draftUser.studioName,
                slug: draftUser.slug,
                email: draftUser.email,
                password: draftUser.hashedPassword, // Used the pre-hashed password from checkout step
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
                isActive: true, // Officially activated immediately because payment succeeded
                isEmailVerified: true, // Auto-verify email for paid users to reduce friction
                verificationToken: null,
                verificationTokenExpiry: null
            });

            // Add to Subscriber table for bulk mailing
            await Subscriber.create({
                email: draftUser.email.toLowerCase(),
                name: draftUser.name,
                studioName: draftUser.studioName,
                packageType: purchasedPackage.id,
                isActive: true
            });

            // 5. Update Order to record actual userId
            order.userId = newUser._id;
            await order.save();

            // Send Welcome Email
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');

            await sendEmailWithTemplate({
                to: draftUser.email,
                templateType: EmailTemplateType.WELCOME_PHOTOGRAPHER,
                photographerId: newUser._id.toString(),
                data: {
                    photographerName: draftUser.name,
                    studioName: draftUser.studioName,
                    loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/login`
                },
            });

            // 6. Redirect the user back to the login page with a success flag
            // (Shopier callback executes within the user's browser, so redirect works!)
            // Pass the email so we can pre-fill it or automatically trigger credential login on frontend if desired
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?payment=success&email=${encodeURIComponent(draftUser.email)}`);

        } else {
            // Payment Failed (Declined by Bank, insufficient funds, etc.)
            order.status = 'failed';
            await order.save();
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/packages?payment=failed`);
        }

    } catch (error: any) {
        console.error('Shopier Callback Error:', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/packages?payment=error`);
    }
}
