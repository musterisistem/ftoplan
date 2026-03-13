import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    orderNo: string; // Unique order tracking number (e.g. SP-123456)
    userId?: Types.ObjectId; // Optional: The user purchasing the plan (if already logged in)
    draftUserData?: any; // To store registration info before account is created
    packageId: Types.ObjectId; // The purchased plan ID
    amount: number; // The exact amount paid
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded' | 'awaiting_transfer';
    paymentMethod?: 'credit_card' | 'bank_transfer';
    paytrPaymentId?: string; // ID returned by PayTR upon success
    autoLoginToken?: string; // Token to allow passwordless login upon successful callback
    appliedCoupon?: string;  // The coupon code applied to this order
    bankName?: string;       // For bank transfers
    bankIban?: string;       // For bank transfers
    createdAt: Date;
    completedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        orderNo: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
        draftUserData: { type: Schema.Types.Mixed, required: false }, // Mixed schema for arbitrary JSON data
        packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'TRY' },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded', 'awaiting_transfer'],
            default: 'pending',
        },
        paymentMethod: { type: String, enum: ['credit_card', 'bank_transfer'], default: 'credit_card' },
        paytrPaymentId: { type: String },
        autoLoginToken: { type: String },
        appliedCoupon: { type: String, required: false },
        bankName: { type: String, required: false },
        bankIban: { type: String, required: false },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
