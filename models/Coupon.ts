import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountPercentage: number;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    validUntil?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    validUntil: { type: Date }
}, {
    timestamps: true
});

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
