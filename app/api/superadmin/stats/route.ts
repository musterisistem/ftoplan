import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

export async function GET() {
    try {
        await dbConnect();

        // Get all photographers (role = 'admin')
        const photographers = await User.find({ role: 'admin' });

        // Calculate stats
        const totalPhotographers = photographers.length;
        const activePhotographers = photographers.filter(p => p.isActive).length;

        // Calculate total storage
        let totalStorage = 0;
        let usedStorage = 0;
        photographers.forEach(p => {
            totalStorage += p.storageLimit || 21474836480;
            usedStorage += p.storageUsage || 0;
        });

        // Count expiring subscriptions (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringSubscriptions = photographers.filter(p => {
            if (!p.subscriptionExpiry) return false;
            const expiry = new Date(p.subscriptionExpiry);
            return expiry <= thirtyDaysFromNow && expiry > new Date();
        }).length;

        // Calculate monthly revenue (based on package types)
        const packagePrices: Record<string, number> = {
            starter: 999,
            pro: 1999,
            premium: 3499
        };

        const monthlyRevenue = photographers.reduce((total, p) => {
            return total + (packagePrices[p.packageType || 'starter'] || 0);
        }, 0);

        return NextResponse.json({
            totalPhotographers,
            activePhotographers,
            totalStorage,
            usedStorage,
            monthlyRevenue: Math.round(monthlyRevenue / 12), // Yearly to monthly
            expiringSubscriptions
        });

    } catch (error: any) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
