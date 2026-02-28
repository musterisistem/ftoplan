import crypto from 'crypto';

export interface ShopierOptions {
    apiKey: string;
    apiSecret: string;
}

export interface ShopierOrderData {
    id: string; // Your unique order ID (e.g., from MongoDB)
    amount: number; // e.g., 9499.00
    currency?: 'TRY' | 'USD' | 'EUR';
    buyer: {
        id: string; // User ID
        name: string;
        surname: string;
        email: string;
        phone: string;
        account_age?: number; // Days since registration
    };
    billing_address: {
        address: string;
        city: string;
        country: string;
        postcode: string;
    };
}

export class ShopierCheckout {
    private apiKey: string;
    private apiSecret: string;
    private baseUrl = 'https://www.shopier.com/ShowProduct/api_pay4.php';

    constructor(options: ShopierOptions) {
        if (!options.apiKey || !options.apiSecret) {
            throw new Error('Shopier API Key and Secret are required.');
        }
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
    }

    /**
     * Generates the signature needed for Shopier POST request
     */
    private generateSignature(orderNo: string, amount: string, currency: string): string {
        const data = orderNo + amount + currency;
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(data);
        return hmac.digest('base64');
    }

    /**
     * Returns an HTML string that automatically submits a form to Shopier.
     * Your Next.js API route should stream/send this HTML to the browser.
     */
    public generatePaymentForm(data: ShopierOrderData, callbackUrl: string): string {
        const amountStr = data.amount.toString();
        const currencyStr = data.currency === 'USD' ? '1' : data.currency === 'EUR' ? '2' : '0'; // 0 = TRY

        // For digital products/subscriptions we send dummy shipping info or same as billing
        const signature = this.generateSignature(data.id, amountStr, currencyStr);

        return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Shopier Ödeme Sistemine Yönlendiriliyorsunuz...</title>
          <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f7f9fc; margin: 0; }
              .loader { border: 4px solid #f3f3f3; border-top: 4px solid #5d2b72; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .container { text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="loader"></div>
              <h2>Güvenli Ödeme Ekranına Yönlendiriliyorsunuz...</h2>
              <p>Lütfen bekleyin, bu işlem sadece birkaç saniye sürecektir.</p>
          </div>
          <form id="shopier_form" method="post" action="${this.baseUrl}">
              <input type="hidden" name="API_key" value="${this.apiKey}">
              <input type="hidden" name="website_index" value="1">
              <input type="hidden" name="platform_order_id" value="${data.id}">
              <input type="hidden" name="product_name" value="FotoPlan Yazılım Paketi - ${data.id}">
              <input type="hidden" name="product_type" value="1"> <!-- 1 = Digital / Non-shippable -->
              <input type="hidden" name="buyer_name" value="${data.buyer.name}">
              <input type="hidden" name="buyer_surname" value="${data.buyer.surname}">
              <input type="hidden" name="buyer_email" value="${data.buyer.email}">
              <input type="hidden" name="buyer_account_age" value="${data.buyer.account_age || 0}">
              <input type="hidden" name="buyer_id_nr" value="${data.buyer.id}">
              <input type="hidden" name="buyer_phone" value="${data.buyer.phone}">
              <input type="hidden" name="billing_address" value="${data.billing_address.address}">
              <input type="hidden" name="billing_city" value="${data.billing_address.city}">
              <input type="hidden" name="billing_country" value="${data.billing_address.country}">
              <input type="hidden" name="billing_postcode" value="${data.billing_address.postcode}">
              <input type="hidden" name="shipping_address" value="${data.billing_address.address}">
              <input type="hidden" name="shipping_city" value="${data.billing_address.city}">
              <input type="hidden" name="shipping_country" value="${data.billing_address.country}">
              <input type="hidden" name="shipping_postcode" value="${data.billing_address.postcode}">
              <input type="hidden" name="custom_url" value="${callbackUrl}">
              <input type="hidden" name="total_order_value" value="${amountStr}">
              <input type="hidden" name="currency" value="${currencyStr}">
              <input type="hidden" name="platform" value="0">
              <input type="hidden" name="is_in_frame" value="0">
              <input type="hidden" name="current_language" value="2"> <!-- 2 = TR -->
              <input type="hidden" name="modul_version" value="1.0.4">
              <input type="hidden" name="random_nr" value="${data.id}">
              <input type="hidden" name="signature" value="${signature}">
          </form>
          <script type="text/javascript">
              document.getElementById("shopier_form").submit();
          </script>
      </body>
      </html>
    `;
    }

    /**
     * Validates the callback received from Shopier after payment.
     * Usually called in a POST route: /api/payment/shopier/callback
     */
    public validateCallback(postData: Record<string, string>): boolean {
        const { random_nr, signature, status } = postData;

        if (!signature || !random_nr) {
            return false;
        }

        const expectedData = random_nr + status;
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(expectedData);
        const expectedSignature = hmac.digest('base64');

        return signature === expectedSignature;
    }
}
