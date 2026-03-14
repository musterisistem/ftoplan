import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    try {
        await dbConnect();

        // Only fetch packages, do not seed/override them
        // If there are no packages, they should be created from the superadmin panel.
        const packages = await Package.find().sort({ price: 1 }).lean();
        
        // Use prices directly as stored in DB
        const normalizedPackages = packages.map((pkg: any) => ({
            ...pkg,
            price: Math.round(pkg.price)
        }));

        return NextResponse.json(normalizedPackages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
