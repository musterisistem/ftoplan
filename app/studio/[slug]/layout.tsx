import { getPhotographer } from '@/lib/studioUtils';
import StudioHeader from '@/components/studio/StudioHeader';
import StudioBottomNav from '@/components/studio/StudioBottomNav';
import WhatsAppButton from '@/components/studio/WhatsAppButton';
import { notFound } from 'next/navigation';

export default async function StudioLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const photographer = await getPhotographer(slug);

    if (!photographer) return notFound();

    const primaryColor = photographer.primaryColor || '#8b4d62';
    const theme = photographer.siteTheme || 'warm';

    // Theme-specific background colors
    const getThemeBg = () => {
        switch (theme) {
            case 'playful':
                return 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)';
            case 'bold':
                return '#FDF8F5';
            case 'warm':
            default:
                return 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 30%, #FBEAE3 60%, #FDF8F5 100%)';
        }
    };

    return (
        <div className="min-h-screen font-sans antialiased">
            {/* Global Header with Theme */}
            <StudioHeader
                photographer={photographer}
                primaryColor={primaryColor}
                theme={theme as 'warm' | 'playful' | 'bold'}
            />

            {/* Main Content */}
            <div className="pt-0">
                {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <StudioBottomNav slug={slug} primaryColor={primaryColor} theme={theme} />

            {/* WhatsApp Floating Button */}
            <WhatsAppButton phoneNumber={photographer.whatsapp || ''} />

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Modern scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #FDF8F5; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #E8D5CE; 
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #D4C0B8; 
                }
                
                /* Safe area for bottom nav */
                .pb-safe-area {
                    padding-bottom: env(safe-area-inset-bottom, 20px);
                }

                /* Selection for brand color */
                ::selection {
                    background: ${primaryColor}40;
                    color: inherit;
                }
            ` }} />
        </div>
    );
}
