import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import WarmPackages from '@/components/studio/themes/warm/WarmPackages';

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

    const props = { photographer, slug };

    return <WarmPackages {...props} />;
}
