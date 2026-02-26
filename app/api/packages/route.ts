import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    try {
        await dbConnect();

        // Default packages updated according to user requirements
        const defaultPackages = [
            {
                id: 'trial',
                name: 'Ücretsiz Deneme',
                price: 0,
                storage: 0.5,
                maxCustomers: 1,
                maxPhotos: 30,
                maxAppointments: 1,
                hasWatermark: true,
                hasWebsite: false,
                supportType: 'E-posta',
                popular: false,
                description: 'Sistemimizi keşfetmeniz için tasarlanmış 3 günlük risksiz başlangıç planı.',
                features: [
                    '500 MB Hızlı Bulut Depolama',
                    '1 Aktif Müşteri Takibi',
                    '30 Fotoğraflık Deneme Galerisi',
                    'Randevu Sistemi Önizlemesi',
                    'Mobil Uygulama Erişimi (iOS/Android)',
                    'Online Cari Hesap Girişi',
                    'Otomatik Fotoğraf Optimizasyonu',
                    'Müşteri Durum Mail Bilgilendirme',
                    'Filigranlı Fotoğraflar',
                    'E-posta Destek'
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
                description: 'Fotoğrafçılar için tüm temel iş süreçlerini dijitalleştiren profesyonel çözüm.',
                features: [
                    '10 GB Güvenli Bulut Arşivi',
                    'Sınırsız Müşteri Kaydı & Yönetimi',
                    'Sınırsız Fotoğraf Yükleme & Paylaşım',
                    'Filigransız ve Şifreli Müşteri Galerileri',
                    'Görsel Fotoğraf Seçim Arayüzü',
                    'Otomatik Randevu SMS & Mail Hatırlatıcılar',
                    'Gelişmiş Finansal Gelir-Gider Takibi',
                    'Dijital Sözleşme İmzalama Altyapısı',
                    'Tam Teşekküllü Mobil Uygulama Paneli',
                    'Müşteri Durum Mail Bilgilendirme'
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
                description: 'Markasını büyütmek ve premium bir deneyim sunmak isteyen stüdyolar için.',
                features: [
                    '30 GB Genişletilebilir Depolama Alanı',
                    'Stüdyonuza Özel Profesyonel Web Sitesi',
                    'Özel Alan Adı Desteği (domain.com)',
                    'Kurumsal İş E-posta Adresi (info@...)',
                    'Markanıza Özel Arayüz Özelleştirmeleri',
                    '7/24 VIP Müşteri ve Teknik Destek Hattı',
                    'Çoklu Ekip & Asistan Yetkilendirme Sistemi',
                    'Detaylı İş Analizi ve Performans Raporları',
                    'Tüm Standart Özellikler'
                ]
            }
        ];

        // Seed/Update packages
        for (const pkg of defaultPackages) {
            await Package.findOneAndUpdate(
                { id: pkg.id },
                { $set: pkg }, // Use $set to update existing packages with new requirements
                { upsert: true, new: true }
            );
        }

        const packages = await Package.find().sort({ price: 1 });
        return NextResponse.json(packages);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
