import mongoose from 'mongoose';

const ShootPackageSchema = new mongoose.Schema({
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        enum: ['TL', 'USD', 'EUR'],
        default: 'TL'
    },
    features: {
        albumSizes: [{ type: String }],
        albumTypes: [{ type: String }],
        albumPages: { type: Number, default: 0 },
        familyAlbums: { type: Number, default: 0 },
        familyAlbumSize: { type: String, default: '' },
        posterSize: { type: String, default: '' },
        posterCount: { type: Number, default: 0 },
        extras: [{
            name: { type: String },
            price: { type: Number, default: 0 }
        }]
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const ShootPackage = mongoose.models.ShootPackage || mongoose.model('ShootPackage', ShootPackageSchema);
export default ShootPackage;
