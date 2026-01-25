import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - List all photographers
export async function GET() {
    try {
        await dbConnect();

        const photographers = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json(photographers);

    } catch (error: any) {
        console.error('Photographers list error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new photographer
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, studioName, slug, phone, packageType, storageLimit } = body;

        console.log('Creating photographer with data:', { email, name, studioName, slug, phone, packageType });

        if (!email || !password) {
            return NextResponse.json({ error: 'Email ve şifre gereklidir' }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ error: 'Site URL (slug) gereklidir' }, { status: 400 });
        }

        await dbConnect();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
        }

        // Check if slug already exists
        const existingSlug = await User.findOne({ slug: slug.toLowerCase() });
        if (existingSlug) {
            return NextResponse.json({ error: 'Bu site URL zaten kullanılıyor' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Calculate subscription expiry (1 year from now)
        const subscriptionExpiry = new Date();
        subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);

        // Create photographer
        const photographerData = {
            email,
            password: hashedPassword,
            name,
            studioName,
            slug: slug.toLowerCase(),
            phone,
            role: 'admin',
            packageType: packageType || 'starter',
            storageLimit: storageLimit || 21474836480,
            storageUsage: 0,
            subscriptionExpiry,
            isActive: true
        };

        console.log('Saving photographer with slug:', photographerData.slug);

        const photographer = await User.create(photographerData);

        console.log('Photographer created - actual slug in DB:', photographer.slug);

        // Don't return password
        const { password: _, ...responseData } = photographer.toObject();

        return NextResponse.json(responseData, { status: 201 });

    } catch (error: any) {
        console.error('Create photographer error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
