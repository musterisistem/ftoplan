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
            .populate('userId', 'name email studioName phone billingInfo.identityNumber billingInfo.companyType createdAt')
            .populate('packageId', 'name price')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate Stats - Only count completed CREDIT CARD orders (successful PayTR payments)
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-11
        
        // Filter only completed CREDIT CARD orders
        const completedCreditCardOrders = allOrders.filter(o => 
            o.status === 'completed' && o.paymentMethod === 'credit_card'
        );

        // Calculate sales by checking the completion date
        let thisMonthSales = 0;
        let lastMonthSales = 0;
        let thisYearSales = 0;

        completedCreditCardOrders.forEach(order => {
            // Use completedAt if available, otherwise use createdAt
            const orderDate = order.completedAt ? new Date(order.completedAt) : new Date(order.createdAt);
            const orderYear = orderDate.getFullYear();
            const orderMonth = orderDate.getMonth();
            const amount = order.amount || 0;

            // This year sales
            if (orderYear === currentYear) {
                thisYearSales += amount;
                
                // This month sales
                if (orderMonth === currentMonth) {
                    thisMonthSales += amount;
                }
                
                // Last month sales
                if (orderMonth === currentMonth - 1) {
                    lastMonthSales += amount;
                }
            }
            // Handle last month being in previous year (e.g., current month is January)
            else if (orderYear === currentYear - 1 && currentMonth === 0 && orderMonth === 11) {
                lastMonthSales += amount;
            }
        });

        const stats = {
            thisMonthSales: Math.round(thisMonthSales * 100) / 100, // Round to 2 decimal places
            lastMonthSales: Math.round(lastMonthSales * 100) / 100,
            thisYearSales: Math.round(thisYearSales * 100) / 100,
        };

        console.log('[Payments API] Credit Card Stats:', {
            totalOrders: allOrders.length,
            completedCreditCardOrders: completedCreditCardOrders.length,
            stats,
            currentDate: now.toISOString(),
            currentMonth: currentMonth,
            currentYear: currentYear,
            sampleOrders: completedCreditCardOrders.slice(0, 5).map(o => ({
                orderNo: o.orderNo,
                amount: o.amount,
                status: o.status,
                paymentMethod: o.paymentMethod,
                createdAt: o.createdAt,
                completedAt: o.completedAt,
                orderMonth: o.completedAt ? new Date(o.completedAt).getMonth() : new Date(o.createdAt).getMonth(),
                orderYear: o.completedAt ? new Date(o.completedAt).getFullYear() : new Date(o.createdAt).getFullYear()
            }))
        });

        return NextResponse.json({ 
            orders: allOrders,
            stats
        });

    } catch (error: any) {
        console.error('[SuperAdmin Payments GET]', error);
        return NextResponse.json({ error: 'Ödeme verileri alınamadı.' }, { status: 500 });
    }
}
