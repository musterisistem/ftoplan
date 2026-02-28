import mongoose from 'mongoose';

const ContactInfoSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: String, required: true, default: 'bg-[#5d2b72]' },
    order: { type: Number, default: 0 }
});

const SystemSettingSchema = new mongoose.Schema({
    siteName: { type: String, default: 'Weey.NET' },
    siteUrl: { type: String, default: 'https://weey.net' },
    supportEmail: { type: String, default: 'destek@weey.net' },
    defaultQuota: { type: Number, default: 20 },
    trialDays: { type: Number, default: 3 },
    enableRegistration: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    shopierApiKey: { type: String, default: '' },
    shopierApiSecret: { type: String, default: '' },
    contactInfo: [ContactInfoSchema]
}, { timestamps: true });

// Ensure we only have one settings document
SystemSettingSchema.index({ _id: 1 });

const SystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);

export default SystemSetting;
