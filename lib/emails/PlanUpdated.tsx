import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface PlanUpdatedProps {
    photographerName: string;
    newPlanName: string;
    expiryDate: string;
    storageLimit: string;
}

export const PlanUpdated = ({
    photographerName = 'Fotoğrafçı',
    newPlanName = 'Pro Paket',
    expiryDate = '31.12.2026',
    storageLimit = '50 GB',
}: PlanUpdatedProps) => {
    return (
        <Html>
            <Head />
            <Preview>Planınız güncellendi! Yeni paket bilgilerinizi inceleyin. ✨</Preview>
            <Tailwind>
                <Body style={{ backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }}>
                    <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 16px' }}>
                        {/* Logo Section */}
                        <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Img
                                src="https://Weey.NET.b-cdn.net/logo-dark.png"
                                width="140"
                                height="40"
                                alt="Weey.NET"
                                style={{ margin: '0 auto' }}
                            />
                        </Section>

                        {/* Main Content Card */}
                        <Section style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e5e7eb' }}>
                            {/* Header with gradient */}
                            <Section style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea, #ec4899)', padding: '32px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '16px', marginBottom: '16px', paddingTop: '12px' }}>
                                    <Text style={{ fontSize: '32px', margin: '0' }}>✨</Text>
                                </div>
                                <Heading style={{ fontSize: '30px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px', margin: '0' }}>
                                    Üyelik Bilgileri
                                </Heading>
                                <Text style={{ color: '#c7d2fe', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0' }}>
                                    Paket Güncellendi
                                </Text>
                            </Section>

                            {/* Content */}
                            <Section style={{ padding: '40px' }}>
                                <Text style={{ color: '#374151', fontSize: '16px', lineHeight: '1.75', marginBottom: '32px' }}>
                                    Sayın <strong>{photographerName}</strong>,
                                    <br /><br />
                                    Üyeliğiniz başarıyla güncellenmiştir. Yeni paket bilgileriniz aşağıdadır:
                                </Text>

                                {/* Details Box */}
                                <Section style={{ background: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)', borderRadius: '16px', padding: '24px', border: '1px solid #d1d5db', marginBottom: '32px' }}>
                                    {/* New Plan */}
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tr style={{ borderBottom: '1px solid #d1d5db' }}>
                                            <td style={{ padding: '16px 0' }}>
                                                <table>
                                                    <tr>
                                                        <td style={{ width: '40px', verticalAlign: 'top' }}>
                                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', borderRadius: '12px', textAlign: 'center', paddingTop: '6px' }}>
                                                                <Text style={{ fontSize: '20px', margin: '0' }}>📦</Text>
                                                            </div>
                                                        </td>
                                                        <td style={{ paddingLeft: '12px' }}>
                                                            <Text style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 4px 0' }}>
                                                                Yeni Paket
                                                            </Text>
                                                            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>
                                                                {newPlanName}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        {/* Expiry Date */}
                                        <tr style={{ borderBottom: '1px solid #d1d5db' }}>
                                            <td style={{ padding: '16px 0' }}>
                                                <table>
                                                    <tr>
                                                        <td style={{ width: '40px', verticalAlign: 'top' }}>
                                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#d1fae5', borderRadius: '12px', textAlign: 'center', paddingTop: '6px' }}>
                                                                <Text style={{ fontSize: '20px', margin: '0' }}>📅</Text>
                                                            </div>
                                                        </td>
                                                        <td style={{ paddingLeft: '12px' }}>
                                                            <Text style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 4px 0' }}>
                                                                Geçerlilik Tarihi
                                                            </Text>
                                                            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>
                                                                {expiryDate}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                        {/* Storage Limit */}
                                        <tr>
                                            <td style={{ padding: '16px 0' }}>
                                                <table>
                                                    <tr>
                                                        <td style={{ width: '40px', verticalAlign: 'top' }}>
                                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '12px', textAlign: 'center', paddingTop: '6px' }}>
                                                                <Text style={{ fontSize: '20px', margin: '0' }}>💾</Text>
                                                            </div>
                                                        </td>
                                                        <td style={{ paddingLeft: '12px' }}>
                                                            <Text style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', margin: '0 0 4px 0' }}>
                                                                Depolama Alanı
                                                            </Text>
                                                            <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>
                                                                {storageLimit}
                                                            </Text>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </Section>

                                {/* CTA Button */}
                                <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <Button
                                        style={{ background: 'linear-gradient(to right, #4f46e5, #9333ea)', color: '#ffffff', padding: '16px 32px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                        href="http://localhost:3000/login"
                                    >
                                        Panelime Giriş Yap
                                    </Button>
                                </Section>

                                <Text style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', lineHeight: '1.5', fontStyle: 'italic' }}>
                                    Yeni özelliklerinizi keşfetmek için hemen panelinize göz atın! 🚀
                                </Text>
                            </Section>

                            {/* Footer */}
                            <Section style={{ backgroundColor: '#f9fafb', padding: '24px 40px', borderTop: '1px solid #e5e7eb' }}>
                                <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', lineHeight: '1.5', margin: '0' }}>
                                    Bu bir bilgilendirme mesajıdır. Sorularınız için bize ulaşabilirsiniz.
                                    <br />
                                    <strong style={{ color: '#6b7280' }}>© {new Date().getFullYear()} Weey.NET</strong> - Profesyonel Stüdyo Yönetimi
                                </Text>
                            </Section>
                        </Section>

                        {/* Bottom Note */}
                        <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
                                Bu e-postayı Weey.NET üyeliğiniz kapsamında aldınız.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default PlanUpdated;
