import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // e.g. 'standart', 'kurumsal'
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    storage: {
        type: Number, // In GB
        required: true,
        default: 20
    },
    maxCustomers: {
        type: Number,
        default: -1 // -1 for unlimited
    },
    maxPhotos: {
        type: Number,
        default: -1
    },
    maxAppointments: {
        type: Number,
        default: -1
    },
    hasWatermark: {
        type: Boolean,
        default: false
    },
    hasWebsite: {
        type: Boolean,
        default: false
    },
    supportType: {
        type: String,
        default: 'E-posta' // or '7/24 Öncelikli'
    },
    description: {
        type: String,
        default: ''
    },
    features: [{
        type: String
    }],
    popular: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
export default Package;
