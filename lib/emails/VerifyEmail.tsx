import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
    photographerName: string;
    verifyUrl: string;
}

export const VerifyEmail = ({
    photographerName = 'Fotoğrafçı',
    verifyUrl = 'http://localhost:3000',
}: VerifyEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Weey.NET panelinize erişmek için e-posta adresinizi doğrulayın.</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-10 px-4 max-w-[580px]">
                        <Section className="text-center mb-8">
                            <Img
                                src="https://Weey.NET.b-cdn.net/logo-dark.png" // Placeholder or real logo
                                width="140"
                                height="40"
                                alt="Weey.NET"
                                className="mx-auto"
                            />
                        </Section>
                        <Section className="bg-[#f9fafb] rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <Heading className="text-2xl font-bold text-gray-900 text-center mb-4">
                                Aramıza Hoş Geldin! 📸
                            </Heading>
                            <Text className="text-gray-600 text-sm leading-6 mb-6">
                                Merhaba **{photographerName}**,
                                <br /><br />
                                Weey.NET stüdyo yönetim paneline kaydolduğun için çok mutluyuz. 7 günlük deneme sürümünü başlatmak ve panelini kullanmaya başlamak için lütfen e-posta adresini doğrula.
                            </Text>
                            <Section className="text-center mb-6">
                                <Button
                                    className="bg-[#6366f1] text-white px-8 py-4 rounded-xl font-bold text-sm no-underline transition-all"
                                    href={verifyUrl}
                                >
                                    E-posta Adresimi Doğrula
                                </Button>
                            </Section>
                            <Text className="text-gray-500 text-xs text-center">
                                Buton çalışmıyorsa aşağıdaki linki tarayıcına yapıştırabilirsin:
                                <br />
                                <Link href={verifyUrl} className="text-[#6366f1] break-all">
                                    {verifyUrl}
                                </Link>
                            </Text>
                            <Hr className="border-gray-200 my-8" />
                            <Text className="text-gray-400 text-xs leading-5">
                                Bu e-postayı Weey.NET'e kayıt olduğun için aldın. Eğer kayıt olmadıysan bu mesajı dikkate almayabilirsin.
                            </Text>
                        </Section>
                        <Section className="text-center mt-8">
                            <Text className="text-gray-400 text-xs">
                                © {new Date().getFullYear()} Weey.NET. Tüm hakları saklıdır.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;
