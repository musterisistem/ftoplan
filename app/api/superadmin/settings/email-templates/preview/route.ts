import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buildEmailFromCustomization, TemplateCustomization } from '@/lib/emailTemplateCustomization';
import { replaceVariables } from '@/lib/emailTemplates';
import { EmailTemplateType } from '@/models/EmailTemplate';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, customization } = await req.json();

        // Sample data for preview
        const sampleData: Record<string, any> = {
            photographerName: session.user.name || 'Süper Admin',
            studioName: 'Örnek Fotoğraf Stüdyosu',
            customerName: 'Ayşe & Mehmet',
            verifyUrl: 'https://weey.net/verify/sample',
            loginUrl: 'https://weey.net/login',
            statusTitle: 'Albüm Durumu',
            statusValue: 'Tasarım Onaylandı',
            newPlanName: 'Kurumsal Paket',
            expiryDate: '31.12.2026',
            storageLimit: '100 GB'
        };

        // Build email from customization
        const { htmlContent } = buildEmailFromCustomization(
            type as any,
            customization as TemplateCustomization,
            sampleData
        );

        // Replace variables
        const finalHtml = replaceVariables(htmlContent, sampleData);

        return NextResponse.json({ html: finalHtml });

    } catch (error: any) {
        console.error('[SuperAdmin EmailTemplates] Preview error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
