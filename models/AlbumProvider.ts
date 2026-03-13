import mongoose from 'mongoose';

const AlbumProviderSchema = new mongoose.Schema({
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscriber',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Tedarikçi adı gereklidir'],
    },
    covers: [{
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        publicId: { type: String } // Optional: For S3 / Cloudinary deletion if needed
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const AlbumProvider = mongoose.models.AlbumProvider || mongoose.model('AlbumProvider', AlbumProviderSchema);
export default AlbumProvider;
