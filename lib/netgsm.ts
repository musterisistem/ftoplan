/**
 * Netgsm SMS Helper Service
 */
const NETGSM_USERCODE = process.env.NETGSM_USERCODE;
const NETGSM_PASSWORD = process.env.NETGSM_PASSWORD;
const NETGSM_HEADER = process.env.NETGSM_HEADER;

export interface SendSMSResult {
    success: boolean;
    error?: string;
    code?: string; // The error or success code returned by Netgsm
}

/**
 * Format phone number to 10 digits (without leading zero or +90) for Netgsm
 */
export function formatNetgsmPhone(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Remove 90 if it starts with 90
    if (cleaned.startsWith('90')) {
        cleaned = cleaned.substring(2);
    }
    
    // Remove 0 if it starts with 0
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }
    
    return cleaned;
}

/**
 * Send standard SMS via Netgsm API
 */
export async function sendSMS(phone: string, message: string): Promise<SendSMSResult> {
    try {
        if (!NETGSM_USERCODE || !NETGSM_PASSWORD || !NETGSM_HEADER) {
            console.error('Netgsm SMS credentials are not fully configured in .env.local');
            return { success: false, error: 'Netgsm configuration missing' };
        }

        const formattedPhone = formatNetgsmPhone(phone);
        
        if (formattedPhone.length !== 10) {
            return { success: false, error: 'Invalid phone number format for Netgsm' };
        }

        const params = new URLSearchParams({
            usercode: NETGSM_USERCODE,
            password: NETGSM_PASSWORD,
            gsmno: formattedPhone,
            message: message,
            msgheader: NETGSM_HEADER,
            filter: '0' // Default filter option
        });

        const url = `https://api.netgsm.com.tr/sms/send/get/?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.text();
        console.log(`[Netgsm SMS] API Response for ${formattedPhone}:`, data);
        const code = data.split(' ')[0];

        // 00 success prefix for 1:N get method (e.g. 00 123456789)
        if (code === '00' || data.includes('00')) {
            return { success: true, code };
        } else {
            return { success: false, error: `Netgsm API Error: ${data}`, code };
        }

    } catch (error: any) {
        console.error('Netgsm SMS Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send OTP SMS via Netgsm OTP API
 * Preferred for verification codes due to faster delivery routes
 */
export async function sendOTP(phone: string, message: string): Promise<SendSMSResult> {
    try {
        if (!NETGSM_USERCODE || !NETGSM_PASSWORD || !NETGSM_HEADER) {
            console.error('Netgsm OTP credentials are not fully configured in .env.local');
            return { success: false, error: 'Netgsm configuration missing' };
        }

        const formattedPhone = formatNetgsmPhone(phone);
        
        if (formattedPhone.length !== 10) {
            return { success: false, error: 'Invalid phone number format for Netgsm OTP' };
        }

        const params = new URLSearchParams({
            usercode: NETGSM_USERCODE,
            password: NETGSM_PASSWORD,
            gsmno: formattedPhone,
            message: message,
            msgheader: NETGSM_HEADER,
        });

        // Use the dedicated OTP endpoint
        const url = `https://api.netgsm.com.tr/sms/send/otp/?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.text();
        console.log(`[Netgsm OTP] API Response for ${formattedPhone}:`, data);
        const code = data.split(' ')[0];

        // 00 success prefix for OTP
        if (code === '00' || data.includes('00')) {
            return { success: true, code };
        } else {
            return { success: false, error: `Netgsm OTP API Error: ${data}`, code };
        }

    } catch (error: any) {
        console.error('Netgsm OTP Error:', error);
        return { success: false, error: error.message };
    }
}
