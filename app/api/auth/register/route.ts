import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';
        const {
            name,
            studioName,
            email,
            password,
            phone,
            address,
            intendedAction,
            selectedPackage,
            billingInfo
        } = body;

        // Basic Validation
        if (!email || !password || !name || !studioName) {
            return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları doldurun.' }, { status: 400 });
        }

        await dbConnect();

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor.' }, { status: 400 });
        }

        // Generate sequential numeric slug (0111, 0112, ...)
        // Find the highest existing numeric slug and increment
        const latestUser = await User.findOne(
            { slug: /^\d{4}$/ },
            { slug: 1 },
            { sort: { slug: -1 } }
        );

        let nextNumber = 111; // Start from 0111
        if (latestUser && latestUser.slug) {
            const parsed = parseInt(latestUser.slug, 10);
            if (!isNaN(parsed)) {
                nextNumber = parsed + 1;
            }
        }

        const slug = nextNumber.toString().padStart(4, '0');


        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create Package Draft Data
        const pkgType = selectedPackage || 'trial';
        const subscriptionExpiry = new Date();
        const Order = (await import('@/models/Order')).Order;
        const PackageModel = (await import('@/models/Package')).default;

        let dbPackage = null;
        if (pkgType !== 'trial') {
            dbPackage = await PackageModel.findOne({ id: pkgType });
            if (!dbPackage) {
                return NextResponse.json({ error: 'Geçersiz paket seçimi.' }, { status: 400 });
            }
            // Use price exactly as stored in DB - no rounding (preserves 109.99 etc.)
            // dbPackage.price is already the correct value
        }

        // Generate Verification Token
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const Subscriber = (await import('@/models/Subscriber')).default;

        // Package limits based on selected package type
        const packageLimits: Record<string, any> = {
            trial: {
                storageLimit: 524288000, // 500MB in bytes
                maxCustomers: 1,
                maxPhotos: 30,
                maxAppointments: 1,
                hasWatermark: true,
                hasWebsite: false,
                supportType: 'E-posta',
            },
            standart: {
                storageLimit: 10737418240, // 10GB in bytes
                maxCustomers: -1,
                maxPhotos: -1,
                maxAppointments: -1,
                hasWatermark: false,
                hasWebsite: false,
                supportType: 'E-posta',
            },
            kurumsal: {
                storageLimit: 32212254720, // 30GB in bytes
                maxCustomers: -1,
                maxPhotos: -1,
                maxAppointments: -1,
                hasWatermark: false,
                hasWebsite: true,
                supportType: '7/24 Öncelikli',
            }
        };

        const limits = packageLimits[pkgType] || packageLimits['trial'];

        // Generate Phone OTP
        const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);

        // If trial, proceed with creating User directly
        if (pkgType === 'trial') {
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 3);
            const newUser = await User.create({
                name,
                studioName,
                slug,
                email,
                password: hashedPassword, // Trial uses direct hash
                phone,
                address: address || billingInfo?.address || '',
                role: 'admin',
                packageType: pkgType,
                intendedAction: intendedAction || 'trial',
                heroTitle: studioName,
                heroSubtitle: phone,
                ...limits,
                subscriptionExpiry,
                billingInfo: {
                    companyType: billingInfo?.companyType || 'individual',
                    address: billingInfo?.address || address || '',
                    taxOffice: billingInfo?.taxOffice || '',
                    taxNumber: billingInfo?.taxNumber || '',
                    identityNumber: billingInfo?.identityNumber || '',
                },
                isActive: false,
                verificationToken,
                verificationTokenExpiry,
                isPhoneVerified: false,
                phoneVerificationCode: phoneOTP,
                phoneVerificationExpiry: phoneOTPExpiry,
                legalConsents: {
                    privacyPolicyConfirmed: body.legalConsents?.privacyPolicyConfirmed || false,
                    termsOfUseConfirmed: body.legalConsents?.termsOfUseConfirmed || false,
                    distanceSalesAgreementConfirmed: body.legalConsents?.distanceSalesAgreementConfirmed || false,
                    kvkkConfirmed: body.legalConsents?.kvkkConfirmed || false,
                    confirmedAt: new Date(),
                    ipAddress: ip
                }
            });

            // Send Phone OTP SMS immediately via standard SMS (OTP paketi aktif degil)
            try {
                const { sendSMS } = await import('@/lib/netgsm');
                const otpMsg = `WeeyNet hesap dogrulama kodunuz: ${phoneOTP} Lutfen dogrulama ekranina giriniz.`;
                const smsResult = await sendSMS(phone, otpMsg);
                if (!smsResult.success) console.error('[Register] SMS failed:', smsResult.error);
                else console.log('[Register] OTP SMS sent successfully to', phone);
            } catch (smsErr) {
                console.error('[Register] Initial SMS failed:', smsErr);
            }

            const { createDefaultPackages } = await import('@/lib/packageUtils');
            await createDefaultPackages(newUser._id);

            await Subscriber.create({
                // ... (Subscriber part already updated, I'll ensure it stays consistent)

                email: email.toLowerCase(),
                name,
                studioName,
                packageType: pkgType,
                isActive: false, // inactive until verified
                legalConsents: {
                    privacyPolicyConfirmed: body.legalConsents?.privacyPolicyConfirmed || false,
                    termsOfUseConfirmed: body.legalConsents?.termsOfUseConfirmed || false,
                    distanceSalesAgreementConfirmed: body.legalConsents?.distanceSalesAgreementConfirmed || false,
                    kvkkConfirmed: body.legalConsents?.kvkkConfirmed || false,
                    confirmedAt: new Date(),
                    ipAddress: ip
                }
            });

            // Send verification email
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');

            const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

            console.log(`[DEBUG] Verification URL for ${email}: ${verifyUrl}`);

            await sendEmailWithTemplate({
                to: email,
                templateType: EmailTemplateType.VERIFY_EMAIL,
                photographerId: newUser._id.toString(),
                data: {
                    photographerName: name,
                    verifyUrl,
                },
            });

            try {
                const { notifySuperadminNewUser } = await import('@/lib/superadmin-emails');
                await notifySuperadminNewUser(newUser);
            } catch (notifyErr) {
                console.error('[System] Superadmin notification failed:', notifyErr);
            }

            return NextResponse.json({
                success: true,
                isPaid: false,
                message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
                slug
            }, { status: 201 });

        } else {
            // Paid Package Flow -> Do NOT create User. Create a pending Order instead.
            // PayTR requires merchant_oid to be alphanumeric
            const orderId = `FP${Date.now()}${Math.floor(Math.random() * 1000)}`;

            // NOTE: SMS is NOT sent here for paid packages.
            // It will be sent ONLY after successful PayTR payment (in callback/route.ts).
            console.log(`[Register Paid] OTP generated and saved to order. Will send SMS after payment success. OrderNo: ${orderId}`);

            await Order.create({
                orderNo: orderId,
                packageId: dbPackage._id,
                amount: dbPackage.price,
                currency: 'TRY',
                status: 'pending',
                draftUserData: {
                    name,
                    studioName,
                    slug,
                    email,
                    password: password, // Store plain here to login via callback, or we can deal with hashes in callback
                    hashedPassword,
                    phone,
                    address: address || billingInfo?.address || '',
                    intendedAction: intendedAction || 'purchase',
                    phoneVerificationCode: phoneOTP,
                    phoneVerificationExpiry: phoneOTPExpiry,
                    billingInfo: {
                        companyType: billingInfo?.companyType || 'individual',
                        address: billingInfo?.address || address || '',
                        taxOffice: billingInfo?.taxOffice || '',
                        taxNumber: billingInfo?.taxNumber || '',
                        identityNumber: billingInfo?.identityNumber || '',
                    },
                    verificationToken,
                    verificationTokenExpiry,
                    legalConsents: {
                        privacyPolicyConfirmed: body.legalConsents?.privacyPolicyConfirmed || false,
                        termsOfUseConfirmed: body.legalConsents?.termsOfUseConfirmed || false,
                        distanceSalesAgreementConfirmed: body.legalConsents?.distanceSalesAgreementConfirmed || false,
                        kvkkConfirmed: body.legalConsents?.kvkkConfirmed || false,
                        confirmedAt: new Date(),
                        ipAddress: ip
                    }
                }
            });

            return NextResponse.json({
                success: true,
                isPaid: true,
                orderNo: orderId,
                message: 'Devam etmek için ödeme sayfasına yönlendiriliyorsunuz.',
            }, { status: 200 });
        }

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu.' }, { status: 500 });
    }
}
