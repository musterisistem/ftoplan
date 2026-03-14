import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PhoneOTP from '@/models/PhoneOTP';

function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('90') && digits.length === 12) return digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) return digits.slice(1);
    return digits;
}

export async function POST(req: Request) {
    try {
        const { phone, code } = await req.json();

        if (!phone || !code) {
            return NextResponse.json({ error: 'Telefon ve kod gereklidir.' }, { status: 400 });
        }

        const normalized = normalizePhone(phone);
        await dbConnect();

        const otpRecord = await PhoneOTP.findOne({ phone: normalized });

        if (!otpRecord) {
            return NextResponse.json({ error: 'Kod bulunamadı veya süresi dolmuş. Yeniden gönder butonuna tıklayın.' }, { status: 400 });
        }

        if (otpRecord.expiresAt < new Date()) {
            await PhoneOTP.deleteOne({ _id: otpRecord._id });
            return NextResponse.json({ error: 'Kodun süresi dolmuş. Yeniden gönder butonuna tıklayın.' }, { status: 400 });
        }

        if (otpRecord.code !== code.trim()) {
            return NextResponse.json({ error: 'Girdiğiniz kod hatalı. Lütfen tekrar deneyin.' }, { status: 400 });
        }

        // Code is correct — delete the OTP from DB
        await PhoneOTP.deleteOne({ _id: otpRecord._id });

        return NextResponse.json({ success: true, valid: true });
    } catch (error: any) {
        console.error('[verify-phone-otp] Error:', error.message);
        return NextResponse.json({ error: 'Doğrulama sırasında bir hata oluştu.' }, { status: 500 });
    }
}
