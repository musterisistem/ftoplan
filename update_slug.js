const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://fotoplan_admin:3280914Orhan2427--@ac-gxtexq1-shard-00-00.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-01.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-02.q7uxf6g.mongodb.net:27017/fotopanel?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=FOTOPLAN";

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    const result = await User.updateOne(
        { email: 'demo@fotoplan.com' },
        { $set: { slug: '0111' } }
    );
    console.log('Updated demo user slug to 0111:', result.modifiedCount === 1 ? 'SUCCESS' : 'No change');
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
