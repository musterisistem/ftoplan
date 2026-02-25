import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contract from '@/models/Contract';

export async function GET() {
    await dbConnect();
    try {
        const contracts = await Contract.find({
            isActive: { $ne: false }
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
        const { _id, ...updateData } = body;

        if (_id) {
            const updatedContract = await Contract.findByIdAndUpdate(
                _id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            if (!updatedContract) {
                return NextResponse.json({ error: 'Sözleşme bulunamadı' }, { status: 404 });
            }
            return NextResponse.json(updatedContract);
        } else {
            const contract = await Contract.create(body);
            return NextResponse.json(contract, { status: 201 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
