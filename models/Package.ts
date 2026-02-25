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
