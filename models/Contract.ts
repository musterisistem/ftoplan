import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sözleşme adı gereklidir'],
    },
    type: {
        type: String, // 'outdoor', 'video', 'custom'
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    version: {
        type: Number,
        default: 1,
    }
}, { timestamps: true });

export default mongoose.models.Contract || mongoose.model('Contract', ContractSchema);
