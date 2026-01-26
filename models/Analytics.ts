import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    title: {
        type: String, // Page title or identifiers
    },
    visitorId: {
        type: String, // Anonymous ID or User ID
    },
    role: {
        type: String, // 'guest', 'client', 'admin'
        default: 'guest'
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If viewing a specific photographer's site
    },
    photographerId: { // Explicit field for easier querying
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    userAgent: String,
    ip: String, // Optional, hashed or partial for privacy
}, { timestamps: true });

// Delete cached model
if (mongoose.models.Analytics) {
    delete mongoose.models.Analytics;
}

export default mongoose.model('Analytics', AnalyticsSchema);
