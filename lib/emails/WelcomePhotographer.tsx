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

interface WelcomePhotographerProps {
    photographerName: string;
    studioName: string;
    loginUrl: string;
}

export const WelcomePhotographer = ({
    photographerName = 'Fotoğrafçı',
    studioName = 'Stüdyonuz',
    loginUrl = 'http://localhost:3000/login',
}: WelcomePhotographerProps) => {
    return (
        <Html>
            <Head />
            <Preview>Weey.NET ailesine hoş geldiniz! Stüdyonuz için yeni bir dönem başlıyor.</Preview>
            <Tailwind>
                <Body className="bg-white font-sans text-gray-900">
                    <Container className="mx-auto py-10 px-4 max-w-[580px]">
                        <Section className="bg-[#6366f1] rounded-t-3xl p-10 text-center">
                            <Img
                                src="https://Weey.NET.b-cdn.net/logo-white.png"
                                width="140"
                                height="40"
                                alt="Weey.NET"
                                className="mx-auto mb-6"
                            />
                            <Heading className="text-3xl font-bold text-white mb-2">
                                Hoş Geldin {photographerName}! 🥂
                            </Heading>
                            <Text className="text-indigo-100 text-lg">
                                **{studioName}** artık Weey.NET ile çok daha güçlü.
                            </Text>
                        </Section>

                        <Section className="bg-[#f9fafb] rounded-b-3xl p-10 border-x border-b border-gray-100 shadow-sm">
                            <Text className="text-gray-600 text-base leading-7 mb-6">
                                Merhaba,
                                <br /><br />
                                Stüdyonuzun yönetimini kolaylaştırmak ve müşterilerinize eşsiz bir fotoğraf seçim deneyimi sunmak için en doğru yerdesiniz. Weey.NET paneliniz üzerinden randevularınızı yönetebilir, çekim paketlerinizi oluşturabilir ve müşterileriniz için profesyonel seçim galerileri hazırlayabilirsiniz.
                            </Text>

                            <Section className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
                                <Heading className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Hızlı Başlangıç</Heading>
                                <ul className="m-0 p-0 list-none space-y-3">
                                    <li className="flex items-center gap-3 text-gray-600 text-sm">
                                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                                        Stüdyo profilini tamamla
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 text-sm">
                                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                                        İlk paketini tanımla
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 text-sm">
                                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                                        Müşteri galerini yayına al
                                    </li>
                                </ul>
                            </Section>

                            <Section className="text-center">
                                <Button
                                    className="bg-[#6366f1] text-white px-10 py-4 rounded-xl font-bold text-sm no-underline shadow-lg shadow-indigo-500/20"
                                    href={loginUrl}
                                >
                                    Panele Giriş Yap
                                </Button>
                            </Section>

                            <Hr className="border-gray-200 my-10" />

                            <Text className="text-gray-400 text-xs text-center">
                                Yardıma mı ihtiyacınız var? Destek ekibimiz her zaman yanınızda.
                                <br />
                                support@Weey.NET.com
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomePhotographer;
