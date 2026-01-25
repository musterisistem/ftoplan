import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const photographer = await User.findOne({
            slug: slug.toLowerCase(),
            role: 'admin'
        }).select('name studioName slug logo bannerImage primaryColor siteTheme aboutText phone instagram facebook whatsapp');

        if (!photographer) {
            return NextResponse.json({ error: 'Stüdyo bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(photographer);
    } catch (error: any) {
        console.error('Studio fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
