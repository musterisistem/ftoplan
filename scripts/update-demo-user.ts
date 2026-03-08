/**
 * Script: Demo kullanıcı bilgilerini günceller.
 * Çalıştır: npx ts-node scripts/update-demo-user.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const OLD_EMAIL = 'demo@fotoplan.com';
const NEW_EMAIL = 'demo@weey.net';
const NEW_PASSWORD = 'demo1234';

async function run() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB bağlandı.');

    const hashed = await bcrypt.hash(NEW_PASSWORD, 12);

    const result = await User.updateOne(
        { email: { $in: [OLD_EMAIL, NEW_EMAIL] } },
        { $set: { email: NEW_EMAIL, password: hashed } }
    );

    if (result.modifiedCount > 0) {
        console.log(`✅ Demo hesap güncellendi:`);
        console.log(`   E-posta : ${NEW_EMAIL}`);
        console.log(`   Şifre   : ${NEW_PASSWORD}`);
    } else {
        console.log('⚠️  Güncellenecek hesap bulunamadı. Seed çalıştırın.');
    }

    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
