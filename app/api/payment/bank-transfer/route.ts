import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';

const BANK_TRANSFER_DISCOUNT = 5; // 5% discount for bank transfers

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { orderNo, bankName, bankIban, amount } = await req.json();

        if (!orderNo) {
            return NextResponse.json({ error: 'Sipariş numarası gereklidir.' }, { status: 400 });
        }

        // Fetch order
        const order = await Order.findOne({ orderNo, status: 'pending', paymentMethod: 'bank_transfer' });
        if (!order) {
            return NextResponse.json({ error: 'Sipariş bulunamadı veya bu yöntem için geçerli değil.' }, { status: 404 });
        }

        // Update order with bank info and exact amount
        if (bankName) order.bankName = bankName;
        if (bankIban) order.bankIban = bankIban;
        if (amount) order.amount = amount;
        await order.save();

        const draftUser = order.draftUserData;
        if (!draftUser) {
            return NextResponse.json({ error: 'Sipariş başvuru bilgileri eksik.' }, { status: 400 });
        }

        // Check if user already created (idempotency)
        if (order.userId) {
            const token = order.autoLoginToken;
            return NextResponse.json({ success: true, autoLoginToken: token });
        }

        // Load package for setting limits
        const purchasedPackage = await Package.findById(order.packageId);
        if (!purchasedPackage) {
            return NextResponse.json({ error: 'Paket bilgisi bulunamadı.' }, { status: 404 });
        }

        const limits = {
            storageLimit: (purchasedPackage.storage || 10) * 1024 * 1024 * 1024,
            maxCustomers: purchasedPackage.maxCustomers ?? -1,
            maxPhotos: purchasedPackage.maxPhotos ?? -1,
            maxAppointments: purchasedPackage.maxAppointments ?? -1,
            hasWatermark: purchasedPackage.hasWatermark ?? false,
            hasWebsite: purchasedPackage.hasWebsite ?? false,
            supportType: purchasedPackage.supportType ?? 'E-posta',
        };

        const subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // Create user with pending_transfer status — panel is locked until admin approves
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
            intendedAction: 'purchase',
            heroTitle: draftUser.studioName,
            heroSubtitle: draftUser.phone,
            ...limits,
            subscriptionExpiry,
            billingInfo: draftUser.billingInfo,
            isActive: true,
            isPhoneVerified: false,
            phoneVerificationCode: phoneOTP,
            phoneVerificationExpiry: phoneOTPExpiry,
            legalConsents: draftUser.legalConsents || {},
            paymentStatus: 'pending_transfer', // KEY: Panel is locked until admin approves
        });

        // Create default shoot packages
        const { createDefaultPackages } = await import('@/lib/packageUtils');
        await createDefaultPackages(newUser._id);

        // Auto login token for seamless redirect
        const autoLoginToken = `btr_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        // Update order
        order.userId = newUser._id;
        order.status = 'awaiting_transfer';
        order.autoLoginToken = autoLoginToken;
        await order.save();

        // Send confirmation messages
        try {
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');
            const { sendSMS, sendOTP } = await import('@/lib/netgsm');
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';

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

            // 2. Welcome SMS
            const welcomeMsg = `${draftUser.studioName} WeeyNet aboneliginiz ile aramiza hos geldiniz. Professional fotografcilik paneliniz aktif edildi. Destek: 05517071494 - WeeyNet`;
            await sendSMS(newUser.phone, welcomeMsg);

            // 3. OTP Verification SMS
            const otpMsg = `Weey.net doğrulama kodunuz: ${phoneOTP} Hesabınızı aktifleştirmek için bu kodu doğrulama ekranına giriniz. Kodu kimseyle paylaşmayınız.`;
            await sendSMS(newUser.phone, otpMsg);

            // 4. Payment/Application Invoice Email
            await sendEmailWithTemplate({
                to: draftUser.email,
                templateType: EmailTemplateType.PAYMENT_SUCCESS_INVOICE,
                photographerId: newUser._id.toString(),
                data: {
                    packageName: purchasedPackage.name,
                    amount: order.amount,
                    paymentMethod: 'Banka Havalesi',
                }
            });

            // 5. Account Credentials Email
            await sendEmailWithTemplate({
                to: draftUser.email,
                templateType: EmailTemplateType.ACCOUNT_CREDENTIALS,
                photographerId: newUser._id.toString(),
                data: {
                    photographerEmail: draftUser.email,
                    photographerPassword: draftUser.password, // Original password from order draft
                    loginUrl: `${baseUrl}/login`
                }
            });
        } catch (msgErr) {
            console.error('[BankTransfer] Message sending failed:', msgErr);
        }

        return NextResponse.json({
            success: true,
            autoLoginToken,
            message: 'Başvurunuz alındı. Ödeme onaylandığında paneliniz aktive edilecektir.',
        });
    } catch (error: any) {
        console.error('[BankTransfer] Error:', error.message);
        return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu.' }, { status: 500 });
    }
}
