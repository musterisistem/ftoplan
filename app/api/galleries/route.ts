import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (session.user.role === 'couple') {
        if (session.user.customerId !== customerId && customerId) {
            // Couples can only see their own
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        // If no customerId provided, default to own
        if (!customerId && session.user.customerId) {
            const galleries = await Gallery.find({ customerId: session.user.customerId });
            return NextResponse.json(galleries);
        }
    }

    try {
        const query = customerId ? { customerId } : {};
        const galleries = await Gallery.find(query).sort({ uploadDate: -1 });
        return NextResponse.json(galleries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { customerId, title, photos, coverImage } = body;

        const newGallery = await Gallery.create({
            customerId,
            title,
            photos, // Array of URLs
            coverImage,
            uploadDate: new Date()
        });

        return NextResponse.json(newGallery, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
    }
}
