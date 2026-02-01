import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import DashboardSlide from '@/models/DashboardSlide';

// PUT - Update slide
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { title, description, imageUrl, link, isActive, order } = body;

        const slide = await DashboardSlide.findByIdAndUpdate(
            params.id,
            {
                title,
                description,
                imageUrl,
                link,
                isActive,
                order,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json(slide);
    } catch (error: any) {
        console.error('Update Slide Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete slide
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const slide = await DashboardSlide.findByIdAndDelete(params.id);

        if (!slide) {
            return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Slide deleted successfully' });
    } catch (error: any) {
        console.error('Delete Slide Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
