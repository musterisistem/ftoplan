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

        // 1. Determine photographer from slug if provided (studio visits)
        if (targetUserSlug) {
            const photographer = await User.findOne({ slug: targetUserSlug }).select('_id');
            if (photographer) {
                photographerId = photographer._id;
            }
        }

        // 2. OR determine from logged-in session (admin panel visits)
        // Note: The 'role' and 'photographerId' might be passed from the hook if logged in
        // but we can also trust the role 'admin' sent by the client for filtering.

        // Create analytics entry
        await Analytics.create({
            path,
            title,
            role,
            visitorId,
            targetUserId: photographerId,
            photographerId: photographerId,
            userAgent: req.headers.get('user-agent'),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ success: false }, { status: 500 }); // Fail silently to client
    }
}
