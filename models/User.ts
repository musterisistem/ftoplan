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
    intendedAction: {
        type: String,
        enum: ['trial', 'purchase'],
        default: 'trial',
    },
    packageType: {
        type: String,
        enum: ['trial', 'standart', 'kurumsal'],
        default: 'trial',
    },
    subscriptionExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    isActive: {
        type: Boolean,
        default: false, // Default to inactive until verified
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
    isBlocked: {
        type: Boolean,
        default: false,
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
    address: {
        type: String,
        default: '',
    },
    // Billing Information
    billingInfo: {
        companyType: {
            type: String,
            enum: ['individual', 'corporate'],
            default: 'individual'
        },
        address: { type: String, default: '' },
        taxOffice: { type: String, default: '' },
        taxNumber: { type: String, default: '' },
        identityNumber: { type: String, default: '' }, // TCKN for individuals
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
    // New Logo Fields
    panelLogo: { type: String, default: '' }, // For Admin Panel Sidebar
    siteLogoLight: { type: String, default: '' }, // For Light Theme Component (Dark Logo)
    siteLogoDark: { type: String, default: '' }, // For Dark Theme Component (Light Logo)

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
    heroTitle: {
        type: String,
        default: 'Catch Your Life Moment',
    },
    heroSubtitle: {
        type: String,
        default: 'Photography & Cinema',
    },
    selectionSuccessMessage: {
        type: String,
        default: 'Albüm siparişiniz alınmıştır. Albüm Teslim süresi seçimlerinizden 15 iş günüdür. Ekiplerimiz sizi arayarak bilgilendirecektir.',
    },
    // Panel Configuration
    panelSettings: {
        defaultView: { type: String, default: 'month' },
        autoDelete: { type: Boolean, default: false },
        appointmentStatuses: [{ id: String, label: String, color: String }],
        albumStatuses: [{ id: String, label: String, color: String }],
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
    hasCompletedOnboarding: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Delete cached model to force fresh schema in development
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
