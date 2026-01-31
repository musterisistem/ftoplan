import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CommunicationLog from '@/models/CommunicationLog';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'email' or 'sms' or null for all

        await dbConnect();

        let query: any = {};
        if (type === 'email' || type === 'sms') {
            query.type = type;
        }

        const logs = await CommunicationLog.find(query)
            .populate('sentBy', 'name email')
            .sort({ sentAt: -1 })
            .limit(50);

        return NextResponse.json(logs);

    } catch (error: any) {
        console.error('Get communication history error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
