
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function fixUser() {
    try {
        const uri = 'mongodb://localhost:27017/fotopanel';
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");

        const email = 'ahiskamedya38@gmail.com';
        const result = await User.updateOne(
            { email: email },
            { $set: { isEmailVerified: true } }
        );

        if (result.modifiedCount > 0) {
            console.log(`Successfully verified email for user ${email}.`);
        } else {
            console.log(`User found but no changes made (maybe already verified?). Matched: ${result.matchedCount}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

fixUser();
