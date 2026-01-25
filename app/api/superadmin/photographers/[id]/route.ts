import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET - Get photographer details
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const photographer = await User.findById(id).select('-password');
        if (!photographer) {
            return NextResponse.json({ error: 'Fotoğrafçı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(photographer);
    } catch (error: any) {
        console.error('Get photographer error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update photographer
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        console.log('PUT Photographer - ID:', id);
        console.log('PUT Photographer - Body received:', body);
        console.log('PUT Photographer - Slug in body:', body.slug);

        // Check if slug is being updated and if it already exists for another user
        if (body.slug) {
            const existingSlug = await User.findOne({
                slug: body.slug.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingSlug) {
                return NextResponse.json({ error: 'Bu site URL zaten kullanılıyor' }, { status: 400 });
            }
            body.slug = body.slug.toLowerCase();
        }

        console.log('PUT Photographer - Updating with:', body);

        const photographer = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).select('-password');

        console.log('PUT Photographer - Updated slug:', photographer?.slug);

        if (!photographer) {
            return NextResponse.json({ error: 'Fotoğrafçı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(photographer);
    } catch (error: any) {
        console.error('Update photographer error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete photographer
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const photographer = await User.findByIdAndDelete(id);
        if (!photographer) {
            return NextResponse.json({ error: 'Fotoğrafçı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Fotoğrafçı silindi' });
    } catch (error: any) {
        console.error('Delete photographer error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
