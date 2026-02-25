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

        const oldPhotographer = await User.findById(id).select('packageType storageLimit name email subscriptionExpiry');

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

        // Send Plan Updated Email if package or storage changed
        const isPlanChanged =
            (body.packageType !== undefined && body.packageType !== oldPhotographer?.packageType) ||
            (body.storageLimit !== undefined && body.storageLimit !== oldPhotographer?.storageLimit);

        if (isPlanChanged && photographer.email) {
            try {
                const { sendEmailWithTemplate } = await import('@/lib/resend');
                const { EmailTemplateType } = await import('@/models/EmailTemplate');

                const packageNames: Record<string, string> = {
                    'trial': 'Ücretsiz Deneme',
                    'standart': 'Standart Paket',
                    'kurumsal': 'Kurumsal Paket'
                };

                const formatBytes = (bytes: number) => {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                };

                await sendEmailWithTemplate({
                    to: photographer.email,
                    templateType: EmailTemplateType.PLAN_UPDATED,
                    photographerId: photographer._id.toString(),
                    data: {
                        photographerName: photographer.name || 'Fotoğrafçı',
                        newPlanName: packageNames[photographer.packageType] || photographer.packageType,
                        expiryDate: photographer.subscriptionExpiry ? new Date(photographer.subscriptionExpiry).toLocaleDateString('tr-TR') : 'Belirtilmedi',
                        storageLimit: formatBytes(photographer.storageLimit)
                    }
                });
            } catch (err) {
                console.error('Failed to send plan update email:', err);
            }
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
