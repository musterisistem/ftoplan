import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/User';
import Package from '@/models/Package';

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        
        if (session?.user?.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // Fetch all orders with details
        const allOrders = await Order.find({})
            .populate('userId', 'name email studioName phone billingInfo.identityNumber billingInfo.companyType')
            .populate('packageId', 'name price')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate Stats
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const firstDayThisYear = new Date(now.getFullYear(), 0, 1);

        // Success condition: completed orders
        const getSalesSum = (startDate: Date, endDate: Date = new Date()) => {
            return allOrders
                .filter(o => o.status === 'completed' && new Date(o.createdAt) >= startDate && new Date(o.createdAt) <= endDate)
                .reduce((sum, o) => sum + (o.amount || 0), 0);
        };

        const stats = {
            thisMonthSales: getSalesSum(firstDayThisMonth),
            lastMonthSales: getSalesSum(firstDayLastMonth, lastDayLastMonth),
            thisYearSales: getSalesSum(firstDayThisYear),
        };

        return NextResponse.json({ 
            orders: allOrders,
            stats
        });

    } catch (error: any) {
        console.error('[SuperAdmin Payments GET]', error);
        return NextResponse.json({ error: 'Ödeme verileri alınamadı.' }, { status: 500 });
    }
}
