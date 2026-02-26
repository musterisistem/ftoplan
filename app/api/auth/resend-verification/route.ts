import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
        }

        if (user.isActive) {
            return NextResponse.json({ message: 'E-posta zaten doğrulanmış.' });
        }

        // Generate new verification token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = token;
        user.verificationTokenExpiry = expiry;
        await user.save();

        // Send verification email
        const { sendEmailWithTemplate } = await import('@/lib/resend');
        const { EmailTemplateType } = await import('@/models/EmailTemplate');

        const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/verify?token=${token}&email=${encodeURIComponent(user.email)}`;

        await sendEmailWithTemplate({
            to: user.email,
            templateType: EmailTemplateType.VERIFY_EMAIL,
            photographerId: user._id.toString(),
            data: {
                photographerName: user.name,
                verifyUrl,
            },
        });

        return NextResponse.json({ success: true, message: 'Doğrulama maili gönderildi.' });
    } catch (error: any) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Mail gönderilemedi.' }, { status: 500 });
    }
}
