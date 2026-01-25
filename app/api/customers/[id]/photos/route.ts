import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import User from '@/models/User';
import { deleteFromBunny } from '@/lib/bunny';

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    console.log('[DELETE PHOTOS] Request received');
    try {
        const { id: customerId } = await context.params;
        const body = await req.json();
        const { photos } = body;

        console.log('[DELETE PHOTOS] Customer ID:', customerId);
        console.log('[DELETE PHOTOS] Photos to delete:', photos);

        if (!customerId || !photos || !Array.isArray(photos)) {
            console.error('[DELETE PHOTOS] Invalid request');
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();
        console.log('[DELETE PHOTOS] DB connected');

        const customer = await Customer.findById(customerId);
        if (!customer) {
            console.error('[DELETE PHOTOS] Customer not found');
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        console.log('[DELETE PHOTOS] Customer found:', customer.brideName);

        // Find Admin to update quota
        const adminUser = await User.findOne({ role: 'admin' });
        console.log('[DELETE PHOTOS] Admin user:', adminUser?._id);

        // Generate folder name (same logic as upload)
        const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const folderName = `${slugify(customer.brideName)}-${slugify(customer.groomName || '')}`;
        console.log('[DELETE PHOTOS] Folder name:', folderName);

        let deletedCount = 0;
        let freedSpace = 0;

        for (const photoToDelete of photos) {
            const { filename, size } = photoToDelete;

            console.log(`[DELETE PHOTOS] Deleting ${filename} from CDN...`);
            // Delete from BunnyCDN
            const isDeleted = await deleteFromBunny(filename, folderName);

            if (isDeleted) {
                console.log(`[DELETE PHOTOS] ${filename} deleted from CDN`);
            } else {
                console.error(`[DELETE PHOTOS] Failed to delete ${filename} from BunnyCDN`);
            }

            deletedCount++;
            freedSpace += (size || 0);
        }

        // Batch remove from DB
        const filenamesToDelete = photos.map((p: any) => p.filename);
        console.log('[DELETE PHOTOS] Removing from DB:', filenamesToDelete);

        await Customer.updateOne(
            { _id: customerId },
            { $pull: { photos: { filename: { $in: filenamesToDelete } } } }
        );

        console.log('[DELETE PHOTOS] Removed from DB');

        // Update Quota
        // Update Quota with REAL calculation
        // Instead of decrementing, we recalculate to ensure accuracy
        console.log('[DELETE PHOTOS] Syncing storage quota...');
        await import('@/lib/storage').then(mod => mod.syncStorageUsage());
        console.log('[DELETE PHOTOS] Storage quota synced.');

        console.log('[DELETE PHOTOS] Success!', { deletedCount, freedSpace });
        return NextResponse.json({ success: true, deletedCount, freedSpace });

    } catch (error: any) {
        console.error('[DELETE PHOTOS] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

