const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        envVars[key.trim()] = value.join('=').trim();
    }
});

const resend = new Resend(envVars.RESEND_API_KEY);

async function testEmail() {
    console.log('Using API Key:', envVars.RESEND_API_KEY ? 'Present' : 'Missing');
    console.log('From Email:', envVars.EMAIL_FROM);

    try {
        const data = await resend.emails.send({
            from: envVars.EMAIL_FROM || 'FotoPlan <onboarding@resend.dev>',
            to: 'armin.mizani@gmail.com', // Change to owner mail for test
            subject: 'FotoPlan - Resend Test Direct',
            html: '<h1>Test Email</h1><p>Resend entegrasyonu test ediliyor. Bu mail direkt node scriptinden gönderildi.</p>'
        });
        console.log('Resend Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test Error:', error);
    }
}

testEmail();
