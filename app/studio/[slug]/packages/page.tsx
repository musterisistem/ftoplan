import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import WarmPackages from '@/components/studio/themes/warm/WarmPackages';
import PlayfulPackages from '@/components/studio/themes/playful/PlayfulPackages';
import BoldPackages from '@/components/studio/themes/bold/BoldPackages';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);
    if (!photographer) return { title: 'Paketler' };
    return { title: `Paketler | ${photographer.studioName}` };
}

export default async function PackagesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const theme = photographer.siteTheme || 'warm';
    const props = { photographer, slug };

    switch (theme) {
        case 'playful':
            return <PlayfulPackages {...props} />;
        case 'bold':
            return <BoldPackages {...props} />;
        case 'warm':
        default:
            return <WarmPackages {...props} />;
    }
}
