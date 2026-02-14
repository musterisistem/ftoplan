import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailTemplateType } from '@/models/EmailTemplate';
import { DEFAULT_TEMPLATES, replaceVariables } from '@/lib/emailTemplates';
import { sendEmail } from '@/lib/resend';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    try {
        // Validate template type
        if (!Object.values(EmailTemplateType).includes(type as any)) {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        const body = await req.json();
        const { subject, htmlContent } = body;

        if (!subject || !htmlContent || !session.user.email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get default template for sample data
        const defaultTemplate = DEFAULT_TEMPLATES[type as keyof typeof DEFAULT_TEMPLATES];

        // Create sample data based on template type
        const sampleData: Record<string, string> = {
            photographerName: session.user.name || 'Test Fotoğrafçı',
            studioName: session.user.studioName || 'Test Stüdyo',
            customerName: 'Ayşe & Mehmet',
            verifyUrl: 'https://Weey.NET.com/verify/sample',
            loginUrl: 'https://Weey.NET.com/login',
            statusTitle: 'Albüm Durumu',
            statusValue: 'Tasarım Aşamasında',
            newPlanName: 'Pro Paket',
            expiryDate: '31.12.2026',
            storageLimit: '50 GB',
        };

        // Replace variables with sample data
        const compiledSubject = replaceVariables(subject, sampleData);
        const compiledHtml = replaceVariables(htmlContent, sampleData);

        // Send test email
        await sendEmail({
            to: session.user.email,
            subject: `[TEST] ${compiledSubject}`,
            html: compiledHtml,
        });

        return NextResponse.json({ message: 'Test email sent successfully' });
    } catch (error: any) {
        console.error('Error sending test email:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
