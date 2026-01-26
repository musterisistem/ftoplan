import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - Get current photographer's studio settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        console.log('Studio Settings - Session:', session?.user?.email);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email, role: 'admin' })
            .select('name email studioName slug logo bannerImage primaryColor siteTheme aboutText phone instagram facebook whatsapp portfolioPhotos');

        console.log('Studio Settings - User found:', user ? { email: user.email, slug: user.slug } : 'NOT FOUND');

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Studio settings GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update studio settings
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const body = await req.json();
        const { studioName, logo, bannerImage, primaryColor, siteTheme, aboutText, phone, instagram, facebook, whatsapp, portfolioPhotos } = body;

        await dbConnect();

        const user = await User.findOneAndUpdate(
            { email: session.user.email, role: 'admin' },
            {
                $set: {
                    studioName,
                    logo,
                    bannerImage,
                    primaryColor,
                    siteTheme,
                    aboutText,
                    phone,
                    instagram,
                    facebook,
                    whatsapp,
                    portfolioPhotos
                }
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Revalidate the studio site path to show changes immediately
        if (user.slug) {
            try {
                console.log('Revalidating studio path:', `/studio/${user.slug}`);
                revalidatePath(`/studio/${user.slug}`, 'layout');
                revalidatePath(`/studio/${user.slug}`, 'page');
            } catch (err) {
                console.error('Revalidation error:', err);
            }
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Studio settings PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
