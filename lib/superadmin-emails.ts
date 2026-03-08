import { sendEmail } from '@/lib/resend';

const SUPERADMIN_EMAIL = 'musterisistem@gmail.com';

const baseHtml = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #111827; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Weey.NET Sistem Bildirimi</h1>
                            <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 14px;">${title}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 13px;">
                                Bu otomatik bir sistem bildirim mesajıdır.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export async function notifySuperadminNewUser(user: any) {
    const title = 'Yeni Üye Kaydı';
    const content = `
        <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Sisteme yeni bir üye kayıt oldu!</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Kullanıcı Adı:</strong> ${user.name}</p>
            <p style="margin: 5px 0;"><strong>Stüdyo Adı:</strong> ${user.studioName || 'Belirtilmedi'}</p>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Telefon:</strong> ${user.phone || 'Belirtilmedi'}</p>
            <p style="margin: 5px 0;"><strong>Paket Tipi:</strong> <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${user.packageType}</span></p>
            <p style="margin: 5px 0;"><strong>Kayıt Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        </div>
        <p style="color: #4b5563; font-size: 15px; margin-top: 20px;">Detayları incelemek için süperadmin paneline giriş yapabilirsiniz.</p>
    `;

    try {
        await sendEmail({
            to: SUPERADMIN_EMAIL,
            subject: '🔔 Yeni Üye Kaydı - Weey.NET',
            html: baseHtml(title, content)
        });
    } catch (e) {
        console.error('Failed to notify superadmin of new user:', e);
    }
}

export async function notifySuperadminPaymentSuccess(user: any, orderDetails: any) {
    const title = 'Yeni Ödeme Başarılı';
    const content = `
        <h2 style="color: #111827; font-size: 20px; margin-top: 0; color: #059669;">Ödeme Başarıyla Alındı!</h2>
        <p style="color: #4b5563; font-size: 15px;">Sisteme yeni kayıt olan bir kullanıcı paket satın alarak ödemesini tamamladı.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Kullanıcı Adı:</strong> ${user.name}</p>
            <p style="margin: 5px 0;"><strong>Stüdyo Adı:</strong> ${user.studioName || 'Belirtilmedi'}</p>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Telefon:</strong> ${user.phone || 'Belirtilmedi'}</p>
            <p style="margin: 5px 0;"><strong>Satın Alınan Paket:</strong> <span style="background-color: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${orderDetails.packageType || user.packageType}</span></p>
            <p style="margin: 5px 0;"><strong>Ödenen Tutar:</strong> ₺${orderDetails.amount}</p>
            <p style="margin: 5px 0;"><strong>Sipariş No:</strong> ${orderDetails.orderNo}</p>
            <p style="margin: 5px 0;"><strong>İşlem Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        </div>
    `;

    try {
        await sendEmail({
            to: SUPERADMIN_EMAIL,
            subject: '💰 Yeni Satış / Ödeme - Weey.NET',
            html: baseHtml(title, content)
        });
    } catch (e) {
        console.error('Failed to notify superadmin of payment success:', e);
    }
}

export async function notifySuperadminPackageUpgrade(user: any, orderDetails: any) {
    const title = 'Paket Yükseltme / Yenileme';
    const content = `
        <h2 style="color: #111827; font-size: 20px; margin-top: 0; color: #7c3aed;">Mevcut Üye Paket Yükseltti!</h2>
        <p style="color: #4b5563; font-size: 15px;">Sistemde zaten kayıtlı olan bir kullanıcı paketini yükseltti ve ödemesini başarıyla tamamladı.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Kullanıcı Adı:</strong> ${user.name}</p>
            <p style="margin: 5px 0;"><strong>Stüdyo Adı:</strong> ${user.studioName || 'Belirtilmedi'}</p>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Yeni Paket:</strong> <span style="background-color: #ede9fe; color: #5b21b6; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${orderDetails.packageType}</span></p>
            <p style="margin: 5px 0;"><strong>Ödenen Tutar:</strong> ₺${orderDetails.amount}</p>
            <p style="margin: 5px 0;"><strong>Sipariş No:</strong> ${orderDetails.orderNo}</p>
            <p style="margin: 5px 0;"><strong>İşlem Tarihi:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        </div>
    `;

    try {
        await sendEmail({
            to: SUPERADMIN_EMAIL,
            subject: '🚀 Paket Yükseltme Başarılı - Weey.NET',
            html: baseHtml(title, content)
        });
    } catch (e) {
        console.error('Failed to notify superadmin of package upgrade:', e);
    }
}
