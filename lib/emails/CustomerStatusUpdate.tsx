import {
    Body,
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

interface CustomerStatusUpdateProps {
    customerName: string;
    statusTitle: string;
    statusValue: string;
    studioName: string;
}

export const CustomerStatusUpdate = ({
    customerName = 'Sayın Müşterimiz',
    statusTitle = 'Albüm Durumu',
    statusValue = 'Tasarım Aşamasında',
    studioName = 'Stüdyomuz',
}: CustomerStatusUpdateProps) => {
    return (
        <Html>
            <Head />
            <Preview>{statusTitle} güncellendi: {statusValue}</Preview>
            <Tailwind>
                <Body className="bg-white font-sans text-gray-900">
                    <Container className="mx-auto py-10 px-4 max-w-[580px]">
                        <Section className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10 shadow-2xl">
                            <Section className="text-center mb-6">
                                <Text className="text-pink-500 text-[10px] font-bold uppercase tracking-widest mb-2">BİLGİLENDİRME</Text>
                                <Heading className="text-2xl font-bold text-white mb-0">
                                    {statusTitle} Güncellendi
                                </Heading>
                            </Section>

                            <Section className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                                <Text className="text-gray-400 text-sm mb-4">Merhaba **{customerName}**,</Text>
                                <Text className="text-white text-base leading-relaxed mb-4">
                                    {studioName} tarafından yürütülen sürecinizde bir güncelleme yapıldı:
                                </Text>
                                <Section className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
                                    <Text className="text-gray-400 text-xs uppercase font-bold tracking-tighter mb-1">{statusTitle}</Text>
                                    <Text className="text-pink-500 text-lg font-black">{statusValue}</Text>
                                </Section>
                            </Section>

                            <Text className="text-gray-400 text-sm text-center leading-relaxed">
                                Sürecinizi takip etmeye devam ediyoruz. Herhangi bir sorunuz olduğunda bizimle iletişime geçebilirsiniz.
                            </Text>

                            <Hr className="border-white/10 my-8" />

                            <Section className="text-center">
                                <Text className="text-white font-bold text-sm mb-1">{studioName}</Text>
                                <Text className="text-gray-500 text-xs">Weey.NET Altyapısı ile Gönderilmiştir</Text>
                            </Section>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default CustomerStatusUpdate;
