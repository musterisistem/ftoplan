const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://fotoplan_admin:3280914Orhan2427--@ac-gxtexq1-shard-00-00.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-01.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-02.q7uxf6g.mongodb.net:27017/fotopanel?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=FOTOPLAN";

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const customerSchema = new mongoose.Schema({}, { strict: false });
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

const gallerySchema = new mongoose.Schema({}, { strict: false });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

// Local demo wedding images from /public/demo/images/images/
const weddingPhotos = [
    { url: '/demo/images/images/demof (1).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (2).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (3).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (4).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (5).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (6).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (7).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (8).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (9).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (10).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (11).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (12).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (13).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (14).png', title: 'Düğün' },
    { url: '/demo/images/images/demof (15).png', title: 'Düğün' },
];

async function addGalleryPhotos() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // 1. Find demo user
    const demoUser = await User.findOne({ email: 'demo@fotoplan.com' });
    if (!demoUser) {
        console.error('Demo user not found! Please run seed.js first.');
        process.exit(1);
    }

    // 2. Add portfolioPhotos to the demo user (shows in gallery + homepage)
    const portfolioEntries = weddingPhotos.map((p, i) => ({
        url: p.url,
        title: p.title,
        filename: `demo-photo-${i + 1}.jpg`,
        uploadedAt: new Date()
    }));

    await User.updateOne(
        { _id: demoUser._id },
        { $set: { portfolioPhotos: portfolioEntries } }
    );
    console.log(`Added ${portfolioEntries.length} portfolio photos to demo user.`);

    // 3. Get all the existing galleries linked to demo user's customers
    const customers = await Customer.find({ photographerId: demoUser._id }, '_id');
    const customerIds = customers.map(c => c._id);

    const galleries = await Gallery.find({ customerId: { $in: customerIds } });

    if (galleries.length > 0) {
        for (const gallery of galleries) {
            // Pick a random subset (6-12 photos) for each gallery
            const shuffled = [...weddingPhotos].sort(() => Math.random() - 0.5);
            const count = 6 + Math.floor(Math.random() * 7); // 6-12
            const pickedPhotos = shuffled.slice(0, count).map((p, i) => ({
                url: p.url,
                filename: `cekim-${i + 1}.jpg`,
                uploadedAt: new Date()
            }));

            await Gallery.updateOne(
                { _id: gallery._id },
                {
                    $set: {
                        photos: pickedPhotos,
                        coverImage: pickedPhotos[0].url
                    }
                }
            );
        }
        console.log(`Updated ${galleries.length} existing galleries with demo photos.`);
    } else {
        // Create a couple of standalone galleries if none exist yet
        for (let i = 0; i < 3; i++) {
            const customerId = customerIds[i % customerIds.length];
            const shuffled = [...weddingPhotos].sort(() => Math.random() - 0.5).slice(0, 8);
            await Gallery.create({
                customerId,
                title: ['Düğün Serisi', 'Nişan Anıları', 'Dış Çekim'][i],
                coverImage: shuffled[0].url,
                photos: shuffled.map((p, j) => ({ url: p.url, filename: `photo-${j}.jpg`, uploadedAt: new Date() }))
            });
        }
        console.log('Created 3 new galleries with demo photos.');
    }

    console.log('=================================');
    console.log('Gallery photos added successfully!');
    console.log('Visit: http://localhost:3001/studio/demo-studyo/gallery');
    console.log('=================================');
    process.exit(0);
}

addGalleryPhotos().catch(err => {
    console.error(err);
    process.exit(1);
});
