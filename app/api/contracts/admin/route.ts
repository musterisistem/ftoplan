import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contract from '@/models/Contract';

// Get all contracts (including inactive ones) for admin management
export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    try {
        const query = includeInactive ? {} : { isActive: true };
        const contracts = await Contract.find(query).sort({ createdAt: -1 });
        return NextResponse.json(contracts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Batch update contracts
export async function PATCH(req: Request) {
    await dbConnect();

    try {
        const { updates } = await req.json();
        // updates: [{ id: '...', isActive: true/false }, ...]

        const results = [];
        for (const update of updates) {
            const contract = await Contract.findByIdAndUpdate(
                update.id,
                { isActive: update.isActive },
                { new: true }
            );
            results.push(contract);
        }

        return NextResponse.json({ success: true, updated: results.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
