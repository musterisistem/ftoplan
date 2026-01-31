import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CommunicationLog from '@/models/CommunicationLog';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { message, filter } = await req.json();

        if (!message || message.length > 160) {
            return NextResponse.json({ error: 'Mesaj 160 karakterden uzun olamaz' }, { status: 400 });
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

        const photographers = await User.find(query).select('_id name phone');

        // Filter out photographers without phone numbers
        const validPhotographers = photographers.filter(p => p.phone && p.phone.trim() !== '');

        if (validPhotographers.length === 0) {
            return NextResponse.json({ error: 'Geçerli telefon numarasına sahip fotoğrafçı bulunamadı' }, { status: 404 });
        }

        // Create communication log
        const log = await CommunicationLog.create({
            type: 'sms',
            message,
            recipientCount: validPhotographers.length,
            recipients: validPhotographers.map(p => ({
                photographerId: p._id,
                phone: p.phone,
                status: 'pending'
            })),
            filter,
            sentBy: session.user.id,
            status: 'sending'
        });

        // SMS sending simulation (integrate with Twilio/Vonage in production)
        console.log('[SMS] Would send to:', validPhotographers.length, 'photographers');
        console.log('[SMS] Message:', message);

        // For now, mark all as sent (in production, integrate real SMS API)
        let successCount = validPhotographers.length;
        let failCount = 0;

        for (const photographer of validPhotographers) {
            await CommunicationLog.updateOne(
                { _id: log._id, 'recipients.photographerId': photographer._id },
                { $set: { 'recipients.$.status': 'sent' } }
            );
        }

        // Update overall log status
        await CommunicationLog.updateOne(
            { _id: log._id },
            { $set: { status: 'sent' } }
        );

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: validPhotographers.length,
            note: 'SMS sistemi demo modda. Gerçek SMS gönderimi için Twilio/Vonage entegrasyonu gerekli.'
        });

    } catch (error: any) {
        console.error('Bulk SMS error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
