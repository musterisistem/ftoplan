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

        const { subject, message, htmlContent, filter } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ error: 'Konu ve mesaj gerekli' }, { status: 400 });
        }

        await dbConnect();

        // Build query based on filter
        let query: any = { role: 'admin' };

        if (filter === 'active') {
            query.isActive = true;
        } else if (filter === 'inactive') {
            query.isActive = false;
        } else if (filter !== 'all') {
            query.packageType = filter;
        }

        const photographers = await User.find(query).select('_id name email');

        if (photographers.length === 0) {
            return NextResponse.json({ error: 'Alıcı bulunamadı' }, { status: 404 });
        }

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
            filter,
            sentBy: session.user.id,
            status: 'sending'
        });

        // Send emails in background
        let successCount = 0;
        let failCount = 0;

        for (const photographer of photographers) {
            try {
                await sendEmail({
                    to: photographer.email,
                    subject,
                    html: htmlContent || message
                });

                // Update recipient status
                await CommunicationLog.updateOne(
                    { _id: log._id, 'recipients.photographerId': photographer._id },
                    { $set: { 'recipients.$.status': 'sent' } }
                );
                successCount++;
            } catch (error) {
                console.error(`Failed to send email to ${photographer.email}:`, error);
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

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: photographers.length
        });

    } catch (error: any) {
        console.error('Bulk email error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
