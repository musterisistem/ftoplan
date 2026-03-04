import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Gallery from '@/models/Gallery';
import { unstable_noStore as noStore } from 'next/cache';

export const getPhotographer = async (slug: string) => {
    noStore(); // Opt out of static caching
    await dbConnect();
    const photographer = await User.findOne({
        slug: slug.toLowerCase(),
        role: 'admin',
        isActive: true
    }).select('-password').lean();

    console.log(`[StudioUtils] Fetching photographer for slug: ${slug}`, photographer ? `Found: ${photographer.studioName} Theme: ${photographer.siteTheme}` : 'Not Found');

    if (photographer) {
        // Fallback: If photographer has no portfolio photos, provide the 15 demo images
        if (!photographer.portfolioPhotos || photographer.portfolioPhotos.length === 0) {
            photographer.portfolioPhotos = Array.from({ length: 15 }, (_, i) => ({
                url: `/demo/images/images/demof (${i + 1}).png`,
                title: 'Demo'
            }));
        }
        // Deep serialize to handle all _id (including in subarrays) and Dates
        return JSON.parse(JSON.stringify(photographer));
    }

    return null;
};

export const getAllStudioPhotos = async (photographerId: string) => {
    noStore(); // Opt out of static caching
    await dbConnect();

    // 1. Get Customers of this photographer
    const customers = await Customer.find({
        $or: [{ userId: photographerId }, { photographerId: photographerId }]
    }).select('_id');

    const customerIds = customers.map(c => c._id);

    // 2. Get Galleries of these customers
    const galleries = await Gallery.find({
        customerId: { $in: customerIds }
    }).select('photos title coverImage').lean();

    // 3. Extract Gallery Photos
    const galleryPhotos = galleries.flatMap((g: any) => {
        const photos = [];
        // Add cover image if exists
        if (g.coverImage) {
            photos.push({ url: g.coverImage, title: g.title });
        }
        // Add individual photos
        if (g.photos && Array.isArray(g.photos)) {
            photos.push(...g.photos.map((p: any) => ({
                url: p.url,
                title: g.title
            })));
        }
        return photos;
    });

    // 4. Get Portfolio Photos
    const photographer = await User.findById(photographerId).select('portfolioPhotos').lean();
    const portfolioPhotos = photographer?.portfolioPhotos?.map((p: any) => ({
        url: p.url,
        title: p.title || 'Portfolyo'
    })) || [];

    // Combine and Shuffle
    let allPhotos = [...portfolioPhotos, ...galleryPhotos];

    // Fallback: If no real photos exist at all, return the 15 demo images
    if (allPhotos.length === 0) {
        allPhotos = Array.from({ length: 15 }, (_, i) => ({
            url: `/demo/images/images/demof (${i + 1}).png`,
            title: 'Demo'
        }));
    } else {
        // Shuffle only if they are real photos
        for (let i = allPhotos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
        }
    }

    // Deep serialize result just in case
    return JSON.parse(JSON.stringify(allPhotos));
};
