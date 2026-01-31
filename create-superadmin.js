const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        envVars[key.trim()] = value.join('=').trim();
    }
});

// User Schema (simplified version matching your model)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    studioName: String,
    slug: String,
    isActive: Boolean,
    isEmailVerified: Boolean,
    packageType: String,
    storageLimit: Number,
    subscriptionExpiry: Date
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createSuperAdmin() {
    try {
        await mongoose.connect(envVars.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Check if superadmin exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

        if (existingSuperAdmin) {
            console.log('\n✓ SuperAdmin already exists!');
            console.log('Email:', existingSuperAdmin.email);
            console.log('\nYou can login with this account at: http://localhost:3000/login');
            mongoose.disconnect();
            return;
        }

        // Create superadmin
        const hashedPassword = await bcrypt.hash('superadmin123', 12);

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@fotoplan.com',
            password: hashedPassword,
            role: 'superadmin',
            studioName: 'FotoPlan HQ',
            slug: 'fotoplan-hq',
            isActive: true,
            isEmailVerified: true,
            packageType: 'unlimited',
            storageLimit: 999999999999,
            subscriptionExpiry: new Date('2099-12-31')
        });

        console.log('\n✓ SuperAdmin created successfully!');
        console.log('\n--- LOGIN CREDENTIALS ---');
        console.log('Email: admin@fotoplan.com');
        console.log('Password: superadmin123');
        console.log('URL: http://localhost:3000/login');
        console.log('-------------------------\n');
        console.log('⚠️  Please change the password after first login!');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

createSuperAdmin();
