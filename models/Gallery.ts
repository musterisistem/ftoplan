import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    shootId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoot',
    },
    title: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String, // BunnyCDN URL
    },
    photos: [{
        url: String, // BunnyCDN URL
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
