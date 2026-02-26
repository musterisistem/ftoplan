import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json();
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

        // Generate Slug
        let baseSlug = (body.slug || studioName).toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphen
            .replace(/-+/g, '-') // collapse hyphens
            .replace(/^-|-$/g, ''); // trim hyphens

        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slug
        while (await User.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Package Type & Duration (Trial: 3 days, Others: 365 days)
        const pkgType = selectedPackage || 'trial';
        const subscriptionExpiry = new Date();
        if (pkgType === 'trial') {
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 3);
        } else {
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 365);
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

        // Create User
        const newUser = await User.create({
            name,
            studioName,
            slug,
            email,
            password: hashedPassword,
            phone,
            address: address || billingInfo?.address || '',
            role: 'admin',
            packageType: pkgType,
            intendedAction: intendedAction || 'trial',
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
            verificationTokenExpiry
        });

        // Add to Subscriber table for bulk mailing
        await Subscriber.create({
            email: email.toLowerCase(),
            name,
            studioName,
            packageType: selectedPackage || 'trial',
            isActive: false // inactive until verified
        });

        // Send verification email
        const { sendEmailWithTemplate } = await import('@/lib/resend');
        const { EmailTemplateType } = await import('@/models/EmailTemplate');

        const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

        await sendEmailWithTemplate({
            to: email,
            templateType: EmailTemplateType.VERIFY_EMAIL,
            photographerId: newUser._id.toString(),
            data: {
                photographerName: name,
                verifyUrl,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
            slug
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu.' }, { status: 500 });
    }
}
