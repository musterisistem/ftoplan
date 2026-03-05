import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reference from '@/models/Reference';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'superadmin';
}

// PUT update a reference
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    if (!await isAdmin()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();
        const reference = await Reference.findByIdAndUpdate(params.id, body, { new: true });
        if (!reference) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
        return NextResponse.json(reference);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a reference
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    if (!await isAdmin()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

    try {
        await dbConnect();
        await Reference.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
