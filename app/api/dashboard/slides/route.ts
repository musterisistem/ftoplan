import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DashboardSlide from '@/models/DashboardSlide';

// GET - Fetch active slides for photographers
export async function GET() {
    try {
        await dbConnect();

        const slides = await DashboardSlide.find({ isActive: true })
            .sort({ order: 1 })
            .select('title description imageUrl link');

        return NextResponse.json(slides);
    } catch (error: any) {
        console.error('Dashboard Slides Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
