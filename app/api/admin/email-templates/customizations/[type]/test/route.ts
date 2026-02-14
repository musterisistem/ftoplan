import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailTemplateType } from '@/models/EmailTemplate';
import { buildEmailFromCustomization, TemplateCustomization } from '@/lib/emailTemplateCustomization';
import { sendEmail } from '@/lib/resend';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type } = await params;
        const { customization } = await req.json();

        if (!Object.values(EmailTemplateType).includes(type as any)) {
            return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
        }

        // Sample data for testing
        const sampleData: Record<string, any> = {
            photographerName: session.user.name || 'Test Fotoğrafçı',
            studioName: 'Test Stüdyo',
            customerName: 'Ayşe & Mehmet',
            verifyUrl: `${process.env.NEXTAUTH_URL}/verify-email`,
            loginUrl: `${process.env.NEXTAUTH_URL}/login`,
            statusTitle: 'Albüm Durumu',
            statusValue: 'Tasarım Aşamasında',
            newPlanName: 'Pro Paket',
            expiryDate: '31.12.2026',
            storageLimit: '50 GB'
        };

        // Build email from customization
        const { subject, htmlContent } = buildEmailFromCustomization(
            type as keyof typeof EmailTemplateType,
            customization as TemplateCustomization,
            sampleData
        );

        // Send test email
        await sendEmail({
            to: session.user.email,
            subject: `[TEST] ${subject}`,
            html: htmlContent
        });

        return NextResponse.json({ message: 'Test email sent successfully' });

    } catch (error: any) {
        console.error('Send test email error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
