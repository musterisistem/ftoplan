import crypto from 'crypto';

export interface ShopierOptions {
    apiKey?: string;       // For OSB callback validation (Username)
    apiSecret?: string;    // For OSB callback validation (Key)
    accessToken?: string;  // For REST API (PAT)
}

export interface ShopierOrderData {
    id: string;        // Our platform_order_id (orderNo)
    amount: number;    // e.g., 5.00
    currency?: 'TRY' | 'USD' | 'EUR';
    buyer: {
        id: string;
        name: string;
        surname: string;
        email: string;
        phone: string;
    };
    billing_address: {
        address: string;
        city: string;
        country: string;
        postcode: string;
    };
}

export interface ShopierCallbackData {
    email: string;
    orderid: string;
    currency: string;
    price: string;
    buyername: string;
    buyersurname: string;
    productcount: string;
    productid: string;
    productlist: string;
    chartdetails: string;
    customernote: string;
    istest: string;
}

export class ShopierCheckout {
    private apiKey?: string;
    private apiSecret?: string;
    private accessToken?: string;
    private restBaseUrl = 'https://api.shopier.com/v1';

    constructor(options: ShopierOptions) {
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
        this.accessToken = options.accessToken;
    }

    /**
     * Creates a checkout via Shopier REST API (v1) and returns payment URL.
     * Uses POST /common/checkouts
     */
    public async createCheckout(data: ShopierOrderData, callbackUrl: string): Promise<string> {
        if (!this.accessToken) {
            throw new Error('Shopier Access Token (PAT) is required for REST API checkout.');
        }

        const body = {
            order: {
                id: data.id,
                total_amount: Number(data.amount).toFixed(2),
                currency: data.currency || 'TRY',
                items: [
                    {
                        name: `FotoPlan Yazılım Paketi - ${data.id}`,
                        price: Number(data.amount).toFixed(2),
                        quantity: 1
                    }
                ]
            },
            buyer: {
                id: data.buyer.id,
                name: data.buyer.name,
                surname: data.buyer.surname,
                email: data.buyer.email,
                phone: data.buyer.phone.replace(/\s/g, ''),
                billing_address: {
                    address: data.billing_address.address,
                    city: data.billing_address.city,
                    country: data.billing_address.country,
                    postcode: data.billing_address.postcode
                },
                shipping_address: {
                    address: data.billing_address.address,
                    city: data.billing_address.city,
                    country: data.billing_address.country,
                    postcode: data.billing_address.postcode
                }
            },
            callback_url: callbackUrl,
            platform: 0,
            is_in_frame: 0
        };

        try {
            console.log('[Shopier REST] Initiating checkout at /v1/checkouts...');

            const response = await fetch(`${this.restBaseUrl}/checkouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            let result: any;
            try {
                result = await response.json();
            } catch (jsonErr) {
                const text = await response.text();
                console.error('[Shopier REST] Non-JSON Response:', text);
                throw new Error(`Shopier API (HTTP ${response.status}): ${text.substring(0, 100)}`);
            }

            if (!response.ok) {
                const errMsg = result.message || JSON.stringify(result);
                console.error('[Shopier REST] Error Response:', errMsg);
                throw new Error(`Shopier: ${errMsg}`);
            }

            return result.checkout_url || result.payment_url;
        } catch (error: any) {
            console.error('[Shopier REST] Fatal Error:', error.message);
            throw error;
        }
    }

    /**
     * Validates the OSB (Otomatik Sipariş Bildirimi) callback from Shopier.
     * Remains same for backward compatibility if configured.
     */
    public validateOSBCallback(postData: Record<string, string>): ShopierCallbackData | null {
        const { res, hash } = postData;
        if (!res || !hash || !this.apiKey || !this.apiSecret) return null;

        const expectedHash = crypto
            .createHmac('sha256', this.apiSecret)
            .update(res + this.apiKey)
            .digest('hex');

        if (expectedHash !== hash) return null;

        try {
            const jsonStr = Buffer.from(res, 'base64').toString('utf-8');
            return JSON.parse(jsonStr) as ShopierCallbackData;
        } catch {
            return null;
        }
    }
}
