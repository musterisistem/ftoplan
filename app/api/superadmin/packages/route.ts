import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        await dbConnect();

        // Seed default packages if none exist
        const count = await Package.countDocuments();
        if (count === 0) {
            await Package.insertMany([
                {
                    id: 'standart',
                    name: 'Standart Paket',
                    price: 2999,
                    storage: 10,
                    popular: false,
                    features: [
                        '10 GB Depolama',
                        'Sınırsız Müşteri Ekleme',
                        'Online Albüm Teslimatı',
                        'Temel E-posta Desteği',
                        'Standart Galeri Tasarımları'
                    ]
                },
                {
                    id: 'kurumsal',
                    name: 'Kurumsal Paket',
                    price: 4999,
                    storage: 30,
                    popular: true,
                    features: [
                        '30 GB Depolama',
                        'Sınırsız Müşteri Ekleme',
                        'Online Albüm Teslimatı',
                        'Öncelikli 7/24 Destek',
                        'Premium Galeri Tasarımları',
                        'Kendi Logonuzla White Label',
                        'İşletmeye Özel Kurumsal E-Posta'
                    ]
                }
            ]);
        }

        const packages = await Package.find().sort({ price: 1 });
        return NextResponse.json(packages);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const data = await req.json();
        const { id, name, price, storage, features, popular } = data;

        if (!id || !name || price === undefined || storage === undefined) {
            return NextResponse.json({ error: 'Eksik bilgi gönderildi' }, { status: 400 });
        }

        await dbConnect();

        const updatedPackage = await Package.findOneAndUpdate(
            { id },
            { name, price, storage, features, popular },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, package: updatedPackage });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
