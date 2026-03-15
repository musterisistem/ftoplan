import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fotoğrafçı Paneli - Weey.Net',
    description: 'Stüdyo hesabınızla giriş yapın',
};

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
