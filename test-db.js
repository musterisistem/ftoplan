const mongoose = require('mongoose');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://kemalsevinc1993:4s9kM1fItJ8q4x1p@cluster0.oou38.mongodb.net/fotoplan?retryWrites=true&w=majority");
    const User = require('./models/User').default;

    try {
        const users = await User.find(
            {},
            { slug: 1, isActive: 1, isEmailVerified: 1, role: 1 }
        ).lean();
        console.log('All users in DB:', users);
    } catch (e) {
        console.log('Error:', e);
    }
    process.exit();
}
check();
