import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    try {
        await dbConnect();

        // Only fetch packages, do not seed/override them
        // If there are no packages, they should be created from the superadmin panel.
        const packages = await Package.find().sort({ price: 1 }).lean();
        
        // Normalize prices to handle 11.999 vs 11999 cases globally
        const normalizedPackages = packages.map((pkg: any) => ({
            ...pkg,
            price: pkg.price < 1000 ? Math.round(pkg.price * 1000) : Math.round(pkg.price)
        }));

        return NextResponse.json(normalizedPackages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
