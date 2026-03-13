import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import AlbumProvider from '@/models/AlbumProvider';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get photographer's album providers
        const providers = await AlbumProvider.find({
            photographerId: session.user.id
        }).sort({ createdAt: -1 });

        return NextResponse.json(providers);

    } catch (error: any) {
        console.error('Error fetching album providers:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Tedarikçi adı zorunludur' }, { status: 400 });
        }

        await dbConnect();

        const newProvider = await AlbumProvider.create({
            photographerId: session.user.id,
            name: name.trim(),
            covers: [],
            isActive: true
        });

        return NextResponse.json(newProvider, { status: 201 });

    } catch (error: any) {
        console.error('Error creating album provider:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
