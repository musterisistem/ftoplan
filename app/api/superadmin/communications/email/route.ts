import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CommunicationLog from '@/models/CommunicationLog';
import { sendEmail } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { subject, message, htmlContent, filter, selectedIds } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Konu ve mesaj gerekli' }, { status: 400 });
        }

        await dbConnect();

        // Build query based on filter for Users (photographers with role='admin')
        let query: any = { role: 'admin' }; // Only photographers

        if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
            query._id = { $in: selectedIds };
        } else {
            if (filter === 'active') {
                query.isActive = true;
            } else if (filter === 'inactive') {
                query.isActive = false;
            } else if (filter !== 'all') {
                query.packageType = filter;
            }
        }

        const photographers = await User.find(query).select('_id name email studioName');

        if (photographers.length === 0) {
            return NextResponse.json({ error: 'Alıcı bulunamadı' }, { status: 404 });
        }

        console.log(`[Bulk Email] Sending to ${photographers.length} photographers:`, photographers.map(p => p.email));

        // Get superadmin user ID as ObjectId - find by role instead of email
        const superadminUser = await User.findOne({ role: 'superadmin' }).select('_id');
        
        // If no superadmin found, try to find by session email
        let sentByUserId;
        if (superadminUser) {
            sentByUserId = superadminUser._id;
        } else {
            // Fallback: find by session email
            const currentUser = await User.findOne({ email: session.user.email }).select('_id');
            if (!currentUser) {
                console.error('[Bulk Email] No superadmin or current user found, using dummy ObjectId');
                // Create a dummy ObjectId to avoid validation error
                const mongoose = await import('mongoose');
                sentByUserId = new mongoose.Types.ObjectId();
            } else {
                sentByUserId = currentUser._id;
            }
        }

        console.log('[Bulk Email] Using sentBy ID:', sentByUserId);

        // Create communication log
        const log = await CommunicationLog.create({
            type: 'email',
            subject,
            message,
            recipientCount: photographers.length,
            recipients: photographers.map(p => ({
                photographerId: p._id,
                email: p.email,
                status: 'pending'
            })),
            filter: selectedIds && selectedIds.length > 0 ? 'custom' : filter,
            sentBy: sentByUserId, // Use ObjectId instead of string
            status: 'sending'
        });

        // Send emails in background
        let successCount = 0;
        let failCount = 0;

        for (const photographer of photographers) {
            try {
                // Formatting plain text to a beautiful graphical HTML template
                let finalHtml = htmlContent;
                if (!finalHtml) {
                    const formattedMessage = message.replace(/\n/g, '<br />');
                    finalHtml = `
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
                                            <td style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 40px 30px; text-align: center;">
                                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Weey.NET</h1>
                                                <p style="color: #f3e8ff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Fotoğrafçı Yönetim Paneli</p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Content -->
                                        <tr>
                                            <td style="padding: 40px 30px;">
                                                <h2 style="color: #111827; font-size: 22px; font-weight: 600; margin: 0 0 20px 0;">${subject}</h2>
                                                
                                                <div style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                                    ${formattedMessage}
                                                </div>
                                                
                                                <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                                                    <tr>
                                                        <td align="center" style="border-radius: 8px; background: linear-gradient(to right, #7c3aed, #4f46e5);">
                                                            <a href="https://weey.net/admin/dashboard" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 14px 32px; border: 1px solid #7c3aed; display: inline-block; font-weight: 600;">Panele Giriş Yap</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Footer -->
                                        <tr>
                                            <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                                                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                                    Bu e-posta <strong>Weey.NET</strong> tarafından otomatik olarak gönderilmiştir.
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
                }

                const result = await sendEmail({
                    to: photographer.email,
                    subject,
                    html: finalHtml
                });

                if (!result.success) {
                    const errorMsg = result.error && typeof result.error === 'object' && 'message' in result.error 
                        ? (result.error as any).message 
                        : 'E-posta gönderimi başarısız oldu';
                    throw new Error(errorMsg);
                }

                // Update recipient status
                await CommunicationLog.updateOne(
                    { _id: log._id, 'recipients.photographerId': photographer._id },
                    { $set: { 'recipients.$.status': 'sent' } }
                );
                successCount++;
                console.log(`[Bulk Email] ✓ Sent to ${photographer.email}`);
            } catch (error) {
                console.error(`[Bulk Email] ✗ Failed to send email to ${photographer.email}:`, error);
                await CommunicationLog.updateOne(
                    { _id: log._id, 'recipients.photographerId': photographer._id },
                    { $set: { 'recipients.$.status': 'failed' } }
                );
                failCount++;
            }
        }

        // Update overall log status
        const finalStatus = failCount === 0 ? 'sent' : (successCount === 0 ? 'failed' : 'partial');
        await CommunicationLog.updateOne(
            { _id: log._id },
            { $set: { status: finalStatus } }
        );

        console.log(`[Bulk Email] Complete: ${successCount} sent, ${failCount} failed`);

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: photographers.length
        });

    } catch (error: any) {
        console.error('[Bulk Email] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
