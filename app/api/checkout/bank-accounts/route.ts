import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SystemSetting from '@/models/SystemSetting';

// Public endpoint — returns bank accounts for the checkout page bank transfer section
export async function GET() {
    try {
        await dbConnect();
        const settings = await SystemSetting.findOne({}).lean() as any;
        return NextResponse.json({ bankAccounts: settings?.bankAccounts || [] });
    } catch (error) {
        return NextResponse.json({ bankAccounts: [] });
    }
}
