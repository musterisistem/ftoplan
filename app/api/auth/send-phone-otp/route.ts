import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PhoneOTP from '@/models/PhoneOTP';
import { sendOTP } from '@/lib/netgsm';

// Normalize phone number: strip all non-digits, keep last 10 digits
function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    // Handle Turkish phones: 05xx -> 5xx, 905xx -> 5xx
    if (digits.startsWith('90') && digits.length === 12) return digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) return digits.slice(1);
    return digits;
}

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: 'Telefon numarası gereklidir.' }, { status: 400 });
        }

        const normalized = normalizePhone(phone);

        if (normalized.length < 10) {
            return NextResponse.json({ error: 'Geçerli bir telefon numarası girin.' }, { status: 400 });
        }

        await dbConnect();

        // Check how many existing users have this phone number (allow max 5)
        const existingCount = await User.countDocuments({ phone: { $regex: normalized } });
        if (existingCount >= 5) {
            return NextResponse.json({
                error: 'Bu telefon numarasıyla en fazla 5 hesap oluşturulabilir.'
            }, { status: 400 });
        }

        // Rate limiting: check if an OTP was sent recently (within 60 seconds)
        const recentOTP = await PhoneOTP.findOne({ phone: normalized }).sort({ createdAt: -1 });
        if (recentOTP) {
            const secondsAgo = (Date.now() - new Date(recentOTP.createdAt).getTime()) / 1000;
            if (secondsAgo < 60) {
                const waitSeconds = Math.ceil(60 - secondsAgo);
                return NextResponse.json({
                    error: `Lütfen ${waitSeconds} saniye bekleyip tekrar deneyin.`,
                    waitSeconds,
                }, { status: 429 });
            }
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any old OTPs for this phone
        await PhoneOTP.deleteMany({ phone: normalized });

        // Save new OTP
        await PhoneOTP.create({ phone: normalized, code });

        // Send OTP SMS
        const message = `Weey.net doğrulama kodunuz: ${code} Hesabınızı aktifleştirmek için bu kodu doğrulama ekranına giriniz. Kodu kimseyle paylaşmayınız.`;
        const result = await sendOTP(`0${normalized}`, message);

        if (!result.success) {
            console.error('[send-phone-otp] Netgsm error:', result.error);
            return NextResponse.json({ error: 'SMS gönderilemedi. Lütfen telefon numaranızı kontrol edin.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[send-phone-otp] Error:', error.message);
        return NextResponse.json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' }, { status: 500 });
    }
}
