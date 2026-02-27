const { MongoClient } = require('mongodb');

// Configuration
const LOCAL_URI = 'mongodb://localhost:27017/fotopanel';
const ATLAS_URI = 'mongodb://fotoplan_admin:3280914Orhan2427--@ac-gxtexq1-shard-00-00.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-01.q7uxf6g.mongodb.net:27017,ac-gxtexq1-shard-00-02.q7uxf6g.mongodb.net:27017/fotopanel?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=FOTOPLAN';

async function migrate() {
    console.log('--- MongoDB Data Migration Started ---');

    let localClient, atlasClient;

    try {
        // Connect to local
        console.log('Connecting to local MongoDB...');
        localClient = await MongoClient.connect(LOCAL_URI);
        const localDb = localClient.db();
        console.log('Connected to local database.');

        // Connect to Atlas
        console.log('Connecting to MongoDB Atlas...');
        atlasClient = await MongoClient.connect(ATLAS_URI);
        const atlasDb = atlasClient.db();
        console.log('Connected to Atlas database.');

        // Get all collections
        const collections = await localDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections locally.`);

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\nMigrating collection: ${collectionName}...`);

            const data = await localDb.collection(collectionName).find({}).toArray();
            console.log(`- Found ${data.length} documents.`);

            if (data.length > 0) {
                // Clear Atlas collection first to avoid duplicates if re-run
                await atlasDb.collection(collectionName).deleteMany({});

                // Insert into Atlas
                const result = await atlasDb.collection(collectionName).insertMany(data);
                console.log(`- Successfully migrated ${result.insertedCount} documents to Atlas.`);
            } else {
                console.log('- Collection is empty, skipping.');
            }
        }

        console.log('\n--- Migration Completed Successfully! ---');
        console.log('All local data has been moved to Atlas.');

    } catch (error) {
        console.error('\n!!! Migration Failed !!!');
        console.error(error);
    } finally {
        if (localClient) await localClient.close();
        if (atlasClient) await atlasClient.close();
    }
}

migrate();
