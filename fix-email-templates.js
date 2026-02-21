const mongoose = require('mongoose');

async function fixTemplates() {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@hedefa.67u60.mongodb.net/fotoplan?retryWrites=true&w=majority&appName=hedefa', { serverSelectionTimeoutMS: 15000 });
        console.log('Connected to DB');

        // Get the collection directly to bypass Mongoose schemas for raw updates
        const collection = mongoose.connection.collection('emailtemplates');

        // Find ALL templates
        const templates = await collection.find({}).toArray();
        console.log('Total templates found:', templates.length);

        let updatedCount = 0;
        for (const t of templates) {
            let str = JSON.stringify(t);
            if (str.includes('Kadraj Plan') || str.includes('Kadraj')) {
                console.log('Found legacy branding in template ID:', t._id);

                let newHtml = t.htmlContent;
                if (newHtml) {
                    newHtml = newHtml.replace(/Kadraj\s*Plan/g, 'Weey.NET').replace(/Kadraj\s*Panel/g, 'Weey.NET').replace(/Kadraj/g, 'Weey');
                }

                let newSubject = t.subject;
                if (newSubject) {
                    newSubject = newSubject.replace(/Kadraj\s*Plan/g, 'Weey.NET').replace(/Kadraj\s*Panel/g, 'Weey.NET').replace(/Kadraj/g, 'Weey');
                }

                await collection.updateOne({ _id: t._id }, { $set: { htmlContent: newHtml, subject: newSubject } });
                updatedCount++;
            }
        }

        console.log('Successfully updated ' + updatedCount + ' templates with legacy branding');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from DB');
        process.exit(0);
    }
}

fixTemplates();
