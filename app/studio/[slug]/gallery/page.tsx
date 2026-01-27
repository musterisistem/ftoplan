import { getPhotographer, getAllStudioPhotos } from '@/lib/studioUtils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Theme-specific gallery components
import WarmGallery from '@/components/studio/themes/warm/WarmGallery';

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

    const allPhotos = await getAllStudioPhotos(photographer._id);
    const props = { photographer, photos: allPhotos, slug };

    return <WarmGallery {...props} />;
}
