import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buildEmailFromCustomization } from '@/lib/emailTemplateCustomization';
import { replaceVariables } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, customization } = await req.json();

        // Sample data for preview
        const sampleData: Record<string, any> = {
            photographerName: 'Süper Admin',
            studioName: 'Weey.NET Stüdyo',
            customerName: 'Ayşe ve Mehmet',
            verifyUrl: '#',
            loginUrl: '#',
            statusTitle: 'Albüm Hazır',
            statusValue: 'Yayında',
            newPlanName: 'Kurumsal Paket',
            expiryDate: '31.12.2026',
            storageLimit: '100 GB'
        };

        const { htmlContent } = buildEmailFromCustomization(
            type as any,
            customization,
            sampleData
        );

        const html = replaceVariables(htmlContent, sampleData);

        return NextResponse.json({ html });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
