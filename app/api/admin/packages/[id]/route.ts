import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ShootPackage from '@/models/ShootPackage';
import User from '@/models/User';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const data = await req.json();

        const updatedPackage = await ShootPackage.findOneAndUpdate(
            { _id: id, photographerId: user._id },
            { $set: data },
            { new: true }
        );

        if (!updatedPackage) {
            return NextResponse.json({ error: 'Paket bulunamadı veya yetkiniz yok' }, { status: 404 });
        }

        return NextResponse.json({ package: updatedPackage });
    } catch (error) {
        console.error('Error updating package:', error);
        return NextResponse.json({ error: 'Paket güncellenemedi' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const deletedPackage = await ShootPackage.findOneAndDelete({ 
            _id: id, 
            photographerId: user._id 
        });

        if (!deletedPackage) {
            return NextResponse.json({ error: 'Paket bulunamadı veya yetkiniz yok' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting package:', error);
        return NextResponse.json({ error: 'Paket silinemedi' }, { status: 500 });
    }
}
