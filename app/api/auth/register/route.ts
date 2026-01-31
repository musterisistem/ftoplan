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

        // Calculate Expiry (7 Days for Trial)
        const subscriptionExpiry = new Date();
        subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 7);

        // Generate Verification Token
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create User
        await User.create({
            name,
            studioName,
            slug,
            email,
            password: hashedPassword,
            phone,
            role: 'admin',
            packageType: 'trial',
            storageLimit: 3221225472, // 3GB
            subscriptionExpiry,
            billingInfo: billingInfo || {}, // Save billing info
            isActive: false, // Inactive until verified
            verificationToken,
            verificationTokenExpiry
        });

        // Send Verification Email
        const { sendEmail } = await import('@/lib/resend');
        const { VerifyEmail } = await import('@/lib/emails/VerifyEmail');

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const verifyUrl = `${baseUrl}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

        await sendEmail({
            to: email,
            subject: 'Kadraj Panel - E-posta Adresinizi Doğrulayın',
            react: VerifyEmail({ photographerName: name, verifyUrl })
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
