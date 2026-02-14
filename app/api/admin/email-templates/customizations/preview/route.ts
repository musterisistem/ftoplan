import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buildEmailFromCustomization, TemplateCustomization } from '@/lib/emailTemplateCustomization';
import { replaceVariables } from '@/lib/emailTemplates';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, customization } = await req.json();

        // Sample data for preview
        const sampleData: Record<string, any> = {
            photographerName: session.user.name || 'Örnek Fotoğrafçı',
            studioName: 'Örnek Stüdyo',
            customerName: 'Ayşe & Mehmet',
            verifyUrl: '#',
            loginUrl: '#',
            statusTitle: 'Albüm Durumu',
            statusValue: 'Tasarım Aşamasında',
            newPlanName: 'Pro Paket',
            expiryDate: '31.12.2026',
            storageLimit: '50 GB'
        };

        // Build email from customization
        const { htmlContent } = buildEmailFromCustomization(
            type,
            customization as TemplateCustomization,
            sampleData
        );

        // Replace variables
        const finalHtml = replaceVariables(htmlContent, sampleData);

        return NextResponse.json({ html: finalHtml });

    } catch (error: any) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
