import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const body = await req.json();
        const { packageCode, paymentMethod } = body;

        if (!['standart', 'kurumsal'].includes(packageCode)) {
            return NextResponse.json({ error: 'Geçersiz paket seçimi' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Set Storage Limits based on Package
        // Standart: 10 GB = 10 * 1024 * 1024 * 1024 = 10737418240 bytes
        // Kurumsal: 30 GB = 30 * 1024 * 1024 * 1024 = 32212254720 bytes
        const storageLimit = packageCode === 'kurumsal' ? 32212254720 : 10737418240;

        // One year expiry
        const subscriptionExpiry = new Date();
        subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);

        user.packageType = packageCode;
        user.storageLimit = storageLimit;
        user.isActive = true; // Activate immediately for demo purposes
        user.subscriptionExpiry = subscriptionExpiry;

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Ödeme başarılı ve paket tanımlandı.',
            storageLimit,
            expiryDate: subscriptionExpiry
        });

    } catch (error) {
        console.error('Payment processing error:', error);
        return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' }, { status: 500 });
    }
}
