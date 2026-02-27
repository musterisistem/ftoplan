import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SystemSetting from '@/models/SystemSetting';

export async function GET() {
    try {
        await dbConnect();

        const settings = await SystemSetting.findOne().lean();

        if (!settings) {
            return NextResponse.json({
                contactInfo: [
                    { icon: 'MapPin', color: 'bg-[#5d2b72]', label: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:123 Kat:8, 34394 Şişli / İstanbul', order: 0 },
                    { icon: 'Phone', color: 'bg-emerald-500', label: 'Telefon', value: '+90 (212) 555 00 00', order: 1 },
                    { icon: 'Mail', color: 'bg-blue-500', label: 'E-posta', value: 'destek@weey.net', order: 2 },
                    { icon: 'Clock', color: 'bg-amber-500', label: 'Çalışma Saatleri', value: 'Pzt – Cuma: 09:00 – 18:00', order: 3 },
                ]
            });
        }

        // Return only public fields
        const publicSettings = {
            siteName: settings.siteName,
            siteUrl: settings.siteUrl,
            supportEmail: settings.supportEmail,
            contactInfo: settings.contactInfo,
        };

        return NextResponse.json(publicSettings);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
