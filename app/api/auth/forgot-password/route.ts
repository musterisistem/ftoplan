import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendSMS } from '@/lib/netgsm';

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; userId: string; expiresAt: number }>();

// Clean up expired codes every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of verificationCodes.entries()) {
        if (value.expiresAt < now) {
            verificationCodes.delete(key);
        }
    }
}, 5 * 60 * 1000);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { identifier } = await req.json(); // TC or Phone

        if (!identifier) {
            return NextResponse.json({ error: 'TC Kimlik No veya Telefon gerekli' }, { status: 400 });
        }

        // Clean identifier - remove all non-digit characters
        const cleanedIdentifier = identifier.replace(/\D/g, '');

        console.log('[Forgot Password] Searching for:', cleanedIdentifier);

        // Search user by TC (identityNumber) or phone
        // Try multiple phone formats
        const phoneFormats = [
            cleanedIdentifier, // Raw: 05381234567
            `+90${cleanedIdentifier.substring(1)}`, // +905381234567
            `0 (${cleanedIdentifier.substring(1, 4)}) ${cleanedIdentifier.substring(4, 7)} ${cleanedIdentifier.substring(7, 9)} ${cleanedIdentifier.substring(9, 11)}`, // 0 (538) 123 45 67
            `+90 (${cleanedIdentifier.substring(1, 4)}) ${cleanedIdentifier.substring(4, 7)} ${cleanedIdentifier.substring(7, 9)} ${cleanedIdentifier.substring(9, 11)}` // +90 (538) 123 45 67
        ];

        const user = await User.findOne({
            $or: [
                { 'billingInfo.identityNumber': cleanedIdentifier },
                { phone: { $in: phoneFormats } }
            ],
            role: 'admin' // Only photographers
        });

        console.log('[Forgot Password] User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('[Forgot Password] User phone:', user.phone);
            console.log('[Forgot Password] User TC:', user.billingInfo?.identityNumber);
        }

        if (!user) {
            return NextResponse.json({ error: 'Bu bilgilere ait üye bulunamadı' }, { status: 404 });
        }

        if (!user.phone) {
            return NextResponse.json({ error: 'Bu üyeye ait telefon numarası bulunamadı' }, { status: 400 });
        }

        // Generate 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store code with 10 minutes expiration
        const key = user._id.toString();
        verificationCodes.set(key, {
            code,
            userId: user._id.toString(),
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        // Send SMS - clean phone number for SMS
        const cleanPhone = user.phone.replace(/\D/g, '');
        const message = `Weey Foto Plan - Sifre sifirlama kodunuz: ${code}. Bu kod 10 dakika gecerlidir.`;
        
        try {
            await sendSMS(cleanPhone, message);
            console.log('[Forgot Password] SMS sent to:', cleanPhone);
        } catch (smsError) {
            console.error('SMS send error:', smsError);
            return NextResponse.json({ error: 'SMS gönderilemedi' }, { status: 500 });
        }

        // Mask phone number (show last 2 digits)
        const phoneDigits = cleanPhone.replace(/\D/g, '');
        const maskedPhone = `** (***) *** ** ${phoneDigits.slice(-2)}`;

        return NextResponse.json({
            success: true,
            maskedPhone,
            userId: user._id.toString()
        });

    } catch (error: any) {
        console.error('[Forgot Password Error]', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}

// Verify code endpoint
export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { userId, code, newPassword } = await req.json();

        if (!userId || !code || !newPassword) {
            return NextResponse.json({ error: 'Tüm alanlar gerekli' }, { status: 400 });
        }

        // Check verification code
        const stored = verificationCodes.get(userId);
        
        if (!stored) {
            return NextResponse.json({ error: 'Doğrulama kodu bulunamadı veya süresi doldu' }, { status: 400 });
        }

        if (stored.expiresAt < Date.now()) {
            verificationCodes.delete(userId);
            return NextResponse.json({ error: 'Doğrulama kodunun süresi doldu' }, { status: 400 });
        }

        if (stored.code !== code) {
            return NextResponse.json({ error: 'Hatalı doğrulama kodu' }, { status: 400 });
        }

        // Update password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, {
            password: hashedPassword
        });

        // Remove used code
        verificationCodes.delete(userId);

        return NextResponse.json({
            success: true,
            message: 'Şifreniz başarıyla güncellendi'
        });

    } catch (error: any) {
        console.error('[Verify Code Error]', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}
