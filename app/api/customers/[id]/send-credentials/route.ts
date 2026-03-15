import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { sendSMS } from '@/lib/netgsm';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        // Get customer
        const customer = await Customer.findById(id);
        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 });
        }

        // Get photographer (for studio name)
        const photographer = await User.findById(customer.photographerId);
        if (!photographer) {
            return NextResponse.json({ error: 'Fotoğrafçı bulunamadı' }, { status: 404 });
        }

        // Get customer credentials
        if (!customer.plainUsername || !customer.plainPassword) {
            return NextResponse.json({ error: 'Müşteri giriş bilgileri bulunamadı' }, { status: 400 });
        }

        if (!customer.phone) {
            return NextResponse.json({ error: 'Müşteri telefon numarası bulunamadı' }, { status: 400 });
        }

        // Prepare SMS message
        const coupleName = `${customer.brideName}${customer.groomName ? ' & ' + customer.groomName : ''}`;
        const studioName = photographer.studioName || photographer.name || 'Stüdyomuz';
        
        const message = `Merhaba Sayin ${coupleName} ciftimiz. Cekiminize ait fotograflar sisteme yuklenmistir. Sistem giris bilgileriniz: Kullanici adi: ${customer.plainUsername} Sifre: ${customer.plainPassword} Iyi Gunler dileriz. ${studioName}`;

        // Send SMS
        const cleanPhone = customer.phone.replace(/\D/g, '');
        
        try {
            await sendSMS(cleanPhone, message);
            console.log('[Send Credentials] SMS sent to:', cleanPhone);
        } catch (smsError) {
            console.error('[Send Credentials] SMS error:', smsError);
            return NextResponse.json({ error: 'SMS gönderilemedi' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Giriş bilgileri SMS ile gönderildi'
        });

    } catch (error: any) {
        console.error('[Send Credentials Error]', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}
