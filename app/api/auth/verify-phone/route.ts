import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen giriş yapın.' }, { status: 401 });
        }

        const body = await req.json();
        const { code } = body;

        if (!code || code.length !== 6) {
            return NextResponse.json({ error: 'Geçersiz doğrulama kodu.' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
        }

        if (user.isPhoneVerified) {
            return NextResponse.json({ success: true, message: 'Hesap zaten doğrulanmış.' });
        }

        if (user.phoneVerificationCode !== code) {
            return NextResponse.json({ error: 'Hatalı doğrulama kodu.' }, { status: 400 });
        }

        if (user.phoneVerificationExpiry && user.phoneVerificationExpiry < new Date()) {
            return NextResponse.json({ error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.' }, { status: 400 });
        }

        // Verification successful
        user.isPhoneVerified = true;
        user.phoneVerificationCode = null;
        user.phoneVerificationExpiry = null;
        await user.save();

        // Send Professional Welcome SMS & Email
        try {
            const { sendSMS } = await import('@/lib/netgsm');
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';

            const welcomeMsg = `${user.studioName} WeeyNet aboneliginiz ile aramiza hos geldiniz. Professional fotografcilik paneliniz aktif edildi. Destek: 05517071494 - WeeyNet`;
            await sendSMS(user.phone, welcomeMsg);

            // Send Account Credentials Email
            await sendEmailWithTemplate({
                to: user.email,
                templateType: EmailTemplateType.ACCOUNT_CREDENTIALS,
                photographerId: user._id.toString(),
                data: {
                    photographerEmail: user.email,
                    photographerPassword: 'Kayıt sırasında belirlediğiniz şifreniz',
                    loginUrl: `${baseUrl}/login`
                }
            });
        } catch (smsErr) {
            console.error('[VerifyPhone] Welcome messages failed:', smsErr);
        }

        return NextResponse.json({ success: true, message: 'Telefon numarası başarıyla doğrulandı.' });

    } catch (error: any) {
        console.error('Verify Phone Error:', error.message);
        return NextResponse.json({ error: 'Bir sunucu hatası oluştu.' }, { status: 500 });
    }
}
