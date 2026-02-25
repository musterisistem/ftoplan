import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
    },
    studioName: {
        type: String,
        default: '',
    },
    packageType: {
        type: String,
        enum: ['trial', 'standart', 'kurumsal'],
        default: 'trial',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
export default Subscriber;
