import mongoose from 'mongoose';

const DashboardSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
DashboardSlideSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const DashboardSlide = mongoose.models.DashboardSlide || mongoose.model('DashboardSlide', DashboardSlideSchema);

export default DashboardSlide;
