import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    brideName: {
        type: String,
        required: [true, 'Gelin adı gereklidir'],
    },
    groomName: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        required: [true, 'Telefon numarası gereklidir'],
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    tcId: {
        type: String,
        default: '',
    },
    weddingDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active',
    },
    appointmentStatus: {
        type: String,
        enum: ['cekim_yapilmadi', 'cekim_yapildi', 'fotograflar_yuklendi', 'fotograflar_secildi', 'album_bekleniyor', 'teslim_edildi'],
        default: 'cekim_yapilmadi',
    },
    albumStatus: {
        type: String,
        enum: ['islem_yapilmadi', 'tasarim_asamasinda', 'baskida', 'paketlemede', 'kargoda', 'teslimata_hazir', 'teslim_edildi'],
        default: 'islem_yapilmadi',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Optional for backward compatibility with existing customers
    },
    isCorporateMember: {
        type: Boolean,
        default: false,
    },
    corporateMembershipExpiry: {
        type: Date,
        default: null,
    },
    plainPassword: {
        type: String,
        default: null,
    },
    plainUsername: {
        type: String,
        default: null,
    },
    photos: [{
        url: { type: String, required: true },
        filename: { type: String, required: true },
        size: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now }
    }],
    // Photo Selection Logic
    selectionLimits: {
        album: { type: Number, default: 22 },
        cover: { type: Number, default: 1 },
        poster: { type: Number, default: 1 },
    },
    selectedPhotos: [{
        url: { type: String, required: true },
        filename: { type: String },
        type: { type: String, enum: ['album', 'cover', 'poster'], required: true },
    }],
    selectionCompleted: {
        type: Boolean,
        default: false,
    },
    selectionApprovedAt: {
        type: Date,
        default: null,
    },
    // Professional Settings
    canDownload: {
        type: Boolean,
        default: true,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    lastLoginIp: {
        type: String,
        default: '',
    },
    lastLoginPlatform: {
        type: String,
        default: '',
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        default: null,
    },
}, { timestamps: true });

// Delete cached model to force fresh schema in development
if (mongoose.models.Customer) {
    delete mongoose.models.Customer;
}

export default mongoose.model('Customer', CustomerSchema);
