import mongoose from 'mongoose';

// Export notification types as constants
export const NotificationType = {
    PHOTO_SELECTION: 'PHOTO_SELECTION',
    NEW_APPOINTMENT: 'NEW_APPOINTMENT',
    UPCOMING_SHOOT: 'UPCOMING_SHOOT',
} as const;

export type NotificationTypeValue = typeof NotificationType[keyof typeof NotificationType];

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // For efficient querying by photographer
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null,
    },
    relatedId: {
        type: String, // Could be shootId, customerId, etc.
        default: null,
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true, // For efficient querying of unread notifications
    },
}, { timestamps: true });

// Compound index for efficient querying of user's unread notifications
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Delete cached model to force fresh schema in development
if (mongoose.models.Notification) {
    delete mongoose.models.Notification;
}

export default mongoose.model('Notification', NotificationSchema);
