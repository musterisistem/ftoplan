import crypto from 'crypto';

export interface PayTROptions {
    merchantId: string;
    merchantKey: string;
    merchantSalt: string;
    testMode?: boolean;
}

export interface PayTROrderData {
    orderNo: string;           // Sistemimizdeki sipariş numarası
    amount: number;            // Küsüratlı tutar, örn: 52.50
    userEmail: string;
    userName: string;
    userAddress: string;
    userPhone: string;
    userIp: string;
    basket: Array<[string, string, number]>; // Örn: [['Paket 1', '50.00', 1]]
    okUrl: string;             // Başarılı ödeme sonrası döneceği sayfa URL
    failUrl: string;           // Başarısız ödeme sonrası döneceği sayfa URL
    currency?: 'TL' | 'USD' | 'EUR' | 'GBP' | 'RUB';
}

export class PayTRCheckout {
    private merchantId: string;
    private merchantKey: string;
    private merchantSalt: string;
    private testMode: boolean;

    constructor(options: PayTROptions) {
        if (!options.merchantId || !options.merchantKey || !options.merchantSalt) {
            throw new Error('PayTR API bilgileri eksik (ID, Key, Salt).');
        }
        this.merchantId = options.merchantId;
        this.merchantKey = options.merchantKey;
        this.merchantSalt = options.merchantSalt;
        this.testMode = options.testMode ?? false;
    }

    /**
     * PayTR iFrame için kullanılacak token'ı üretir ve API'den alır.
     */
    public async getToken(data: PayTROrderData): Promise<string> {
        // Tutar kuruş cinsine dönüştürülmeli (100 ile çarpılarak tam sayı yapılır)
        const paymentAmount = Math.round(data.amount * 100).toString();
        const userBasketStr = Buffer.from(JSON.stringify(data.basket)).toString('base64');
        const testModeVal = this.testMode ? '1' : '0';
        const debugOn = '0'; // Canlı ortamda 0, log görmek isterseniz 1
        const noInstallment = '0'; // Taksit gizleme
        const maxInstallment = '12';
        const timeoutLimit = '30'; // Dakika

        // Token oluşturma için PayTR dökümantasyonundaki string birleştirme sırası
        const hashStr = [
            this.merchantId,
            data.userIp,
            data.orderNo,
            data.userEmail,
            paymentAmount,
            userBasketStr,
            noInstallment,
            maxInstallment,
            data.currency || 'TL',
            testModeVal
        ].join('');

        const token = hashStr + this.merchantSalt;
        const paytrToken = crypto.createHmac('sha256', this.merchantKey).update(token).digest('base64');

        const requestBody = new URLSearchParams({
            merchant_id: this.merchantId,
            user_ip: data.userIp,
            merchant_oid: data.orderNo,
            email: data.userEmail,
            payment_amount: paymentAmount,
            paytr_token: paytrToken,
            user_basket: userBasketStr,
            debug_on: debugOn,
            no_installment: noInstallment,
            max_installment: maxInstallment,
            user_name: data.userName,
            user_address: data.userAddress,
            user_phone: data.userPhone,
            merchant_ok_url: data.okUrl,
            merchant_fail_url: data.failUrl,
            timeout_limit: timeoutLimit,
            currency: data.currency || 'TL',
            test_mode: testModeVal
        });

        try {
            console.log(`[PayTR] ${data.orderNo} siparişi için token talep ediliyor...`);
            const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestBody.toString()
            });

            const result = await response.json();

            if (result.status === 'success') {
                return result.token;
            } else {
                console.error('[PayTR Token Error]:', result.reason);
                throw new Error(`PayTR Token alınamadı: ${result.reason || 'Bilinmeyen Hata'}`);
            }
        } catch (error: any) {
            console.error('[PayTR API Call Error]:', error);
            throw error;
        }
    }

    /**
     * PayTR 2. Adım (Callback Bildirimi) doğrulaması
     */
    public validateCallback(postData: Record<string, string>): boolean {
        const { merchant_oid, status, total_amount, hash } = postData;

        if (!merchant_oid || !status || !total_amount || !hash) {
            return false;
        }

        const expectedHashStr = merchant_oid + this.merchantSalt + status + total_amount;
        const expectedHash = crypto.createHmac('sha256', this.merchantKey).update(expectedHashStr).digest('base64');

        return expectedHash === hash;
    }
}
