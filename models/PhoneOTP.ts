import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoneOTP extends Document {
    phone: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
}

const PhoneOTPSchema = new Schema<IPhoneOTP>({
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        index: { expires: 0 }, // MongoDB TTL: auto-delete when expiresAt is reached
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PhoneOTP || mongoose.model<IPhoneOTP>('PhoneOTP', PhoneOTPSchema);
