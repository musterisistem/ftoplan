import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Gallery from '@/models/Gallery';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();

        // 1. Get or Create Photographer
        let user = await User.findOne({ slug: 'aha' });

        // If user doesn't exist, this part assumes it might be created elsewhere or error out, 
        // but let's assume user 'aha' exists from previous step. If not, error.
        if (!user) {
            return NextResponse.json({ error: 'User "aha" not found. Run previous seed or create user first.' }, { status: 404 });
        }

        // 2. Create Dummy Customer
        // Clear previous test customer to avoid duplicates if re-run
        await Customer.deleteMany({ email: 'testcouple@example.com' });

        const customer = await Customer.create({
            brideName: 'Zeynep',
            groomName: 'Emre',
            phone: '5551234567',
            email: 'testcouple@example.com',
            userId: user._id, // Linking to photographer
            photographerId: user._id, // Double link for safety
            weddingDate: new Date(),
            photos: []
        });

        // 3. Create Dummy Gallery
        // High quality images
        const photos = [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520854221250-858f2769490c?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1623862274955-520e104e1ba1?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80',
            // Accessorize with more
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
        ];

        // Create gallery objects
        const galleryPhotos = photos.map(url => ({
            url,
            filename: 'seed-photo.jpg',
            uploadedAt: new Date()
        }));

        await Gallery.create({
            customerId: customer._id,
            title: 'Örnek Düğün Albümü',
            coverImage: photos[0],
            photos: galleryPhotos
        });

        // Add a second gallery for volume
        await Gallery.create({
            customerId: customer._id,
            title: 'Dış Çekim - Kapadokya',
            coverImage: photos[6],
            photos: galleryPhotos.slice(5).concat(galleryPhotos.slice(0, 5)) // Shuffle slightly
        });

        return NextResponse.json({
            success: true,
            message: 'Seeded Customer and 2 Galleries for user aha',
            customer: customer._id
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
