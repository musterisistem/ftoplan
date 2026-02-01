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
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Get Admin User (Photographer) Info & Storage
        const userId = session.user.id;
        const user = await User.findById(userId).select('storageUsage storageLimit name email panelLogo logo');

        // 2. Aggregate counts
        // Photos: Sum of all photos in Customer.photos + Customer.selectedPhotos
        const photoStats = await Customer.aggregate([
            {
                $group: {
                    _id: null,
                    totalPhotos: { $sum: { $size: { $ifNull: ["$photos", []] } } },
                    totalSelected: { $sum: { $size: { $ifNull: ["$selectedPhotos", []] } } }
                }
            }
        ]);
        const totalPhotos = (photoStats[0]?.totalPhotos || 0) + (photoStats[0]?.totalSelected || 0);

        // Album Counts
        const totalAlbums = await Customer.countDocuments({ status: { $ne: 'archived' } });
        const deletedAlbums = await Customer.countDocuments({ status: 'archived' });

        // 3. Recent Activities (Album Approvals)
        const recentActivities = await Customer.find({
            selectionApprovedAt: { $ne: null }
        })
            .select('brideName groomName selectionApprovedAt')
            .sort({ selectionApprovedAt: -1 })
            .limit(10);

        // 4. Upcoming Shoots
        const upcomingShoots = await Shoot.find({
            date: { $gte: new Date() },
            status: 'planned'
        })
            .sort({ date: 1 })
            .limit(5)
            .populate('customerId', 'brideName groomName email phone');

        // 5. Shoot Distribution (for Chart)
        const shootDistribution = await Shoot.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Monthly Revenue Aggregation (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of month

        const monthlyRevenue = await Shoot.aggregate([
            {
                $match: {
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    revenue: { $sum: "$agreedPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format for Chart: [{ name: 'Jan', value: 5000 }, ...]
        const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        const revenueChartData = monthlyRevenue.map(item => ({
            name: monthNames[item._id.month - 1],
            value: item.revenue,
            year: item._id.year
        }));

        // 7. Staff & Active Shoots Count (This Month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const activeShootsThisMonth = await Shoot.countDocuments({
            date: { $gte: startOfMonth },
            status: { $ne: 'cancelled' }
        });

        // Active Customers (Total)
        const activeCustomers = await Customer.countDocuments({ status: 'active' });

        // Total Earnings
        const earningStats = await Shoot.aggregate([
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$agreedPrice" }
                }
            }
        ]);
        const totalEarnings = earningStats[0]?.totalEarnings || 0;

        const staffMembers = [
            {
                id: user._id,
                name: user.name || 'Yönetici',
                username: user.email?.split('@')[0],
                isOnline: true,
                role: 'Admin'
            }
        ];

        // 8. Calendar Data - Days with events this month
        const startOfCurrentMonth = new Date();
        startOfCurrentMonth.setDate(1);
        startOfCurrentMonth.setHours(0, 0, 0, 0);

        const endOfCurrentMonth = new Date();
        endOfCurrentMonth.setMonth(endOfCurrentMonth.getMonth() + 1);
        endOfCurrentMonth.setDate(0);
        endOfCurrentMonth.setHours(23, 59, 59, 999);

        const shootsThisMonth = await Shoot.find({
            date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            status: { $ne: 'cancelled' }
        }).select('date').lean();

        const daysWithEvents = [...new Set(shootsThisMonth.map(shoot => new Date(shoot.date).getDate()))];

        // 9. Today's Schedule
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayShoots = await Shoot.find({
            date: { $gte: startOfToday, $lte: endOfToday },
            status: { $ne: 'cancelled' }
        })
            .sort({ date: 1 })
            .populate('customerId', 'brideName groomName')
            .lean();

        const todaySchedule = todayShoots.map(shoot => ({
            time: new Date(shoot.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            customerName: `${(shoot.customerId as any)?.brideName || ''} & ${(shoot.customerId as any)?.groomName || ''}`.trim(),
            type: shoot.type || 'Çekim',
            location: shoot.location || 'Belirtilmemiş',
            duration: '2h' // Default, can be calculated if needed
        }));

        // 10. Monthly Activity (Shoots per week)
        const weeksInMonth = [
            { name: 'Hft 1', start: 1, end: 7 },
            { name: 'Hft 2', start: 8, end: 14 },
            { name: 'Hft 3', start: 15, end: 21 },
            { name: 'Hft 4', start: 22, end: 31 }
        ];

        const monthlyActivity = await Promise.all(
            weeksInMonth.map(async (week) => {
                const weekStart = new Date(startOfCurrentMonth);
                weekStart.setDate(week.start);
                const weekEnd = new Date(startOfCurrentMonth);
                weekEnd.setDate(week.end);
                weekEnd.setHours(23, 59, 59, 999);

                const count = await Shoot.countDocuments({
                    date: { $gte: weekStart, $lte: weekEnd },
                    status: { $ne: 'cancelled' }
                });

                return {
                    name: week.name,
                    count
                };
            })
        );

        const currentMonthName = monthNames[new Date().getMonth()];
        const currentYear = new Date().getFullYear();

        // 11. Active Albums (with photos uploaded)
        const activeAlbumsData = await Customer.find({
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
            hasSelection: customer.appointmentStatus === 'fotograflar_secildi' || customer.appointmentStatus === 'album_bekleniyor' || customer.appointmentStatus === 'teslim_edildi',
            thumbnailUrl: customer.photos?.[0]?.url || ''
        }));

        // 12. Upcoming Shoots Detailed (with customer info)
        const upcomingShootsDetailed = await Shoot.find({
            date: { $gte: new Date() },
            status: 'planned'
        })
            .sort({ date: 1 })
            .limit(5)
            .populate('customerId', 'brideName groomName')
            .lean();

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
                limit: user.storageLimit || 21474836480, // Default 20GB
            },
            counts: {
                photos: totalPhotos,
                albums: totalAlbums, // Total active albums
                deletedAlbums: deletedAlbums,
                activeShootsMonth: activeShootsThisMonth,
                activeCustomers: activeCustomers, // For "Total Contact" equivalent
                totalRevenue: totalEarnings
            },
            revenueChart: revenueChartData,
            recentActivities,
            upcomingShoots, // Original format
            shootDistribution,
            earnings: {
                total: totalEarnings,
                currency: '₺'
            },
            staffMembers,
            // NEW: Calendar and Schedule Data
            calendar: {
                currentMonth: `${currentMonthName} ${currentYear}`,
                daysWithEvents
            },
            todaySchedule,
            monthlyActivity,
            // NEW: Detailed Data for Widgets
            activeAlbums,
            upcomingShootsDetailed: upcomingShootsFormatted
        });

    } catch (error: any) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
