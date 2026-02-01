import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { deleteFromBunny } from '@/lib/bunny';
import { syncStorageUsage } from '@/lib/storage';

export async function GET(req: Request) {
    await dbConnect();

    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find candidate customers
        // 1. Status is 'teslim_edildi'
        // 2. Delivered date is older than 30 days
        // 3. Has photos or selected photos
        const customers = await Customer.find({
            albumStatus: 'teslim_edildi',
            deliveredAt: { $lt: thirtyDaysAgo },
            $or: [
                { photos: { $not: { $size: 0 } } },
                { selectedPhotos: { $not: { $size: 0 } } }
            ]
        }).populate('photographerId'); // Get linked User to check settings

        let processedCount = 0;
        let deletedCount = 0;
        let errorCount = 0;

        for (const customer of customers) {
            const photographer = customer.photographerId as any;

            // Check if photographer exists AND has autoDelete enabled
            if (photographer && photographer.panelSettings?.autoDelete) {
                console.log(`[AutoCleanup] Processing customer ${customer._id} (${customer.brideName}) for photographer ${photographer.studioName}`);
                processedCount++;

                // Collect all unique folder/filename pairs to delete
                // We parse them from URLs because folder names might rely on dynamic data (slugs)
                const itemsToDelete: { filename: string, folder: string }[] = [];
                const urlsProcessed = new Set<string>();

                const processUrl = (url: string) => {
                    if (!url || urlsProcessed.has(url)) return;
                    urlsProcessed.add(url);

                    try {
                        // URL format: https://cdn.hostname.com/folder/filename
                        // or https://cdn.hostname.com/filename (if root)

                        // We need to strip the protocol and hostname
                        // Use URL object
                        const urlObj = new URL(url);
                        const pathParts = urlObj.pathname.split('/').filter(p => p); // Remove empty strings

                        if (pathParts.length > 0) {
                            const filename = pathParts.pop()!; // Last part is filename
                            const folder = pathParts.join('/'); // Remaining is folder path

                            // Decoding is important if URL encoded
                            itemsToDelete.push({
                                filename: decodeURIComponent(filename),
                                folder: decodeURIComponent(folder)
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing URL:', url, e);
                    }
                };

                // Process all photos
                if (customer.photos) customer.photos.forEach((p: any) => processUrl(p.url));
                if (customer.selectedPhotos) customer.selectedPhotos.forEach((p: any) => processUrl(p.url));

                // Delete from BunnyCDN
                for (const item of itemsToDelete) {
                    try {
                        await deleteFromBunny(item.filename, item.folder);
                    } catch (e) {
                        console.error(`Failed to delete ${item.folder}/${item.filename}`, e);
                        errorCount++;
                    }
                }

                // Clear Database Records
                // Use Mongoose .set() or explicit casting to avoid TS array method errors
                customer.set('photos', []);
                customer.set('selectedPhotos', []);
                customer.status = 'archived'; // Optional mark as archived
                await customer.save();

                deletedCount++;
            }
        }

        // Sync storage usage globally to reflect freed space
        if (deletedCount > 0) {
            await syncStorageUsage();
        }

        return NextResponse.json({
            success: true,
            message: `Cleanup job completed. Processed ${processedCount} customers, fully cleared ${deletedCount}.`,
            stats: { processed: processedCount, cleared: deletedCount, errors: errorCount }
        });

    } catch (error: any) {
        console.error('Cleanup Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
