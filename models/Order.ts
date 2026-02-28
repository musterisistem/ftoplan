import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    orderNo: string; // Unique order tracking number (e.g. SP-123456)
    userId?: Types.ObjectId; // Optional: The user purchasing the plan (if already logged in)
    draftUserData?: any; // To store registration info before account is created
    packageId: Types.ObjectId; // The purchased plan ID
    amount: number; // The exact amount paid
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paytrPaymentId?: string; // ID returned by PayTR upon success
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
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paytrPaymentId: { type: String },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
