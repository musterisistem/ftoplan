import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Theme Components
import WarmHome from '@/components/studio/themes/warm/WarmHome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return { title: 'Site Bulunamadı' };

    const title = `${photographer.studioName} - fotoğrafçı dış çekim dış mekan çekimleri`;

    return {
        title,
        description: photographer.aboutText || title,
        keywords: ['fotoğrafçı', 'dış çekim', 'dış çekim fiyatları', 'foto', 'fotoğrafçılık', 'dış çekim fotoğrafçı'],
        openGraph: {
            title,
            description: photographer.aboutText || title,
        }
    };
}

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    // Default to Warm/Broms theme (supports light/dark via internal logic)
    return (
        <WarmHome photographer={photographer} slug={slug} />
    );
}
