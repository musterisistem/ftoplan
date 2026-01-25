import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import WarmContact from '@/components/studio/themes/warm/WarmContact';
import PlayfulContact from '@/components/studio/themes/playful/PlayfulContact';
import BoldContact from '@/components/studio/themes/bold/BoldContact';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);
    if (!photographer) return { title: 'İletişim' };
    return { title: `İletişim | ${photographer.studioName}` };
}

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const theme = photographer.siteTheme || 'warm';
    const props = { photographer, slug };

    switch (theme) {
        case 'playful':
            return <PlayfulContact {...props} />;
        case 'bold':
            return <BoldContact {...props} />;
        case 'warm':
        default:
            return <WarmContact {...props} />;
    }
}
