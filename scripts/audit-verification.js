/**
 * One-time audit script: lock all admin users who have not verified their email.
 * Safe rules:
 *   - isEmailVerified: false  → set isActive: false  (explicitly unverified, LOCK)
 *   - isEmailVerified: true   → ensure isActive: true (verified, UNLOCK if misconfigured)
 *   - isEmailVerified: null/undefined → DO NOT TOUCH (grandfathered old users)
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/fotopanel';

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.\n');

    const db = mongoose.connection.db;
    const col = db.collection('users');

    // 1. Preview what we will change
    const unverified = await col.find({ role: 'admin', isEmailVerified: false }).toArray();
    const verified = await col.find({ role: 'admin', isEmailVerified: true }).toArray();
    const grandfathered = await col.find({ role: 'admin', isEmailVerified: { $exists: false } }).toArray();
    const nullVerified = await col.find({ role: 'admin', isEmailVerified: null }).toArray();

    console.log('=== DURUM RAPORU ===');
    console.log(`Toplam admin kullanıcı: ${unverified.length + verified.length + grandfathered.length + nullVerified.length}`);
    console.log(`Mail doğrulamamış (kilitlenecek): ${unverified.length}`);
    console.log(`Mail doğrulamış (aktif): ${verified.length}`);
    console.log(`Eski kayıt / grandfathered (dokunulmayacak): ${grandfathered.length + nullVerified.length}`);
    console.log('');

    if (unverified.length > 0) {
        console.log('Kilitlenecek kullanıcılar:');
        unverified.forEach(u => console.log(`  ❌ ${u.email} (${u.name || 'Adsız'})`));
    }

    // 2. Lock unverified
    const lockResult = await col.updateMany(
        { role: 'admin', isEmailVerified: false },
        { $set: { isActive: false } }
    );
    console.log(`\n✅ ${lockResult.modifiedCount} kullanıcı kilitlendi (isActive: false)`);

    // 3. Activate verified (fix any inconsistencies)
    const activateResult = await col.updateMany(
        { role: 'admin', isEmailVerified: true, isActive: false },
        { $set: { isActive: true } }
    );
    console.log(`✅ ${activateResult.modifiedCount} doğrulanmış kullanıcı aktifleştirildi (isActive: true)`);

    // 4. Final state
    const finalLocked = await col.countDocuments({ role: 'admin', isActive: false });
    const finalActive = await col.countDocuments({ role: 'admin', isActive: { $ne: false } });
    console.log(`\n=== FINAL DURUM ===`);
    console.log(`Kilitli: ${finalLocked}`);
    console.log(`Aktif:   ${finalActive}`);

    await mongoose.disconnect();
    console.log('\nBağlantı kapatıldı. İşlem tamamlandı.');
}

run().catch(err => {
    console.error('Hata:', err);
    process.exit(1);
});
