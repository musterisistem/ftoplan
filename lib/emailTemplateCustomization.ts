import { EmailTemplateType, EmailTemplateTypeValue } from '@/models/EmailTemplate';

// Template customizable fields for each template type
export interface TemplateCustomization {
    logoUrl?: string;
    primaryColor?: string;
    subject?: string;
    headerText?: string;
    bodyText?: string;
    buttonText?: string;
    footerText?: string;
    companyName?: string;
}

// Default customizations
export const DEFAULT_CUSTOMIZATIONS: Record<EmailTemplateTypeValue, TemplateCustomization> = {
    [EmailTemplateType.VERIFY_EMAIL]: {
        logoUrl: 'https://Weey.NET.b-cdn.net/logo-dark.png',
        primaryColor: '#6366f1',
        subject: 'Aramıza Hoş Geldin! E-posta Adresini Doğrula',
        headerText: 'Aramıza Hoş Geldin!',
        bodyText: 'Weey.NET stüdyo yönetim paneline kaydolduğun için çok mutluyuz. 7 günlük deneme sürümünü başlatmak ve panelini kullanmaya başlamak için lütfen e-posta adresini doğrula.',
        buttonText: 'E-posta Adresimi Doğrula',
        footerText: 'Bu e-postayı Weey.NET\'e kayıt olduğun için aldın. Eğer kayıt olmadıysan bu mesajı dikkate almayabilirsin.',
        companyName: 'Weey.NET'
    },
    [EmailTemplateType.WELCOME_PHOTOGRAPHER]: {
        logoUrl: 'https://Weey.NET.b-cdn.net/logo-white.png',
        primaryColor: '#6366f1',
        subject: 'Weey.NET Ailesine Hoş Geldiniz!',
        headerText: 'Hoş Geldiniz!',
        bodyText: 'Stüdyonuzun yönetimini kolaylaştırmak ve müşterilerinize eşsiz bir fotoğraf seçim deneyimi sunmak için en doğru yerdesiniz.',
        buttonText: 'Panele Giriş Yap',
        footerText: 'Yardıma mı ihtiyacınız var? Destek ekibimiz her zaman yanınızda.',
        companyName: 'Weey.NET'
    },
    [EmailTemplateType.CUSTOMER_STATUS_UPDATE]: {
        logoUrl: '',
        primaryColor: '#ec4899',
        subject: 'Sürecinizde Yeni Bir Güncelleme Var',
        headerText: 'Sürecinizde Güncelleme',
        bodyText: 'tarafından yürütülen sürecinizde bir güncelleme yapıldı.',
        buttonText: '',
        footerText: 'Sürecinizi takip etmeye devam ediyoruz. Herhangi bir sorunuz olduğunda bizimle iletişime geçebilirsiniz.',
        companyName: ''
    },
    [EmailTemplateType.PLAN_UPDATED]: {
        logoUrl: 'https://Weey.NET.b-cdn.net/logo-dark.png',
        primaryColor: '#6366f1',
        subject: 'Üyelik Paketiniz Güncellendi',
        headerText: 'Üyelik Bilgileri',
        bodyText: 'Üyeliğiniz başarıyla güncellenmiştir. Yeni paket bilgileriniz aşağıdadır:',
        buttonText: 'Panelime Giriş Yap',
        footerText: 'Bu bir bilgilendirme mesajıdır. Sorularınız için bize ulaşabilirsiniz.',
        companyName: 'Weey.NET'
    }
};

// Template field descriptions
export const FIELD_DESCRIPTIONS: Record<string, string> = {
    logoUrl: 'Logo URL\'si (boş bırakırsanız logo gösterilmez)',
    primaryColor: 'Ana renk (buton ve vurgular için)',
    headerText: 'Başlık metni',
    bodyText: 'Ana açıklama metni',
    buttonText: 'Buton üzerindeki yazı',
    footerText: 'Alt kısımdaki bilgilendirme metni',
    companyName: 'Şirket/Stüdyo adı'
};

// Get customizable fields for a template type
export function getCustomizableFields(templateType: EmailTemplateTypeValue): string[] {
    const defaults = DEFAULT_CUSTOMIZATIONS[templateType];
    return Object.keys(defaults).filter(key => defaults[key as keyof TemplateCustomization] !== '');
}

// Build HTML from customization
export function buildEmailFromCustomization(
    templateType: EmailTemplateTypeValue,
    customization: TemplateCustomization,
    variables: Record<string, any>
): { subject: string; htmlContent: string } {
    const merged = { ...DEFAULT_CUSTOMIZATIONS[templateType], ...customization };

    let subject = '';
    let htmlContent = '';

    switch (templateType) {
        case EmailTemplateType.VERIFY_EMAIL:
            subject = merged.subject || `${merged.companyName} - E-posta Adresinizi Doğrulayın`;
            htmlContent = buildVerifyEmailHtml(merged, variables);
            break;
        case EmailTemplateType.WELCOME_PHOTOGRAPHER:
            subject = merged.subject || `${merged.companyName} Ailesine Hoş Geldiniz!`;
            htmlContent = buildWelcomePhotographerHtml(merged, variables);
            break;
        case EmailTemplateType.CUSTOMER_STATUS_UPDATE:
            subject = merged.subject || `{{studioName}} - {{statusTitle}} Güncellendi`;
            htmlContent = buildCustomerStatusUpdateHtml(merged, variables);
            break;
        case EmailTemplateType.PLAN_UPDATED:
            subject = merged.subject || `${merged.companyName} - Üyeliğiniz Güncellendi`;
            htmlContent = buildPlanUpdatedHtml(merged, variables);
            break;
    }

    return { subject, htmlContent };
}

function buildVerifyEmailHtml(custom: TemplateCustomization, vars: Record<string, any>): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        ${custom.logoUrl ?\`<div style="text-align: center; margin-bottom: 32px;"><img src="\${custom.logoUrl}" width="140" height="40" alt="\${custom.companyName}" style="margin: 0 auto;"></div>\` : ''}
        <div style="background-color: #f9fafb; border-radius: 24px; padding: 32px; border: 1px solid #e5e7eb;">
            <h1 style="font-size: 24px; font-weight: bold; color: #111827; text-align: center; margin: 0 0 16px 0;">\${custom.headerText || ''}</h1>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Merhaba <strong>{{photographerName}}</strong>,<br><br>\${custom.bodyText || ''}
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="{{verifyUrl}}" style="display: inline-block; background-color: \${custom.primaryColor}; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none;">
                    \${custom.buttonText || ''}
                </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">\${custom.footerText || ''}</p>
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© \${new Date().getFullYear()} \${custom.companyName || ''}. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>\`.trim();
}

function buildWelcomePhotographerHtml(custom: TemplateCustomization, vars: Record<string, any>): string {
    return \`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        <div style="background-color: \${custom.primaryColor}; border-radius: 24px 24px 0 0; padding: 40px; text-align: center;">
            \${custom.logoUrl ? \`<img src="\${custom.logoUrl}" width="140" height="40" alt="\${custom.companyName}" style="margin: 0 auto 24px;">\` : ''}
            <h1 style="font-size: 28px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">\${(custom.headerText || '').replace('{{photographerName}}', '{{photographerName}}')}</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin: 0;"><strong>{{studioName}}</strong> artık \${custom.companyName || ''} ile çok daha güçlü.</p>
        </div>
        <div style="background-color: #f9fafb; border-radius: 0 0 24px 24px; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">\${custom.bodyText}</p>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{loginUrl}}" style="display: inline-block; background-color: \${custom.primaryColor}; color: #ffffff; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none;">
                    \${custom.buttonText}
                </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">\${custom.footerText}</p>
        </div>
    </div>
</body>
</html>\`.trim();
}

function buildCustomerStatusUpdateHtml(custom: TemplateCustomization, vars: Record<string, any>): string {
    return \`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
    <div style="max-width: 580px; margin: 0 auto; padding: 40px 16px;">
        <div style="background: linear-gradient(to bottom right, #1f2937, #000000); border-radius: 24px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
                <p style="color: \${custom.primaryColor}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px 0;">BİLGİLENDİRME</p>
                <h1 style="font-size: 24px; font-weight: bold; color: #ffffff; margin: 0;">\${custom.headerText || 'Sürecinizde Güncelleme'}</h1>
            </div>
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px 0;">Merhaba <strong>{{customerName}}</strong>,</p>
                <p style="color: #ffffff; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">{{studioName}} \${custom.bodyText}</p>
                <div style="background-color: rgba(\${hexToRgb(custom.primaryColor!)}, 0.1); border: 1px solid rgba(\${hexToRgb(custom.primaryColor!)}, 0.2); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 11px; text-transform: uppercase; font-weight: bold; margin: 0 0 4px 0;">{{statusTitle}}</p>
                    <p style="color: \${custom.primaryColor}; font-size: 18px; font-weight: bold; margin: 0;">{{statusValue}}</p>
                </div>
            </div>
            <p style="color: #9ca3af; font-size: 14px; text-align: center; line-height: 1.6; margin: 0 0 32px 0;">\${custom.footerText}</p>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">
            <div style="text-align: center;">
                <p style="color: #ffffff; font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">{{studioName}}</p>
                <p style="color: #6b7280; font-size: 12px; margin: 0;">\${custom.companyName} Altyapısı ile Gönderilmiştir</p>
            </div>
        </div>
    </div>
</body>
</html>\`.trim();
}

function buildPlanUpdatedHtml(custom: TemplateCustomization, vars: Record<string, any>): string {
    return \`
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 48px 16px;">
        \${custom.logoUrl ? \`<div style="text-align: center; margin-bottom: 32px;"><img src="\${custom.logoUrl}" width="140" height="40" alt="\${custom.companyName}"></div>\` : ''}
        <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(to right, #4f46e5, #9333ea, #ec4899); padding: 32px; text-align: center;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border-radius: 16px; margin-bottom: 16px; line-height: 64px; font-size: 32px;">
                    ✨
                </div>
                <h1 style="font-size: 30px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">\${custom.headerText || 'Üyelik Bilgileri'}</h1>
                <p style="color: #c7d2fe; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">\${custom.subject || 'Paket Güncellendi'}</p>
            </div>
            <div style="padding: 40px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.75; margin-bottom: 32px;">
                    Sayın <strong>{{photographerName}}</strong>,<br><br>\${custom.bodyText}
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
                    <a href="/login" style="display: inline-block; background: linear-gradient(to right, #4f46e5, #9333ea); color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 14px; text-decoration: none;">
                        \${custom.buttonText}
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 14px; text-align: center; line-height: 1.5; font-style: italic; margin: 0;">
                    Yeni özelliklerinizi keşfetmek için hemen panelinize göz atın! 🚀
                </p>
            </div>
            <div style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">\${custom.footerText}</p>
            </div>
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© \${new Date().getFullYear()} \${custom.companyName}. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>\`.trim();
}

/**
 * Helper to convert hex to rgb for rgba
 */
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? \`\${parseInt(result[1], 16)}, \${parseInt(result[2], 16)}, \${parseInt(result[3], 16)}\` : '99, 102, 241';
}
