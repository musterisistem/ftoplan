import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contract from '@/models/Contract';

export async function GET() {
    await dbConnect();
    try {
        // Only show these specific contracts
        const allowedContracts = [
            'Dış Çekim Sözleşmesi',
            'Video Çekim Sözleşmesi'
        ];

        const contracts = await Contract.find({
            isActive: true,
            name: { $in: allowedContracts }
        }).sort({ createdAt: -1 });

        return NextResponse.json(contracts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const contract = await Contract.create(body);
        return NextResponse.json(contract, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
