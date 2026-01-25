import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contract from '@/models/Contract';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const { isActive } = await req.json();

        const contract = await Contract.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!contract) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
        }

        return NextResponse.json(contract);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
