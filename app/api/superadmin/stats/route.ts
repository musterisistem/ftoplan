import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Analytics from '@/models/Analytics';

export async function GET() {
    try {
        await dbConnect();

        // 1. User Stats
        const totalPhotographers = await User.countDocuments({ role: 'admin' });
        const activePhotographers = await User.countDocuments({ role: 'admin', isActive: true });

        // 2. Storage Stats (Option A: Aggregate from all users)
        // Sum up 'storageUsage' of all users
        const storageResult = await User.aggregate([
            { $match: { role: 'admin' } },
            { $group: { _id: null, totalUsage: { $sum: "$storageUsage" } } }
        ]);
        const totalStorageUsage = storageResult.length > 0 ? storageResult[0].totalUsage : 0;

        // 3. Analytics Stats
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const viewsToday = await Analytics.countDocuments({ timestamp: { $gte: startOfToday } });
        const viewsMonth = await Analytics.countDocuments({ timestamp: { $gte: startOfMonth } });
        const viewsTotal = await Analytics.countDocuments({});

        // Optional: Get recent views for "Live Feed"
        const recentViews = await Analytics.find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('targetUserId', 'studioName name') // Populate photographer info
            .lean();

        return NextResponse.json({
            users: {
                total: totalPhotographers,
                active: activePhotographers
            },
            storage: {
                totalBytes: totalStorageUsage,
                // Hardcoded bunny limit reference or just total usage
                limitBytes: 1000 * 1024 * 1024 * 1024 // e.g. 1TB hypothetical bunny limit to show %
            },
            analytics: {
                today: viewsToday,
                month: viewsMonth,
                total: viewsTotal,
                recent: recentViews
            }
        });

    } catch (error: any) {
        console.error('Superadmin stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
