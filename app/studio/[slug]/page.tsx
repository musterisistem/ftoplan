import { getPhotographer } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Theme Components
import WarmHome from '@/components/studio/themes/warm/WarmHome';
import PlayfulHome from '@/components/studio/themes/playful/PlayfulHome';
import BoldHome from '@/components/studio/themes/bold/BoldHome';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return { title: 'Site Bulunamadı' };

    return {
        title: photographer.studioName,
        description: photographer.aboutText || `${photographer.studioName} Resmi Web Sayfası`,
    };
}

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    // Get theme from photographer settings, default to 'warm'
    const theme = photographer.siteTheme || 'warm';

    // Render theme based on selection
    // Determine content based on theme
    let content;
    switch (theme) {
        case 'playful':
            content = <PlayfulHome photographer={photographer} slug={slug} />;
            break;
        case 'bold':
            content = <BoldHome photographer={photographer} slug={slug} />;
            break;
        case 'warm':
        default:
            content = <WarmHome photographer={photographer} slug={slug} />;
            break;
    }

    return (
        <>
            {content}
        </>
    );
}
