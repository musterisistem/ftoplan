import mongoose from 'mongoose';

export const EmailTemplateType = {
    VERIFY_EMAIL: 'VERIFY_EMAIL',
    WELCOME_PHOTOGRAPHER: 'WELCOME_PHOTOGRAPHER',
    CUSTOMER_STATUS_UPDATE: 'CUSTOMER_STATUS_UPDATE',
    PLAN_UPDATED: 'PLAN_UPDATED',
} as const;

export type EmailTemplateTypeValue = typeof EmailTemplateType[keyof typeof EmailTemplateType];

const EmailTemplateSchema = new mongoose.Schema({
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Make optional for system-wide templates
        index: true,
    },
    templateType: {
        type: String,
        enum: Object.values(EmailTemplateType),
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    htmlContent: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    variables: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

// Compound unique index: one template per photographer per type (photographerId can be null)
EmailTemplateSchema.index({ photographerId: 1, templateType: 1 }, { unique: true });

export default mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema);
