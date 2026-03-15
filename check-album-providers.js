const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const AlbumProviderSchema = new mongoose.Schema({
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscriber',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Tedarikçi adı gereklidir'],
    },
    covers: [{
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        publicId: { type: String }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    studioName: String,
    role: String
});

async function checkAlbumProviders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı\n');

        const AlbumProvider = mongoose.models.AlbumProvider || mongoose.model('AlbumProvider', AlbumProviderSchema);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // 1. Kullanıcıyı bul
        const user = await User.findOne({ email: 'diyareme@gmail.com' });
        
        if (!user) {
            console.log('❌ diyareme@gmail.com kullanıcısı bulunamadı!');
            return;
        }

        console.log('👤 Kullanıcı Bilgileri:');
        console.log('   ID:', user._id.toString());
        console.log('   Email:', user.email);
        console.log('   İsim:', user.name);
        console.log('   Stüdyo:', user.studioName);
        console.log('   Rol:', user.role);
        console.log('');

        // 2. Bu kullanıcının albüm tedarikçilerini bul
        const providers = await AlbumProvider.find({ photographerId: user._id });

        console.log(`📦 Toplam ${providers.length} tedarikçi bulundu:\n`);

        if (providers.length === 0) {
            console.log('❌ Hiç tedarikçi kaydı yok!');
        } else {
            providers.forEach((provider, index) => {
                console.log(`${index + 1}. Tedarikçi:`);
                console.log('   ID:', provider._id.toString());
                console.log('   İsim:', provider.name);
                console.log('   Aktif:', provider.isActive);
                console.log('   Kapak Sayısı:', provider.covers?.length || 0);
                
                if (provider.covers && provider.covers.length > 0) {
                    console.log('   Kapaklar:');
                    provider.covers.forEach((cover, i) => {
                        console.log(`     ${i + 1}. ${cover.name}`);
                        console.log(`        URL: ${cover.imageUrl}`);
                        console.log(`        Yükleme: ${cover.uploadedAt}`);
                    });
                } else {
                    console.log('   ⚠️  Kapak modeli yok!');
                }
                console.log('');
            });
        }

        // 3. Tüm albüm tedarikçilerini kontrol et
        const allProviders = await AlbumProvider.find({});
        console.log(`\n📊 Sistemdeki toplam tedarikçi sayısı: ${allProviders.length}`);

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Bağlantı kapatıldı');
    }
}

checkAlbumProviders();
