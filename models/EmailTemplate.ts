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
        required: true,
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

// Compound unique index: one template per photographer per type
EmailTemplateSchema.index({ photographerId: 1, templateType: 1 }, { unique: true });

// Delete cached model to force fresh schema in development
if (mongoose.models.EmailTemplate) {
    delete mongoose.models.EmailTemplate;
}

export default mongoose.model('EmailTemplate', EmailTemplateSchema);
