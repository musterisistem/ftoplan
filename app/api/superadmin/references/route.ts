import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reference from '@/models/Reference';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all references (superadmin — all statuses)
export async function GET() {
    try {
        await dbConnect();
        const references = await Reference.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json(references);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create new reference
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { companyName, logoUrl, website, isActive, order } = body;

        if (!companyName || !logoUrl) {
            return NextResponse.json({ error: 'Firma adı ve logo zorunludur' }, { status: 400 });
        }

        const count = await Reference.countDocuments();
        const reference = await Reference.create({
            companyName,
            logoUrl,
            website: website || '',
            isActive: isActive ?? true,
            order: order ?? count,
        });

        return NextResponse.json(reference, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
