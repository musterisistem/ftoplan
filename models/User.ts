import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email adresi gereklidir'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Şifre gereklidir'],
    },
    name: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'couple'], // superadmin = system owner, admin = photographer, couple = customer
        default: 'admin',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null,
    },
    // Storage Quota
    storageUsage: {
        type: Number,
        default: 0,
    },
    storageLimit: {
        type: Number,
        default: 21474836480, // 20GB in bytes
    },
    // Subscription Management
    packageType: {
        type: String,
        enum: ['starter', 'pro', 'premium'],
        default: 'starter',
    },
    subscriptionExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    // Studio Info (for photographers)
    studioName: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    // Studio Website Settings (Subdomain)
    slug: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
        lowercase: true,
        trim: true,
    },
    logo: {
        type: String,
        default: '',
    },
    bannerImage: {
        type: String,
        default: '',
    },
    primaryColor: {
        type: String,
        default: '#ec4899', // Pink default
    },
    siteTheme: {
        type: String,
        enum: ['warm', 'playful', 'bold'],
        default: 'warm',
    },
    aboutText: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    facebook: {
        type: String,
        default: '',
    },
    whatsapp: {
        type: String,
        default: '',
    },
    portfolioPhotos: [{
        url: { type: String },
        title: { type: String },
    }],
}, { timestamps: true });

// Delete cached model to force fresh schema in development
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
