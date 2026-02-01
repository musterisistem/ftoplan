import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DashboardSlide from '@/models/DashboardSlide';

// GET - Fetch all slides (SuperAdmin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const slides = await DashboardSlide.find()
            .sort({ order: 1, createdAt: -1 });

        return NextResponse.json(slides);
    } catch (error: any) {
        console.error('SuperAdmin Slides Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new slide
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { title, description, imageUrl, link, isActive, order } = body;

        const slide = await DashboardSlide.create({
            title,
            description,
            imageUrl,
            link,
            isActive: isActive ?? true,
            order: order ?? 0
        });

        return NextResponse.json(slide, { status: 201 });
    } catch (error: any) {
        console.error('Create Slide Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
