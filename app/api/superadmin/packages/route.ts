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

        // Default packages updated according to user requirements
        const defaultPackages = [
            {
                id: 'trial',
                name: 'Deneme Paketi',
                price: 0,
                storage: 0.5,
                maxCustomers: 1,
                maxPhotos: 30,
                maxAppointments: 1,
                hasWatermark: true,
                hasWebsite: false,
                supportType: 'E-posta',
                popular: false,
                description: '3 gün sonunda hesabınız pasif duruma geçer.',
                features: [
                    '500 MB Depolama Alanı',
                    '1 Aktif Müşteri',
                    'Maksimum 30 Fotoğraf Yükleme',
                    '1 Aktif Randevu',
                    'Albüm Fotoğraf Yükleme',
                    'Yüklenen fotoğraflar filigranlıdır'
                ]
            },
            {
                id: 'standart',
                name: 'Standart Paket',
                price: 9499,
                storage: 10,
                maxCustomers: -1,
                maxPhotos: -1,
                maxAppointments: -1,
                hasWatermark: false,
                hasWebsite: false,
                supportType: 'E-posta',
                popular: true,
                description: 'Profesyonel stüdyolar için tüm yönetim araçları.',
                features: [
                    '10 GB Depolama Alanı',
                    'Sınırsız Müşteri Ekleme',
                    'Randevu Hatırlatma Sistemi'
                ]
            },
            {
                id: 'kurumsal',
                name: 'Kurumsal Paket',
                price: 19999,
                storage: 30,
                maxCustomers: -1,
                maxPhotos: -1,
                maxAppointments: -1,
                hasWatermark: false,
                hasWebsite: true,
                supportType: '7/24 Öncelikli',
                popular: false,
                description: 'Kurumsal web sitesi ve özel hizmetler.',
                features: [
                    '30 GB Depolama Alanı',
                    'Firmanıza Özel Web Sitesi',
                    '7/24 Öncelikli Destek'
                ]
            }
        ];

        for (const pkg of defaultPackages) {
            await Package.findOneAndUpdate(
                { id: pkg.id },
                { $setOnInsert: pkg },
                { upsert: true, new: true }
            );
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
        const {
            id, name, price, storage, features, popular,
            maxCustomers, maxPhotos, maxAppointments,
            hasWatermark, hasWebsite, supportType, description
        } = data;

        if (!id || !name || price === undefined || storage === undefined) {
            return NextResponse.json({ error: 'Eksik bilgi gönderildi' }, { status: 400 });
        }

        await dbConnect();

        const updatedPackage = await Package.findOneAndUpdate(
            { id },
            {
                name, price, storage, features, popular,
                maxCustomers, maxPhotos, maxAppointments,
                hasWatermark, hasWebsite, supportType, description
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, package: updatedPackage });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
