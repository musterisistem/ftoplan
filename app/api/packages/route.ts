import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    try {
        await dbConnect();

        // Ensure packages exist, if not seed them
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
