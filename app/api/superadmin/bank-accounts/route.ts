import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SystemSetting from '@/models/SystemSetting';

// GET: Return bank accounts list
export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const settings = await SystemSetting.findOne({});
        return NextResponse.json({ bankAccounts: settings?.bankAccounts || [] });
    } catch (error: any) {
        return NextResponse.json({ error: 'Banka hesapları alınamadı.' }, { status: 500 });
    }
}

// POST: Save bank accounts list
export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { bankAccounts } = await req.json();

        let settings = await SystemSetting.findOne({});
        if (!settings) {
            settings = await SystemSetting.create({ bankAccounts });
        } else {
            settings.bankAccounts = bankAccounts;
            await settings.save();
        }

        return NextResponse.json({ success: true, bankAccounts: settings.bankAccounts });
    } catch (error: any) {
        console.error('[BankAccounts POST]', error);
        return NextResponse.json({ error: 'Banka hesapları kaydedilemedi.' }, { status: 500 });
    }
}
