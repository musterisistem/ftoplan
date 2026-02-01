
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkUser() {
    try {
        const uri = 'mongodb://localhost:27017/fotopanel';
        await mongoose.connect(uri);
        console.log("Connected to MongoDB.");

        const email = 'ahiskamedya38@gmail.com';
        const user = await User.findOne({ email: email });

        if (user) {
            console.log("User found:");
            console.log(`ID: ${user._id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Is Email Verified: ${user.isEmailVerified}`);
            // Only show first few chars of hash for security/verification
            console.log(`Password Hash: ${user.password ? user.password.substring(0, 10) + '...' : 'NONE'}`);
        } else {
            console.log(`User with email ${email} NOT found.`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

checkUser();
