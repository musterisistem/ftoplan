import { EmailTemplateType, EmailTemplateTypeValue } from '@/models/EmailTemplate';

// Default email templates with variable placeholders
export const DEFAULT_TEMPLATES: Record<EmailTemplateTypeValue, {
    subject: string;
    htmlContent: string;
    variables: string[];
}> = {
    [EmailTemplateType.VERIFY_EMAIL]: {
        subject: 'Weey.NET - E-posta Adresinizi Doğrulayın',
        variables: ['photographerName', 'verifyUrl'],
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://weey.net/logo-dark.png" width="140" height="40" alt="Weey.NET" style="margin: 0 auto;">
        </div>
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="font-size: 24px; font-weight: bold; color: #111827; text-align: center; margin: 0 0 16px 0;">
                Aramıza Hoş Geldin! 📸
            </h1>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Merhaba <strong>{{photographerName}}</strong>,<br><br>
                Weey.NET stüdyo yönetim paneline kaydolduğun için çok mutluyuz. 7 günlük deneme sürümünü başlatmak ve panelini kullanmaya başlamak için lütfen e-posta adresini doğrula.
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="{{verifyUrl}}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none;">
                    E-posta Adresimi Doğrula
                </a>
            </div>
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-bottom: 32px;">
                Buton çalışmıyorsa aşağıdaki linki tarayıcına yapıştırabilirsin:<br>
                <a href="{{verifyUrl}}" style="color: #6366f1; word-break: break-all;">{{verifyUrl}}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
                Bu e-postayı Weey.NET'e kayıt olduğun için aldın. Eğer kayıt olmadıysan bu mesajı dikkate almayabilirsin.
            </p>
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Weey.NET. Tüm hakları saklıdır.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
    },

    [EmailTemplateType.WELCOME_PHOTOGRAPHER]: {
        subject: 'Weey.NET Ailesine Hoş Geldiniz!',
        variables: ['photographerName', 'studioName', 'loginUrl'],
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        <div style="background-color: #6366f1; border-radius: 24px 24px 0 0; padding: 40px; text-align: center;">
            <img src="https://Weey.NET.b-cdn.net/logo-white.png" width="140" height="40" alt="Weey.NET" style="margin: 0 auto 24px;">
            <h1 style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">
                Hoş Geldin {{photographerName}}! 🥂
            </h1>
            <p style="color: #c7d2fe; font-size: 16px; margin: 0;">
                <strong>{{studioName}}</strong> artık Weey.NET ile çok daha güçlü.
            </p>
        </div>
        <div style="background-color: #f9fafb; border-radius: 0 0 24px 24px; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
                Merhaba,<br><br>
                Stüdyonuzun yönetimini kolaylaştırmak ve müşterilerinize eşsiz bir fotoğraf seçim deneyimi sunmak için en doğru yerdesiniz. Weey.NET paneliniz üzerinden randevularınızı yönetebilir, çekim paketlerinizi oluşturabilir ve müşterileriniz için profesyonel seçim galerileri hazırlayabilirsiniz.
            </p>
            <div style="background-color: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
                <h2 style="font-size: 12px; font-weight: bold; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 16px 0;">Hızlı Başlangıç</h2>
                <div style="margin-bottom: 12px;">
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #d1fae5; color: #059669; border-radius: 50%; text-align: center; line-height: 20px; font-size: 10px; font-weight: bold; margin-right: 8px;">1</span>
                    <span style="color: #4b5563; font-size: 14px;">Stüdyo profilini tamamla</span>
                </div>
                <div style="margin-bottom: 12px;">
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #d1fae5; color: #059669; border-radius: 50%; text-align: center; line-height: 20px; font-size: 10px; font-weight: bold; margin-right: 8px;">2</span>
                    <span style="color: #4b5563; font-size: 14px;">İlk paketini tanımla</span>
                </div>
                <div>
                    <span style="display: inline-block; width: 20px; height: 20px; background-color: #d1fae5; color: #059669; border-radius: 50%; text-align: center; line-height: 20px; font-size: 10px; font-weight: bold; margin-right: 8px;">3</span>
                    <span style="color: #4b5563; font-size: 14px;">Müşteri galerini yayına al</span>
                </div>
            </div>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{loginUrl}}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                    Panele Giriş Yap
                </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                Yardıma mı ihtiyacınız var? Destek ekibimiz her zaman yanınızda.<br>
                support@weey.net
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
    },

    [EmailTemplateType.CUSTOMER_STATUS_UPDATE]: {
        subject: '{{studioName}} - {{statusTitle}} Güncellendi',
        variables: ['customerName', 'statusTitle', 'statusValue', 'studioName'],
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        <div style="background: linear-gradient(to bottom right, #1f2937, #000000); border-radius: 24px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
                <p style="color: #ec4899; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">BİLGİLENDİRME</p>
                <h1 style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 0;">
                    {{statusTitle}} Güncellendi
                </h1>
            </div>
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px 0;">Merhaba <strong>{{customerName}}</strong>,</p>
                <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                    {{studioName}} tarafından yürütülen sürecinizde bir güncelleme yapıldı:
                </p>
                <div style="background-color: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.2); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; margin: 0 0 4px 0;">{{statusTitle}}</p>
                    <p style="color: #ec4899; font-size: 18px; font-weight: bold; margin: 0;">{{statusValue}}</p>
                </div>
            </div>
            <p style="color: #9ca3af; font-size: 14px; text-align: center; line-height: 1.6; margin: 0 0 32px 0;">
                Sürecinizi takip etmeye devam ediyoruz. Herhangi bir sorunuz olduğunda bizimle iletişime geçebilirsiniz.
            </p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">
            <div style="text-align: center;">
                <p style="color: #ffffff; font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">{{studioName}}</p>
                <p style="color: #6b7280; font-size: 12px; margin: 0;">Weey.NET Altyapısı ile Gönderilmiştir</p>
            </div>
        </div>
    </div>
</body>
</html>
        `.trim(),
    },

    [EmailTemplateType.PLAN_UPDATED]: {
        subject: 'Weey.NET - Üyeliğiniz Güncellendi',
        variables: ['photographerName', 'newPlanName', 'expiryDate', 'storageLimit'],
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 48px 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://Weey.NET.b-cdn.net/logo-dark.png" width="140" height="40" alt="Weey.NET" style="margin: 0 auto;">
        </div>
        <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(to right, #4f46e5, #9333ea, #ec4899); padding: 32px; text-align: center;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border-radius: 16px; margin-bottom: 16px; line-height: 64px; font-size: 32px;">
                    ✨
                </div>
                <h1 style="font-size: 30px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">
                    Üyelik Bilgileri
                </h1>
                <p style="color: #c7d2fe; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
                    Paket Güncellendi
                </p>
            </div>
            <div style="padding: 40px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.75; margin-bottom: 32px;">
                    Sayın <strong>{{photographerName}}</strong>,<br><br>
                    Üyeliğiniz başarıyla güncellenmiştir. Yeni paket bilgileriniz aşağıdadır:
                </p>
                <div style="background: linear-gradient(to bottom right, #f9fafb, #e5e7eb); border-radius: 16px; padding: 24px; border: 1px solid #d1d5db; margin-bottom: 32px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #d1d5db;">
                            <td style="padding: 16px 0;">
                                <div style="display: flex; align-items: center;">
                                    <div style="width: 40px; height: 40px; background-color: #e0e7ff; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 12px;">📦</div>
                                    <div>
                                        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 4px 0;">Yeni Paket</p>
                                        <p style="color: #111827; font-weight: bold; font-size: 18px; margin: 0;">{{newPlanName}}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid #d1d5db;">
                            <td style="padding: 16px 0;">
                                <div style="display: flex; align-items: center;">
                                    <div style="width: 40px; height: 40px; background-color: #d1fae5; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 12px;">📅</div>
                                    <div>
                                        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 4px 0;">Geçerlilik Tarihi</p>
                                        <p style="color: #111827; font-weight: bold; font-size: 18px; margin: 0;">{{expiryDate}}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 0;">
                                <div style="display: flex; align-items: center;">
                                    <div style="width: 40px; height: 40px; background-color: #dbeafe; border-radius: 12px; text-align: center; line-height: 40px; font-size: 20px; margin-right: 12px;">💾</div>
                                    <div>
                                        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 4px 0;">Depolama Alanı</p>
                                        <p style="color: #111827; font-weight: bold; font-size: 18px; margin: 0;">{{storageLimit}}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="text-align: center; margin-bottom: 24px;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(to right, #4f46e5, #9333ea); color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none; box-shadow: 0 10px 15px rgba(0,0,0,0.1);">
                        Panelime Giriş Yap
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; text-align: center; line-height: 1.5; font-style: italic; margin: 0;">
                    Yeni özelliklerinizi keşfetmek için hemen panelinize göz atın! 🚀
                </p>
            </div>
            <div style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                    Bu bir bilgilendirme mesajıdır. Sorularınız için bize ulaşabilirsiniz.<br>
                    <strong style="color: #6b7280;">© ${new Date().getFullYear()} Weey.NET</strong> - Profesyonel Stüdyo Yönetimi
                </p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Bu e-postayı Weey.NET üyeliğiniz kapsamında aldınız.
            </p>
        </div>
    </div>
</body>
</html>
        `.trim(),
    },
};

/**
 * Replace variables in template with actual data
 */
export function replaceVariables(template: string, data: Record<string, any>): string {
    let result = template;

    // Replace all {{variable}} with actual values
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key] || '');
    });

    return result;
}

/**
 * Get template variables from template string
 */
export function extractVariables(template: string): string[] {
    const regex = /{{(\\w+)}}/g;
    const matches = template.matchAll(regex);
    const variables = new Set<string>();

    for (const match of matches) {
        variables.add(match[1]);
    }

    return Array.from(variables);
}
