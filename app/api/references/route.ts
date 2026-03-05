import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reference from '@/models/Reference';

// GET all references (public - only active)
export async function GET() {
    try {
        await dbConnect();
        const references = await Reference.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        return NextResponse.json(references);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
