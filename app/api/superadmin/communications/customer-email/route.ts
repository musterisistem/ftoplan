import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { subject, message, emails } = await req.json();

        if (!subject || !message || !emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'Konu, mesaj ve geçerli e-posta adresleri gerekli' }, { status: 400 });
        }

        const formattedMessage = message.replace(/\n/g, '<br />');

        // This is a generic beautiful template for End-Customers
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #111827 0%, #374151 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Weey.NET</h1>
                                    <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Müşteri Bilgilendirme Sistemi</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #111827; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">${subject}</h2>
                                    
                                    <div style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                        ${formattedMessage}
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                        Bu e-posta <strong>Weey.NET</strong> altyapısı kullanılarak gönderilmiştir.
                                    </p>
                                    <div style="margin-top: 15px;">
                                        <a href="https://weey.net" style="color: #7c3aed; text-decoration: none; font-size: 14px; font-weight: 500;">weey.net</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
                            © ${new Date().getFullYear()} Weey.NET. Tüm hakları saklıdır.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        let successCount = 0;
        let failCount = 0;

        for (const email of emails) {
            try {
                const result = await sendEmail({
                    to: email,
                    subject,
                    html: htmlContent
                });

                if (!result.success) {
                    throw new Error((result.error as any)?.message || 'E-posta gönderimi başarısız oldu');
                }

                successCount++;
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
                failCount++;
            }
        }

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: emails.length
        });

    } catch (error: any) {
        console.error('Customer bulk email error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
