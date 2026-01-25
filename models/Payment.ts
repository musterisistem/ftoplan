import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    contractTotal: {
        type: Number,
        required: true,
    },
    payments: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['kapora', 'nakit', 'havale', 'kredi kartı'], default: 'nakit' },
        description: String
    }],
    extras: [{
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        isDebit: { type: Boolean, default: true }, // true = add to total, false = discount
        date: { type: Date, default: Date.now },
        description: String
    }],
    // Balance is calculated on the fly, but we can store it if needed
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
