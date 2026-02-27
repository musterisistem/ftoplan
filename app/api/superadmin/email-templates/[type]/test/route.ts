import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmailWithTemplate } from '@/lib/resend';
import { EmailTemplateType } from '@/models/EmailTemplate';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;
        const { customization } = await req.json();

        // Sample logic: Send to the superadmin's email
        const targetEmail = session.user.email!;

        // Sample data for variables
        const sampleData: Record<string, any> = {
            photographerName: 'Süper Admin',
            studioName: 'Weey.NET Stüdyo',
            customerName: 'Ayşe ve Mehmet',
            verifyUrl: '#',
            loginUrl: 'https://weey.net/login',
            statusTitle: 'Albüm Hazır',
            statusValue: 'Yayında',
            newPlanName: 'Kurumsal Paket',
            expiryDate: '31.12.2026',
            storageLimit: '100 GB'
        };

        const result = await sendEmailWithTemplate({
            to: targetEmail,
            templateType: type as EmailTemplateType,
            variables: sampleData,
            customization // Use the provided customization for the test
        });

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Test maili başarıyla gönderildi' });
        } else {
            return NextResponse.json({ error: 'Mail gönderilemedi: ' + result.error }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[System EmailTemplates] Test error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
