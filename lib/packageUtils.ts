import dbConnect from '@/lib/mongodb';
import ShootPackage from '@/models/ShootPackage';

/**
 * Creates default shooting packages for a photographer if they don't have any.
 * @param photographerId The _id of the photographer (User)
 * @returns Array of created packages
 */
export async function createDefaultPackages(photographerId: string | any) {
    if (!photographerId) return [];

    try {
        await dbConnect();

        // Ensure photographer doesn't already have packages
        const existingCount = await ShootPackage.countDocuments({ photographerId });
        if (existingCount > 0) return [];

        const defaultPackages = [
            {
                photographerId,
                name: 'Standart Dış Çekim',
                tagline: 'Dış mekanda eşsiz bir deneyim',
                price: 10000,
                currency: 'TL',
                features: {
                    albumSizes: ['30x50 Panoramik Albüm'],
                    albumTypes: ['Deri Kapak'],
                    albumPages: 10,
                    familyAlbums: 2,
                    familyAlbumSize: '15x21',
                    posterSize: '50x70',
                    posterCount: 1,
                    extras: [
                        { name: 'Drone Çekimi', price: 2500 },
                        { name: 'Video Klip (Teaser)', price: 1500 }
                    ]
                },
                isPopular: false,
                isActive: true
            },
            {
                photographerId,
                name: 'Premium Düğün Hikayesi',
                tagline: 'Tüm gün kesintisiz düğün belgeseli',
                price: 15000,
                currency: 'TL',
                features: {
                    albumSizes: ['35x65 Panoramik Albüm'],
                    albumTypes: ['Kristal Kapak', 'Keten Kapak'],
                    albumPages: 12,
                    familyAlbums: 2,
                    familyAlbumSize: '18x24',
                    posterSize: '50x70',
                    posterCount: 2,
                    extras: [
                        { name: 'Tüm Gün Video Klip', price: 4000 },
                        { name: 'Drone Çekimi', price: 2500 },
                        { name: 'Jimmy Jib', price: 3000 }
                    ]
                },
                isPopular: true,
                isActive: true
            }
        ];

        const created = await ShootPackage.insertMany(defaultPackages);
        console.log(`[System] Created ${created.length} default packages for photographer ${photographerId}`);
        return created;

    } catch (error) {
        console.error('[System] Error creating default packages:', error);
        return [];
    }
}
