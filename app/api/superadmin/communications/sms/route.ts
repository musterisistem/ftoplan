import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import CommunicationLog from '@/models/CommunicationLog';
import { sendSMS } from '@/lib/netgsm';

// Türkçe karakterleri İngilizce'ye çevir
function turkishToEnglish(text: string): string {
    const turkishChars: Record<string, string> = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    };
    
    return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => turkishChars[match] || match);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { message, filter, selectedIds } = await req.json();

        if (!message || message.length > 160) {
            return NextResponse.json({ error: 'Mesaj 160 karakterden uzun olamaz' }, { status: 400 });
        }

        await dbConnect();

        // Build query based on filter for Users (photographers with role='admin')
        let query: any = { role: 'admin' };

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

        const photographers = await User.find(query).select('_id name phone');

        // Filter out photographers without phone numbers
        const validPhotographers = photographers.filter(p => p.phone && p.phone.trim() !== '');

        if (validPhotographers.length === 0) {
            return NextResponse.json({ error: 'Geçerli telefon numarasına sahip fotoğrafçı bulunamadı' }, { status: 404 });
        }

        console.log(`[Bulk SMS] Sending to ${validPhotographers.length} photographers`);

        // Get superadmin user ID as ObjectId
        const superadminUser = await User.findOne({ role: 'superadmin' }).select('_id');
        let sentByUserId;
        if (superadminUser) {
            sentByUserId = superadminUser._id;
        } else {
            const currentUser = await User.findOne({ email: session.user.email }).select('_id');
            if (!currentUser) {
                const mongoose = await import('mongoose');
                sentByUserId = new mongoose.Types.ObjectId();
            } else {
                sentByUserId = currentUser._id;
            }
        }

        // Convert Turkish characters to English
        const englishMessage = turkishToEnglish(message);
        console.log('[Bulk SMS] Original message:', message);
        console.log('[Bulk SMS] Converted message:', englishMessage);

        // Create communication log
        const log = await CommunicationLog.create({
            type: 'sms',
            message: englishMessage, // Store converted message
            recipientCount: validPhotographers.length,
            recipients: validPhotographers.map(p => ({
                photographerId: p._id,
                phone: p.phone,
                status: 'pending'
            })),
            filter: selectedIds && selectedIds.length > 0 ? 'custom' : filter,
            sentBy: sentByUserId,
            status: 'sending'
        });

        // Send SMS using NetGSM
        let successCount = 0;
        let failCount = 0;

        for (const photographer of validPhotographers) {
            try {
                console.log(`[Bulk SMS] Sending to ${photographer.phone}...`);
                await sendSMS(photographer.phone, englishMessage);
                
                // Update recipient status
                await CommunicationLog.updateOne(
                    { _id: log._id, 'recipients.photographerId': photographer._id },
                    { $set: { 'recipients.$.status': 'sent' } }
                );
                successCount++;
                console.log(`[Bulk SMS] ✓ Sent to ${photographer.phone}`);
            } catch (error) {
                console.error(`[Bulk SMS] ✗ Failed to send SMS to ${photographer.phone}:`, error);
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

        console.log(`[Bulk SMS] Complete: ${successCount} sent, ${failCount} failed`);

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: validPhotographers.length
        });

    } catch (error: any) {
        console.error('[Bulk SMS] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
