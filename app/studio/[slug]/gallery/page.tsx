import { getPhotographer, getAllStudioPhotos } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Theme-specific gallery components
import WarmGallery from '@/components/studio/themes/warm/WarmGallery';
import PlayfulGallery from '@/components/studio/themes/playful/PlayfulGallery';
import BoldGallery from '@/components/studio/themes/bold/BoldGallery';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);
    if (!photographer) return { title: 'Galeri' };
    return { title: `Galeri | ${photographer.studioName}` };
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const theme = photographer.siteTheme || 'warm';
    const allPhotos = await getAllStudioPhotos(photographer._id);

    const props = { photographer, photos: allPhotos, slug };

    switch (theme) {
        case 'playful':
            return <PlayfulGallery {...props} />;
        case 'bold':
            return <BoldGallery {...props} />;
        case 'warm':
        default:
            return <WarmGallery {...props} />;
    }
}
