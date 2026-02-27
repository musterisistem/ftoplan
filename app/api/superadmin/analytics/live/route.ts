import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Analytics from '@/models/Analytics';

export async function GET() {
    try {
        await dbConnect();

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // 1. Live Feed: Recent photographer activity only (role: 'admin' or has photographerId)
        // PhotographerId is set when visiting studio/[slug]
        // Role: 'admin' is set when the photographer is in their own dashboard
        const recentActivity = await Analytics.find({
            $or: [
                { role: 'admin' },
                { photographerId: { $ne: null } }
            ]
        })
            .sort({ timestamp: -1 })
            .limit(15)
            .populate('photographerId', 'studioName name')
            .lean();

        // 2. Online Now: Unique photographers in last 5 minutes
        const onlineCountResult = await Analytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: oneHourAgo },
                    $or: [
                        { role: 'admin' },
                        { photographerId: { $ne: null } }
                    ]
                }
            },
            { $group: { _id: "$visitorId" } },
            { $count: "count" }
        ]);
        const onlineCount = onlineCountResult.length > 0 ? onlineCountResult[0].count : 0;

        // 3. Most Visited Pages (Top 10)
        const topPages = await Analytics.aggregate([
            {
                $group: {
                    _id: "$path",
                    count: { $sum: 1 },
                    title: { $first: "$title" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        return NextResponse.json({
            recent: recentActivity,
            onlineCount,
            topPages: topPages.map(p => ({
                path: p._id,
                count: p.count,
                title: p.title || p._id
            }))
        });

    } catch (error: any) {
        console.error('Live analytics error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
