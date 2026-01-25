import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { listBunnyFiles } from '@/lib/bunny';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id: customerId } = params;

        await dbConnect();

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        // Generate folder name
        const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
        const folderName = `${slugify(customer.brideName)}-${slugify(customer.groomName || '')}`;
        const cdnHostname = process.env.BUNNY_CDN_HOSTNAME?.replace(/\/$/, '');

        // Fetch files from BunnyCDN
        const cdnFiles = await listBunnyFiles(folderName);

        // Map CDN files to our photo structure
        const syncedPhotos = cdnFiles
            .filter(f => !f.IsDirectory)
            .map(f => ({
                url: `https://${cdnHostname}/${folderName}/${f.ObjectName}`,
                filename: f.ObjectName,
                size: f.Length,
                uploadedAt: f.DateCreated
            }));

        // Update Customer with latest photos from CDN (Source of Truth)
        // This ensures DB is always in sync with actual storage
        await Customer.updateOne(
            { _id: customerId },
            { $set: { photos: syncedPhotos } }
        );

        return NextResponse.json({
            success: true,
            photos: syncedPhotos,
            count: syncedPhotos.length
        });

    } catch (error: any) {
        console.error('Sync photos error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
