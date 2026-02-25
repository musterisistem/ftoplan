import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Shoot from '@/models/Shoot';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');

        if (!q || q.trim().length === 0) {
            return NextResponse.json([]);
        }

        const queryStr = q.trim();
        const regex = new RegExp(queryStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        const photographerId = session.user.id;

        await dbConnect();

        const results = [];

        // 1. Static Menus (Panel routes) search
        const menus = [
            { title: 'Dashboard', url: '/admin/dashboard', desc: 'Ana sayfa ve özet paneli' },
            { title: 'Müşteriler', url: '/admin/customers', desc: 'Gelin, damat ve abone yönetimi' },
            { title: 'Yeni Müşteri Ekle', url: '/admin/customers/new', desc: 'Müşteri oluşturma ekranı' },
            { title: 'Çekim Takvimi', url: '/admin/calendar', desc: 'Hatırlatıcı ve çekim randevuları' },
            { title: 'Finans', url: '/admin/finance', desc: 'Gelir, gider ve raporlar' },
            { title: 'Sözleşmeler', url: '/admin/contracts', desc: 'Online sözleşmeler' },
            { title: 'Teklifler', url: '/admin/proposals', desc: 'Müşterilere fiyat teklifleri oluştur' },
            { title: 'E-posta Gönderimi', url: '/admin/communications/email', desc: 'Müşterilere toplu e-posta gönder' },
            { title: 'Ayarlar (Genel)', url: '/admin/settings/general', desc: 'Stüdyo genel ayarları' },
            { title: 'Ayarlar (İletişim)', url: '/admin/settings/contact', desc: 'Adres ve sosyal medya' },
            { title: 'Ayarlar (Tema)', url: '/admin/settings/theme', desc: 'Müşteri paneli renk ve logo ayarları' },
        ];

        for (const menu of menus) {
            if (regex.test(menu.title) || regex.test(menu.desc)) {
                results.push({
                    type: 'menu',
                    title: menu.title,
                    subtitle: 'Menü Kısayolu',
                    url: menu.url,
                    icon: 'LayoutTemplate'
                });
            }
        }

        // 2. Customers (Müşteriler)
        // Check if query is potentially a date string (e.g., "12.05", "2024", "12/05/2024")
        let dateQuery = null;
        const potentialDate = new Date(queryStr.split('.').reverse().join('-')); // Simple DD.MM.YYYY to YYYY-MM-DD
        if (!isNaN(potentialDate.getTime()) && potentialDate.getFullYear() > 2000) {
            const startOfDay = new Date(potentialDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(potentialDate.setHours(23, 59, 59, 999));
            dateQuery = { weddingDate: { $gte: startOfDay, $lte: endOfDay } };
        }

        const customerQuery: any = { photographerId };

        let orConditions: any[] = [
            { brideName: regex },
            { groomName: regex },
            { phone: regex },
            { email: regex }
        ];

        if (dateQuery) {
            orConditions.push(dateQuery);
        }

        customerQuery.$or = orConditions;

        const customers = await Customer.find(customerQuery).select('_id brideName groomName phone weddingDate status').limit(5).lean() as any;

        for (const c of customers) {
            results.push({
                type: 'customer',
                title: `${c.brideName} & ${c.groomName || '?'}`.replace(' & ?', ''),
                subtitle: c.weddingDate ? new Date(c.weddingDate).toLocaleDateString('tr-TR') : (c.phone || 'Telefon yok'),
                url: `/admin/customers/${c._id}`,
                icon: 'Users'
            });
        }

        // 3. Shoots (Çekimler/Randevular)
        const shootQuery = {
            photographerId,
            $or: [
                { location: regex },
                { city: regex },
                { notes: regex },
                { packageName: regex },
                { type: regex }
            ]
        };

        const shoots = await Shoot.find(shootQuery).populate('customerId', 'brideName groomName').select('_id date location type customerId').limit(5).lean() as any;

        for (const s of shoots) {
            const cus = s.customerId ? `${s.customerId.brideName} & ${s.customerId.groomName || '?'}`.replace(' & ?', '') : 'Bilinmeyen Müşteri';
            results.push({
                type: 'shoot',
                title: `${cus} - ${s.type}`,
                subtitle: `${s.location || s.city || 'Konum belirtilmedi'} • ${new Date(s.date).toLocaleDateString('tr-TR')}`,
                url: `/admin/calendar`, // Shoots typically don't have individual pages, points to calendar for now
                icon: 'Camera'
            });
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
