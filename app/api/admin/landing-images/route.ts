import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - Get landing images for the logged-in photographer
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
        }
        await dbConnect();
        const user = await User.findOne({ email: session.user.email, role: 'admin' }).select('landingImages');
        return NextResponse.json({ landingImages: user?.landingImages || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Add a new landing image
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
        }
        const { url, caption } = await req.json();
        if (!url) return NextResponse.json({ error: 'URL zorunlu' }, { status: 400 });

        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email, role: 'admin' },
            { $push: { landingImages: { url, caption: caption || '', order: 0 } } },
            { new: true }
        ).select('landingImages');
        return NextResponse.json({ landingImages: user?.landingImages || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Reorder / update all landing images at once
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
        }
        const { landingImages } = await req.json();
        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email, role: 'admin' },
            { $set: { landingImages } },
            { new: true }
        ).select('landingImages');
        return NextResponse.json({ landingImages: user?.landingImages || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove a landing image by URL
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
        }
        const { url } = await req.json();
        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email, role: 'admin' },
            { $pull: { landingImages: { url } } },
            { new: true }
        ).select('landingImages');
        return NextResponse.json({ landingImages: user?.landingImages || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
