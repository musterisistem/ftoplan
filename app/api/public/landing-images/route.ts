import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - Fetch a specific photographer's landing images (public, by userId or all admins)
// For the main landing page, we return a combined set of landing images from all active admins
// (or you can filter by a specific studio slug).
export async function GET() {
    try {
        await dbConnect();
        // Gather up to 12 recent landing images from active admins for showcase
        const users = await User.find({ role: 'admin', isActive: true, 'landingImages.0': { $exists: true } })
            .select('landingImages studioName slug')
            .limit(10);

        const allImages: Array<{ url: string; caption: string; studio: string }> = [];
        for (const u of users) {
            for (const img of (u.landingImages || [])) {
                allImages.push({ url: img.url, caption: img.caption || '', studio: u.studioName });
            }
        }

        // Shuffle and limit to 12
        const shuffled = allImages.sort(() => Math.random() - 0.5).slice(0, 12);
        return NextResponse.json({ images: shuffled });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
