import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { path, title, role, visitorId, targetUserSlug } = body;

        await dbConnect();

        let photographerId = null;

        // Try to determine photographer from slug if provided
        if (targetUserSlug) {
            const photographer = await User.findOne({ slug: targetUserSlug }).select('_id');
            if (photographer) {
                photographerId = photographer._id;
            }
        }

        // Create analytics entry
        await Analytics.create({
            path,
            title,
            role,
            visitorId,
            targetUserId: photographerId, // Link to photographer if applicable
            photographerId: photographerId,
            userAgent: req.headers.get('user-agent'),
            // We usually don't store raw IP for privacy, or hash it. Skipping IP for now.
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ success: false }, { status: 500 }); // Fail silently to client
    }
}
