// Seed Demo Slides for Dashboard
// Run this script to populate demo slides in the database
// Usage: node scripts/seedDemoSlides.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const DashboardSlideSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    link: String,
    isActive: Boolean,
    order: Number,
    createdAt: Date,
    updatedAt: Date
});

const DashboardSlide = mongoose.models.DashboardSlide || mongoose.model('DashboardSlide', DashboardSlideSchema);

const demoSlides = [
    {
        title: 'Yeni Özellikler Keşfedin',
        description: 'Dashboard\'unuzu daha verimli kullanmak için yeni özellikleri inceleyin ve işinizi kolaylaştırın.',
        imageUrl: '/demo-slides/slide1.jpg', // Will be replaced with actual images
        link: '',
        isActive: true,
        order: 0
    },
    {
        title: 'Premium Paketleri İnceleyin',
        description: 'Profesyonel fotoğrafçılık hizmetlerinizi bir üst seviyeye taşıyın. Premium paketlerimizi keşfedin.',
        imageUrl: '/demo-slides/slide2.jpg',
        link: '',
        isActive: true,
        order: 1
    },
    {
        title: 'Müşteri Memnuniyeti #1',
        description: 'Binlerce mutlu müşterimiz var. Siz de onlara katılın ve işinizi büyütün.',
        imageUrl: '/demo-slides/slide3.jpg',
        link: '',
        isActive: true,
        order: 2
    }
];

async function seedSlides() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ MongoDB connected');

        // Check if slides already exist
        const existingSlides = await DashboardSlide.countDocuments();

        if (existingSlides > 0) {
            console.log(`⚠ ${existingSlides} slides already exist. Skipping seed.`);
            console.log('To force reseed, delete existing slides first.');
            process.exit(0);
        }

        // Insert demo slides
        await DashboardSlide.insertMany(demoSlides);
        console.log('✓ Successfully seeded 3 demo slides!');

        const slides = await DashboardSlide.find().sort({ order: 1 });
        console.log('\nCreated slides:');
        slides.forEach(slide => {
            console.log(`  - ${slide.title} (${slide.isActive ? 'Active' : 'Inactive'})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding slides:', error);
        process.exit(1);
    }
}

seedSlides();
