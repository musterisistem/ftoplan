import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['email', 'sms'],
        required: true
    },
    subject: {
        type: String,
        required: function () { return this.type === 'email'; }
    },
    message: {
        type: String,
        required: true
    },
    recipientCount: {
        type: Number,
        required: true
    },
    recipients: [{
        photographerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        email: String,
        phone: String,
        status: {
            type: String,
            enum: ['sent', 'failed', 'pending'],
            default: 'pending'
        }
    }],
    filter: {
        type: String, // 'all', 'trial', 'starter', 'pro', 'premium', 'active', 'inactive'
        default: 'all'
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['sending', 'sent', 'failed', 'partial'],
        default: 'sending'
    }
}, {
    timestamps: true
});

const CommunicationLog = mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', communicationLogSchema);

export default CommunicationLog;
