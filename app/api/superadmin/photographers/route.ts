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

        // Calculate subscription expiry
        const subscriptionExpiry = new Date();
        if (packageType === 'trial') {
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 7); // 7 days for trial
        } else {
            subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1); // 1 year for others
        }

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

        const photographer = await User.create({
            ...photographerData,
            isEmailVerified: true // Pre-verified if created by SuperAdmin
        });

        // Send Welcome Email
        try {
            const { sendEmailWithTemplate } = await import('@/lib/resend');
            const { EmailTemplateType } = await import('@/models/EmailTemplate');

            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

            await sendEmailWithTemplate({
                to: email,
                templateType: EmailTemplateType.WELCOME_PHOTOGRAPHER,
                photographerId: photographer._id.toString(),
                data: {
                    photographerName: name,
                    studioName: studioName,
                    loginUrl: `${baseUrl}/login`
                }
            });
        } catch (err) {
            console.error('Failed to send welcome email:', err);
        }

        console.log('Photographer created - actual slug in DB:', photographer.slug);

        // Don't return password
        const { password: _, ...responseData } = photographer.toObject();

        return NextResponse.json(responseData, { status: 201 });

    } catch (error: any) {
        console.error('Create photographer error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Bulk delete photographers
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Silinecek kullanıcılar belirtilmedi' }, { status: 400 });
        }

        const result = await User.deleteMany({
            _id: { $in: ids },
            role: 'admin' // Only delete admins (photographers)
        });

        return NextResponse.json({
            message: `${result.deletedCount} fotoğrafçı silindi`,
            deletedCount: result.deletedCount
        });

    } catch (error: any) {
        console.error('Bulk delete photographers error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
