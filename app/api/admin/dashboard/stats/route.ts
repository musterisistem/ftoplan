import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Shoot from '@/models/Shoot';
import mongoose from 'mongoose';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const requestedMonth = searchParams.get('month');
        const requestedYear = searchParams.get('year');

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const now = new Date();
        const targetMonth = requestedMonth ? parseInt(requestedMonth) - 1 : now.getMonth();
        const targetYear = requestedYear ? parseInt(requestedYear) : now.getFullYear();

        const userId = session.user.id;
        const user = await User.findById(userId).select('storageUsage storageLimit name email panelLogo logo');

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // ── CRITICAL: All queries must be scoped to this photographer ──────────
        const photographerId = new mongoose.Types.ObjectId(userId);
        const pgFilter = { photographerId };

        // Photo stats (only this photographer's customers)
        const photoStats = await Customer.aggregate([
            { $match: pgFilter },
            {
                $group: {
                    _id: null,
                    totalPhotos: { $sum: { $size: { $ifNull: ['$photos', []] } } },
                    totalSelected: { $sum: { $size: { $ifNull: ['$selectedPhotos', []] } } }
                }
            }
        ]);
        const totalPhotos = (photoStats[0]?.totalPhotos || 0) + (photoStats[0]?.totalSelected || 0);

        // Album Counts
        const totalAlbums = await Customer.countDocuments({ ...pgFilter, status: { $ne: 'archived' } });
        const deletedAlbums = await Customer.countDocuments({ ...pgFilter, status: 'archived' });

        // Recent Activities
        const recentActivities = await Customer.find({
            ...pgFilter,
            selectionApprovedAt: { $ne: null }
        })
            .select('brideName groomName selectionApprovedAt')
            .sort({ selectionApprovedAt: -1 })
            .limit(10);

        // Upcoming Shoots
        const upcomingShoots = await Shoot.find({
            ...pgFilter,
            date: { $gte: new Date() },
            status: 'planned'
        })
            .sort({ date: 1 })
            .limit(5)
            .populate('customerId', 'brideName groomName email phone');

        // Shoot Distribution
        const shootDistribution = await Shoot.aggregate([
            { $match: pgFilter },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Monthly Revenue (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyRevenue = await Shoot.aggregate([
            { $match: { ...pgFilter, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                    revenue: { $sum: '$agreedPrice' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        const revenueChartData = monthlyRevenue.map(item => ({
            name: monthNames[item._id.month - 1],
            value: item.revenue,
            year: item._id.year
        }));

        // Monthly Shoots Count
        const monthlyShootsCount = await Shoot.aggregate([
            { $match: { ...pgFilter, date: { $gte: sixMonthsAgo }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthlyShootsChartData = monthlyShootsCount.map(item => ({
            name: monthNames[item._id.month - 1],
            value: item.count,
            year: item._id.year
        }));

        // Active Shoots This Month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const activeShootsThisMonth = await Shoot.countDocuments({
            ...pgFilter,
            date: { $gte: startOfMonth },
            status: { $ne: 'cancelled' }
        });

        // Active Customers
        const activeCustomers = await Customer.countDocuments({ ...pgFilter, status: 'active' });

        // Total Earnings
        const earningStats = await Shoot.aggregate([
            { $match: pgFilter },
            { $group: { _id: null, totalEarnings: { $sum: '$agreedPrice' } } }
        ]);
        const totalEarnings = earningStats[0]?.totalEarnings || 0;

        // Pending Counts
        const pendingSelectionCount = await Customer.countDocuments({
            ...pgFilter,
            appointmentStatus: 'fotograflar_yuklendi'
        });
        const pendingUploadsCount = await Customer.countDocuments({
            ...pgFilter,
            appointmentStatus: { $in: ['cekim_yapilmadi', 'cekim_yapildi'] }
        });

        const staffMembers = [{
            id: user._id,
            name: user.name || 'Yönetici',
            username: user.email?.split('@')[0],
            isOnline: true,
            role: 'Admin'
        }];

        // Calendar Data
        const startOfCalendarMonth = new Date(targetYear, targetMonth, 1);
        startOfCalendarMonth.setHours(0, 0, 0, 0);
        const endOfCalendarMonth = new Date(targetYear, targetMonth + 1, 0);
        endOfCalendarMonth.setHours(23, 59, 59, 999);

        const shootsThisMonth = await Shoot.find({
            ...pgFilter,
            date: { $gte: startOfCalendarMonth, $lte: endOfCalendarMonth },
            status: { $ne: 'cancelled' }
        }).select('date type customerName location').populate('customerId', 'brideName groomName').lean();

        const daysWithEvents = [...new Set(shootsThisMonth.map(shoot => new Date(shoot.date).getDate()))];

        // Today's Schedule
        const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);

        const todayShoots = await Shoot.find({
            ...pgFilter,
            date: { $gte: startOfToday, $lte: endOfToday },
            status: { $ne: 'cancelled' }
        }).sort({ date: 1 }).populate('customerId', 'brideName groomName').lean();

        const todaySchedule = todayShoots.map(shoot => ({
            time: new Date(shoot.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            customerName: `${(shoot.customerId as any)?.brideName || ''} & ${(shoot.customerId as any)?.groomName || ''}`.trim(),
            type: shoot.type || 'Çekim',
            location: shoot.location || 'Belirtilmemiş',
            duration: '2h'
        }));

        // Monthly Activity
        const weeksInMonth = [
            { name: 'Hft 1', start: 1, end: 7 },
            { name: 'Hft 2', start: 8, end: 14 },
            { name: 'Hft 3', start: 15, end: 21 },
            { name: 'Hft 4', start: 22, end: 31 }
        ];

        const monthlyActivity = await Promise.all(
            weeksInMonth.map(async (week) => {
                const weekStart = new Date(targetYear, targetMonth, week.start);
                const weekEnd = new Date(targetYear, targetMonth, week.end);
                weekEnd.setHours(23, 59, 59, 999);
                const count = await Shoot.countDocuments({
                    ...pgFilter,
                    date: { $gte: weekStart, $lte: weekEnd },
                    status: { $ne: 'cancelled' }
                });
                return { name: week.name, count };
            })
        );

        // Active Albums
        const activeAlbumsData = await Customer.find({
            ...pgFilter,
            status: { $ne: 'archived' },
            appointmentStatus: { $in: ['fotograflar_yuklendi', 'fotograflar_secildi', 'album_bekleniyor', 'teslim_edildi'] },
            photos: { $exists: true, $ne: [] }
        })
            .select('brideName groomName photos appointmentStatus')
            .sort({ 'photos.0.uploadedAt': -1 })
            .limit(10)
            .lean();

        const activeAlbums = activeAlbumsData.map((customer: any) => ({
            customerId: customer._id.toString(),
            brideName: customer.brideName || '',
            groomName: customer.groomName || '',
            photoCount: customer.photos?.length || 0,
            latestPhotoDate: customer.photos?.[customer.photos.length - 1]?.uploadedAt || new Date(),
            hasSelection: ['fotograflar_secildi', 'album_bekleniyor', 'teslim_edildi'].includes(customer.appointmentStatus),
            thumbnailUrl: customer.photos?.[0]?.url || ''
        }));

        // Upcoming Shoots Detailed
        const upcomingShootsDetailed = await Shoot.find({
            ...pgFilter,
            date: { $gte: new Date() },
            status: 'planned'
        }).sort({ date: 1 }).limit(5).populate('customerId', 'brideName groomName').lean();

        const upcomingShootsFormatted = upcomingShootsDetailed.map((shoot: any) => ({
            id: shoot._id.toString(),
            brideName: shoot.customerId?.brideName || '',
            groomName: shoot.customerId?.groomName || '',
            date: shoot.date,
            time: shoot.time || '',
            location: shoot.location || 'Belirtilmemiş',
            type: shoot.type || 'other'
        }));

        return NextResponse.json({
            storage: {
                used: user.storageUsage || 0,
                limit: user.storageLimit || 21474836480,
            },
            counts: {
                photos: totalPhotos,
                albums: totalAlbums,
                deletedAlbums,
                activeShootsMonth: activeShootsThisMonth,
                activeCustomers,
                totalRevenue: totalEarnings,
                pendingSelection: pendingSelectionCount,
                pendingUploads: pendingUploadsCount
            },
            revenueChart: revenueChartData,
            monthlyShootsChart: monthlyShootsChartData,
            recentActivities,
            upcomingShoots,
            shootDistribution,
            earnings: { total: totalEarnings, currency: '₺' },
            staffMembers,
            calendar: {
                currentMonth: `${monthNames[targetMonth]} ${targetYear}`,
                daysWithEvents,
                eventDetails: shootsThisMonth.map(shoot => ({
                    day: new Date(shoot.date).getDate(),
                    time: new Date(shoot.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    customerName: `${(shoot.customerId as any)?.brideName || ''} & ${(shoot.customerId as any)?.groomName || ''}`.trim(),
                    type: shoot.type || 'Çekim',
                    location: shoot.location || 'Belirtilmemiş'
                }))
            },
            todaySchedule,
            monthlyActivity,
            activeAlbums,
            upcomingShootsDetailed: upcomingShootsFormatted
        });

    } catch (error: any) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
