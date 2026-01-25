import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Gallery from '@/models/Gallery';
import { cache } from 'react';

export const getPhotographer = cache(async (slug: string) => {
    await dbConnect();
    const photographer = await User.findOne({
        slug: slug.toLowerCase(),
        role: 'admin',
        isActive: true
    }).select('-password').lean();

    if (photographer) {
        // Deep serialize to handle all _id (including in subarrays) and Dates
        return JSON.parse(JSON.stringify(photographer));
    }

    return null;
});

export const getAllStudioPhotos = cache(async (photographerId: string) => {
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
    const allPhotos = [...portfolioPhotos, ...galleryPhotos];

    // Shuffle
    for (let i = allPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPhotos[i], allPhotos[j]] = [allPhotos[j], allPhotos[i]];
    }

    // Deep serialize result just in case
    return JSON.parse(JSON.stringify(allPhotos));
});
