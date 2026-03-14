import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { sendSMS } from '@/lib/netgsm';
import User from '@/models/User';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Fotoğrafçıyı bulalim (Kendi müşterisi olduğunu doğrulamak için userId lazım)
        const photographer = await User.findOne({ email: session.user.email });
        if (!photographer) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const customer = await Customer.findById(params.id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Check ownership (Superadmins can bypass)
        if (session.user.role !== 'superadmin' && customer.userId.toString() !== photographer._id.toString()) {
            return NextResponse.json({ error: 'Bu müşteriye işlem yapma yetkiniz yok' }, { status: 403 });
        }

        if (!customer.phone) {
            return NextResponse.json({ error: 'Müşterinin telefon numarası bulunmamaktadır' }, { status: 400 });
        }

        const username = customer.plainUsername || customer.email || '';
        const password = customer.plainPassword || 'Şifre kaydedilmemiş';

        if (!username || password === 'Şifre kaydedilmemiş') {
            return NextResponse.json({ error: 'Müşterinin giriş bilgileri eksik (Hesap ayarlarından şifre belirleyin)' }, { status: 400 });
        }

        // Create SMS message
        const message = `Sayın ${customer.brideName || 'Müşterimiz'}, panel giriş bilgileriniz:\n\nKullanıcı: ${username}\nŞifre: ${password}\n\nGiriş: https://fotoplan.net/musteri`;

        // Send SMS
        const result = await sendSMS(customer.phone, message);

        if (!result.success) {
            console.error('Customer SMS credentials failed:', result.error);
            return NextResponse.json({ error: 'SMS gönderim servisinde bir hata oluştu.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'SMS başarıyla gönderildi.' });

    } catch (error: any) {
        console.error('Send Credentials SMS API Error:', error.message);
        return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
    }
}
