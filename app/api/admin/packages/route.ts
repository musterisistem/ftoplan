import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ShootPackage from '@/models/ShootPackage';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        let packages = await ShootPackage.find({ photographerId: user._id }).lean();
        
        // Retrofit for existing users: if they have 0 packages, create the defaults
        if (packages.length === 0) {
            const { createDefaultPackages } = await import('@/lib/packageUtils');
            await createDefaultPackages(user._id);
            packages = await ShootPackage.find({ photographerId: user._id }).lean();
        }

        return NextResponse.json({ packages });
    } catch (error) {
        console.error('Error fetching packages:', error);
        return NextResponse.json({ error: 'Paketler getirilemedi' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
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

        const newPackage = await ShootPackage.create({
            ...data,
            photographerId: user._id
        });

        return NextResponse.json({ package: newPackage }, { status: 201 });
    } catch (error) {
        console.error('Error creating package:', error);
        return NextResponse.json({ error: 'Paket oluşturulamadı' }, { status: 500 });
    }
}
