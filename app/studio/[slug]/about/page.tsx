import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import WarmAbout from '@/components/studio/themes/warm/WarmAbout';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);
    if (!photographer) return { title: 'Hakkımızda' };
    return { title: `Hakkımızda | ${photographer.studioName}` };
}

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const props = { photographer, slug };

    return <WarmAbout {...props} />;
}
