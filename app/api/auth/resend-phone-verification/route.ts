import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendSMS } from '@/lib/netgsm';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen giriş yapın.' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
        }

        if (user.isPhoneVerified) {
            return NextResponse.json({ error: 'Telefon zaten doğrulanmış.' }, { status: 400 });
        }

        if (!user.phone) {
            return NextResponse.json({ error: 'Tanımlı bir telefon numarası bulunmuyor. Lütfen destek ile iletişime geçin.' }, { status: 400 });
        }

        // Generate new OTP
        const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const phoneOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);

        user.phoneVerificationCode = phoneOTP;
        user.phoneVerificationExpiry = phoneOTPExpiry;
        await user.save();

        // Send OTP SMS
        const otpMsg = `Weey.net doğrulama kodunuz: ${phoneOTP} Hesabınızı aktifleştirmek için bu kodu doğrulama ekranına giriniz. Kodu kimseyle paylaşmayınız.`;
        const result = await sendSMS(user.phone, otpMsg);

        if (!result.success) {
            console.error('Netgsm resend failed:', result.error);
            // Optionally, fallback to normal sendSMS if OTP fails, but OTP should work
            return NextResponse.json({ error: 'SMS gönderim servisinde bir hata oluştu.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Yeni doğrulama kodu gönderildi.' });

    } catch (error: any) {
        console.error('Resend Phone Verification Error:', error.message);
        return NextResponse.json({ error: 'Bir sunucu hatası oluştu.' }, { status: 500 });
    }
}
