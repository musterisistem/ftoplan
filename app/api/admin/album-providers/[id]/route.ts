import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import AlbumProvider from '@/models/AlbumProvider';

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> } // Fix type mismatch using Promise
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await context.params;
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Ensure user owns this provider before deleting
        const provider = await AlbumProvider.findOneAndDelete({
            _id: id,
            photographerId: session.user.id
        });

        if (!provider) {
            return NextResponse.json({ error: 'Tedarikçi bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Tedarikçi başarıyla silindi' });

    } catch (error: any) {
        console.error('Error deleting album provider:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> } // Fix type mismatch using Promise
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await context.params;
        const { id } = resolvedParams;
        const body = await req.json();

        // This endpoint logic allows adding covers or updating the name
        // The client will pass `covers` as the entirely new array or `name`
        
        await dbConnect();

        const provider = await AlbumProvider.findOne({
            _id: id,
            photographerId: session.user.id
        });

        if (!provider) {
            return NextResponse.json({ error: 'Tedarikçi bulunamadı' }, { status: 404 });
        }

        if (body.name) {
            provider.name = body.name;
        }

        if (body.covers !== undefined) {
             provider.covers = body.covers;
        }

        await provider.save();

        return NextResponse.json(provider);

    } catch (error: any) {
        console.error('Error updating album provider:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
