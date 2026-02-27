import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SystemSetting from '@/models/SystemSetting';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        let settings = await SystemSetting.findOne().lean();

        if (!settings) {
            // Create default settings if not exist
            settings = await SystemSetting.create({
                contactInfo: [
                    { icon: 'MapPin', color: 'bg-[#5d2b72]', label: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:123 Kat:8, 34394 Şişli / İstanbul', order: 0 },
                    { icon: 'Phone', color: 'bg-emerald-500', label: 'Telefon', value: '+90 (212) 555 00 00', order: 1 },
                    { icon: 'Mail', color: 'bg-blue-500', label: 'E-posta', value: 'destek@weey.net', order: 2 },
                    { icon: 'Clock', color: 'bg-amber-500', label: 'Çalışma Saatleri', value: 'Pzt – Cuma: 09:00 – 18:00', order: 3 },
                ]
            });
        }

        return NextResponse.json(settings);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const updatedSettings = await SystemSetting.findOneAndUpdate(
            {},
            data,
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings: updatedSettings });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
