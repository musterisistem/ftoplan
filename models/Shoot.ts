import mongoose from 'mongoose';

const ShootSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: ['wedding', 'engagement', 'saveTheDate', 'personal', 'other'],
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    packageName: {
        type: String,
        default: '',
    },
    contractId: {
        type: String,
        default: '',
    },
    agreedPrice: {
        type: Number,
        default: 0,
    },
    deposit: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['planned', 'completed', 'cancelled'],
        default: 'planned',
    },
}, { timestamps: true });

// Delete cached model to force fresh schema in development
if (mongoose.models.Shoot) {
    delete mongoose.models.Shoot;
}

export default mongoose.model('Shoot', ShootSchema);
