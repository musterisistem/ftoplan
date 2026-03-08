import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();
dotenv.config({ path: '.env.local' });

// We define minimal schemas here to avoid import issues if running directly with ts-node
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const subscriberSchema = new mongoose.Schema({}, { strict: false });
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

const customerSchema = new mongoose.Schema({}, { strict: false });
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

const shootSchema = new mongoose.Schema({}, { strict: false });
const Shoot = mongoose.models.Shoot || mongoose.model('Shoot', shootSchema);

const gallerySchema = new mongoose.Schema({}, { strict: false });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

const DEMO_EMAIL = 'demo@weey.net';
const DEMO_PASSWORD = 'demo1234';
const DEMO_SLUG = 'demo-studyo';

const names = [
    'Ahmet & Ayşe', 'Mehmet & Fatma', 'Ali & Zeynep', 'Mustafa & Elif', 'Hasan & Merve',
    'İbrahim & Büşra', 'Hüseyin & Kübra', 'Osman & Esra', 'Halil & Hatice', 'Emre & Özlem',
    'Burak & Seda', 'Serkan & Pınar', 'Gökhan & Tuğba', 'Volkan & Aslı', 'Yasin & Gizem',
    'Cem & Cansu', 'Can & Sinem', 'Onur & Eda', 'Umut & Derya', 'Ozan & Burcu'
];

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB.');

    // 1. Clear existing demo data
    const existingDemoUser = await User.findOne({ email: DEMO_EMAIL });
    if (existingDemoUser) {
        console.log('Cleaning up existing demo data...');
        await Customer.deleteMany({ photographerId: existingDemoUser._id });
        await Shoot.deleteMany({ photographerId: existingDemoUser._id });
        await Gallery.deleteMany({ photographerId: existingDemoUser._id }); // though Gallery schema uses customerId mostly, but let's clear them later
        await User.deleteOne({ _id: existingDemoUser._id });
        await Subscriber.deleteOne({ email: DEMO_EMAIL });
    }

    // Clean up galleries slightly differently as they don't have photographerId directly, 
    // but the customers are deleted, so we can ignore orphans for a demo script or leave them.

    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
    const now = new Date();

    const demoUser = await User.create({
        email: DEMO_EMAIL,
        password: hashedPassword,
        name: 'Demo Fotoğrafçı',
        studioName: 'Demo Stüdyo',
        slug: DEMO_SLUG,
        role: 'admin',
        packageType: 'standart',
        isActive: true,
        isEmailVerified: true,
        subscriptionExpiry: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        storageUsage: 1542880000, // 1.5GB
        storageLimit: 10737418240, // 10GB
        maxCustomers: -1,
        maxPhotos: -1,
        maxAppointments: -1,
        hasWatermark: false,
        hasWebsite: true,
        supportType: 'E-posta',
        phone: '05555555555',
        primaryColor: '#8b5cf6', // Violet
        siteTheme: 'warm',
        hasCompletedOnboarding: true,
        legalConsents: {
            privacyPolicyConfirmed: true,
            termsOfUseConfirmed: true,
            distanceSalesAgreementConfirmed: true,
            kvkkConfirmed: true,
            confirmedAt: now,
            ipAddress: '127.0.0.1'
        }
    });

    await Subscriber.create({
        email: DEMO_EMAIL,
        name: 'Demo Fotoğrafçı',
        studioName: 'Demo Stüdyo',
        packageType: 'standart',
        isActive: true,
        registeredAt: now,
        legalConsents: demoUser.legalConsents
    });

    console.log('Generating 20 customers and shoots...');

    // Distribute shoots across March and April 2026
    // March has 31 days, April has 30 days. Let's pick random days.

    const shoots = [];
    const _galleries = [];

    for (let i = 0; i < 20; i++) {
        // Random date in March or April 2026
        const isMarch = Math.random() > 0.5;
        const month = isMarch ? 2 : 3; // 0-indexed, so 2 is March, 3 is April
        const day = Math.floor(Math.random() * (isMarch ? 31 : 30)) + 1;
        const shootDate = new Date(2026, month, day, 10 + Math.floor(Math.random() * 8), 0, 0); // between 10 AM and 5 PM

        // Randomly assign some statuses
        const isCompleted = shootDate < new Date(); // If it happens to be in the past (even though it's 2026, just randomizing logic)
        // Let's force some completed and some planned
        const r = Math.random();
        let apptStatus = 'cekim_yapilmadi';
        let albumStatus = 'islem_yapilmadi';
        let selectionCompleted = false;

        if (r > 0.7) {
            apptStatus = 'fotograflar_secildi';
            albumStatus = 'tasarim_asamasinda';
            selectionCompleted = true;
        } else if (r > 0.4) {
            apptStatus = 'fotograflar_yuklendi';
            albumStatus = 'islem_yapilmadi';
        } else if (r > 0.2) {
            apptStatus = 'cekim_yapildi';
        }

        const brideName = names[i].split('&')[0].trim();
        const groomName = names[i].split('&')[1].trim();

        const customerResult = await Customer.create({
            brideName,
            groomName,
            phone: `05${Math.floor(Math.random() * 900000000 + 100000000)}`,
            email: `customer${i}@example.com`,
            weddingDate: shootDate,
            appointmentStatus: apptStatus,
            albumStatus: albumStatus,
            photographerId: demoUser._id,
            selectionCompleted,
            plainPassword: `pass${i}`,
            plainUsername: `user${i}`,
            selectionLimits: {
                album: 20,
                cover: 1,
                poster: 1
            },
            status: 'active'
        });

        const shootResult = await Shoot.create({
            customerId: customerResult._id,
            photographerId: demoUser._id,
            date: shootDate,
            time: `${shootDate.getHours().toString().padStart(2, '0')}:00`,
            type: 'wedding',
            location: 'Doğa Çekimi',
            city: 'İstanbul',
            packageName: 'Standart Paket',
            agreedPrice: 15000 + Math.floor(Math.random() * 10000),
            deposit: 5000,
            status: apptStatus === 'cekim_yapilmadi' ? 'planned' : 'completed'
        });

        // Populate selection photos for a few
        if (selectionCompleted) {
            await Customer.updateOne(
                { _id: customerResult._id },
                {
                    $push: {
                        selectedPhotos: [
                            { url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80', type: 'album' },
                            { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', type: 'album' },
                            { url: 'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80', type: 'cover' },
                            { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80', type: 'poster' },
                        ]
                    }
                }
            );

            await Gallery.create({
                customerId: customerResult._id,
                shootId: shootResult._id,
                title: 'Düğün Fotoğrafları',
                photos: [
                    { url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80' },
                    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80' },
                    { url: 'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80' },
                    { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80' }
                ]
            });
        }
    }

    console.log('=================================');
    console.log('Seed completed successfully!');
    console.log(`Email: ${DEMO_EMAIL}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
    console.log(`Client URL: /studio/${DEMO_SLUG}`);
    console.log('=================================');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
