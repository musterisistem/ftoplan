/**
 * Netgsm SMS Test Script
 * Run with: node test-netgsm.js
 */

const NETGSM_USERCODE = '2243341494';
const NETGSM_PASSWORD = 'Hoppalasi1365--';
const NETGSM_HEADER = 'OILIMDAROGL';

// Test phone - change this to your own number
const TEST_PHONE = '05384103717'; // The phone from the screenshot

function formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('90')) cleaned = cleaned.substring(2);
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    console.log(`Formatted phone: ${cleaned} (length: ${cleaned.length})`);
    return cleaned;
}

async function testSMS() {
    console.log('\n=== Testing Netgsm Standard SMS ===');
    const formattedPhone = formatPhone(TEST_PHONE);
    const message = `WeeyNet test mesaji: 123456 kodunuz.`;
    
    const params = new URLSearchParams({
        usercode: NETGSM_USERCODE,
        password: NETGSM_PASSWORD,
        gsmno: formattedPhone,
        message: message,
        msgheader: NETGSM_HEADER,
        filter: '0'
    });

    const url = `https://api.netgsm.com.tr/sms/send/get/?${params.toString()}`;
    console.log('SMS URL:', url.replace(NETGSM_PASSWORD, '***'));
    
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log('SMS Response:', data);
        console.log('Status:', response.status);
    } catch (err) {
        console.error('SMS Error:', err.message);
    }
}

async function testOTP() {
    console.log('\n=== Testing Netgsm OTP SMS ===');
    const formattedPhone = formatPhone(TEST_PHONE);
    const message = `WeeyNet OTP test: 123456 kodunuz.`;
    
    const params = new URLSearchParams({
        usercode: NETGSM_USERCODE,
        password: NETGSM_PASSWORD,
        gsmno: formattedPhone,
        message: message,
        msgheader: NETGSM_HEADER,
    });

    const url = `https://api.netgsm.com.tr/sms/send/otp/?${params.toString()}`;
    console.log('OTP URL:', url.replace(NETGSM_PASSWORD, '***'));
    
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log('OTP Response:', data);
        console.log('Status:', response.status);
    } catch (err) {
        console.error('OTP Error:', err.message);
    }
}

// Run tests
(async () => {
    await testSMS();
    await testOTP();
})();
