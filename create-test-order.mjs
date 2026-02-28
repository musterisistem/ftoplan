// Script: Shopier OSB testi için MongoDB'de beklemede olan (pending) bir sipariş oluşturur.
// Calistirmak icin: node create-test-order.mjs

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://fotoplan_admin:3280914Orhan2427--@ac-gxtexq1-shard-00-00.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-01.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-02.q7uxf6g.mongodb.net:27017/fotopanel?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=FOTOPLAN';

const client = new MongoClient(MONGODB_URI);

async function main() {
    await client.connect();
    console.log('MongoDB Atlas bağlandı...');

    const db = client.db('fotopanel');
    const packages = await db.collection('packages').find({}).toArray();
    const pkg = packages.find(p => p.id === 'standart') || packages[0];

    if (!pkg) {
        console.error('Hiç paket bulunamadı!');
        await client.close();
        return;
    }

    const orderNo = `FP-TEST-${Date.now()}`;

    const testOrder = {
        orderNo: orderNo,
        packageId: pkg._id,
        amount: pkg.price,
        currency: 'TRY',
        status: 'pending',
        draftUserData: {
            name: 'Test Kullanıcı',
            studioName: 'Test Stüdyo',
            slug: 'test-studyo',
            email: 'test@weey.net',
            hashedPassword: 'dummy',
            phone: '5555555555',
            address: 'Test Adres',
            billingInfo: {
                companyType: 'individual',
                address: 'Test Adres',
                taxOffice: '',
                taxNumber: '',
                identityNumber: '11111111111',
            }
        },
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await db.collection('orders').insertOne(testOrder);

    console.log('\n✅ Test Siparişi Oluşturuldu!');
    console.log('---------------------------');
    console.log('Sipariş No (Shopier Test kısmına yazınız):', orderNo);
    console.log('---------------------------');
    console.log('Bu numarayı Shopier -> Otomatik Sipariş Bildirimi -> Bildirim Testi kısmındaki "platform_order_id" alanına yazıp TEST butonuna basınız.');

    await client.close();
}

main().catch(console.error);
