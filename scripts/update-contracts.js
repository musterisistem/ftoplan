// Script to deactivate unwanted contracts
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContractSchema = new mongoose.Schema({
    name: String,
    type: String,
    content: String,
    isActive: Boolean,
    version: Number,
}, { timestamps: true });

const Contract = mongoose.models.Contract || mongoose.model('Contract', ContractSchema);

async function updateContracts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all contracts
        const allContracts = await Contract.find({});
        console.log('\nAll contracts:');
        allContracts.forEach((c, i) => {
            console.log(`${i + 1}. ${c.name} - Active: ${c.isActive}`);
        });

        // Deactivate contracts 3, 4, 5
        const toDeactivate = [
            'Düğün Hikayesi Sözleşmesi',
            'Video Çekim Sözleşmesi v2',
            'Dış Çekim Sözleşmesi (Standart)'
        ];

        for (const name of toDeactivate) {
            const result = await Contract.updateMany(
                { name: name },
                { $set: { isActive: false } }
            );
            console.log(`\nDeactivated "${name}" - ${result.modifiedCount} document(s)`);
        }

        // Ensure contracts 1, 2 are active
        const toActivate = [
            'Dış Çekim Sözleşmesi',
            'Video Çekim Sözleşmesi'
        ];

        for (const name of toActivate) {
            const result = await Contract.updateMany(
                { name: name },
                { $set: { isActive: true } }
            );
            console.log(`Activated "${name}" - ${result.modifiedCount} document(s)`);
        }

        console.log('\n✅ Contracts updated successfully!');

        // Show final state
        const finalContracts = await Contract.find({});
        console.log('\nFinal state:');
        finalContracts.forEach((c, i) => {
            console.log(`${i + 1}. ${c.name} - Active: ${c.isActive}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateContracts();
