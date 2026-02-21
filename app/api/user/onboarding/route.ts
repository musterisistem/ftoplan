import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Sadece admin (fotoğrafçı) rolleri için geçerli
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Geçersiz yetki' }, { status: 403 });
        }

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        user.hasCompletedOnboarding = true;
        await user.save();

        return NextResponse.json({ success: true, message: 'Onboarding tamamlandı olarak işaretlendi.' });

    } catch (error) {
        console.error('Onboarding update error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
