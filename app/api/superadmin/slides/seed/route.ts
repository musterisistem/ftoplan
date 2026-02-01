import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DashboardSlide from '@/models/DashboardSlide';

// POST - Seed demo slides
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Check if slides already exist
        const existingSlides = await DashboardSlide.countDocuments();

        if (existingSlides > 0) {
            return NextResponse.json({
                message: 'Demo slides already exist',
                count: existingSlides
            });
        }

        // Demo slides data
        const demoSlides = [
            {
                title: 'Yeni Özellikler Keşfedin',
                description: 'Dashboard\'unuzu daha verimli kullanmak için yeni özellikleri inceleyin ve işinizi kolaylaştırın.',
                imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
                link: '',
                isActive: true,
                order: 0
            },
            {
                title: 'Premium Paketleri İnceleyin',
                description: 'Profesyonel fotoğrafçılık hizmetlerinizi bir üst seviyeye taşıyın. Premium paketlerimizi keşfedin.',
                imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=400&fit=crop',
                link: '',
                isActive: true,
                order: 1
            },
            {
                title: 'Müşteri Memnuniyeti #1',
                description: 'Binlerce mutlu müşterimiz var. Siz de onlara katılın ve işinizi büyütün.',
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
                link: '',
                isActive: true,
                order: 2
            }
        ];

        // Insert demo slides
        const slides = await DashboardSlide.insertMany(demoSlides);

        return NextResponse.json({
            message: 'Demo slides seeded successfully',
            count: slides.length,
            slides
        }, { status: 201 });

    } catch (error: any) {
        console.error('Seed Slides Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
