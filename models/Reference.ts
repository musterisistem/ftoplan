import mongoose from 'mongoose';

const ReferenceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    logoUrl: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Reference = mongoose.models.Reference || mongoose.model('Reference', ReferenceSchema);
export default Reference;
