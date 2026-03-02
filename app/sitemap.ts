import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.weey.net';

    // 1. Static Public Pages
    const staticRoutes = [
        '',
        '/paketler',
        '/ozellikler',
        '/neden-biz',
        '/sss',
        '/iletisim',
        '/yorumbirak',
        '/kurumsal',
        '/gizlilik-politikasi',
        '/kullanim-sartlari',
        '/mesafeli-satis-sozlesmesi',
        '/kvkk',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Dynamic Photographer Pages (Client Sites)
    const dynamicRoutes: MetadataRoute.Sitemap = [];

    try {
        await dbConnect();

        // Fetch all active photographers with a valid slug
        const photographers = await User.find(
            {
                role: 'admin',
                isActive: true,
                slug: { $exists: true, $ne: null, $ne: '' },
            },
            { slug: 1, updatedAt: 1 }
        ).lean();

        photographers.forEach((photographer: any) => {
            if (photographer.slug) {
                const updatedDate = photographer.updatedAt || new Date();
                const basePath = `/studio/${photographer.slug}`;

                // Main Studio Page
                dynamicRoutes.push({
                    url: `${baseUrl}${basePath}`,
                    lastModified: updatedDate,
                    changeFrequency: 'daily' as const,
                    priority: 0.9,
                });

                // Studio Subpages
                const subpages = [
                    { path: '/about', priority: 0.8 },
                    { path: '/gallery', priority: 0.8 },
                    { path: '/contact', priority: 0.8 },
                    { path: '/selection/login', priority: 0.6 }
                ];

                subpages.forEach(({ path, priority }) => {
                    dynamicRoutes.push({
                        url: `${baseUrl}${basePath}${path}`,
                        lastModified: updatedDate,
                        changeFrequency: 'weekly' as const,
                        priority,
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error fetching photographers for sitemap:', error);
    }

    // Return combined routes
    // Explicit exclusions (not added to this array):
    // /admin, /superadmin, /login, /register, /checkout etc.
    return [...staticRoutes, ...dynamicRoutes];
}
