import { getPhotographer } from '@/lib/studioUtils';
import StudioBottomNav from '@/components/studio/StudioBottomNav';
import WhatsAppButton from '@/components/studio/WhatsAppButton';
import StudioTopNav from '@/components/studio/StudioTopNav';
import { notFound } from 'next/navigation';
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // CHECK EXPIRY
    const isExpired = photographer.subscriptionExpiry ? new Date(photographer.subscriptionExpiry) < new Date() : false;

    if (isExpired) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Hizmet Süresi Dolmuştur</h1>
                    <p className="text-gray-600 mb-6">
                        Bu web sitesinin yayın süresi sona ermiştir. Lütfen stüdyo yetkilisi ile iletişime geçiniz.
                    </p>
                    <div className="text-xs text-gray-400">
                        {photographer.studioName}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CustomerAuthProvider>
            <div className="min-h-screen font-sans antialiased">
                {/* Trial Warning Banner for Clients */}
                {photographer.packageType === 'trial' && (
                    <div className="bg-orange-600 text-white text-xs font-medium py-1.5 text-center px-4 shadow-md relative z-50">
                        <p>⚠️ Bu web sitesi <strong>Deneme Sürümü</strong> modundadır ve geçici olarak yayındadır.</p>
                    </div>
                )}

                {/* Global Top Navigation */}
                <StudioTopNav studioName={photographer.studioName} logo={photographer.logo} theme={theme} slug={slug} />

                {/* Main Content */}
                <div className="pt-0 pb-20">
                    {children}
                </div>

                {/* Mobile Bottom Navigation */}
                <StudioBottomNav slug={slug} primaryColor={primaryColor} theme={theme} />

                {/* WhatsApp Floating Button */}
                <WhatsAppButton phoneNumber={photographer.whatsapp || photographer.phone || ''} />

                <style dangerouslySetInnerHTML={{
                    __html: `
                /* Modern scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #1a1a1a; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #333; 
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #444; 
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

                /* Global Background Color based on Theme */
                body, html {
                    background-color: ${theme === 'playful' || theme === 'bold' ? '#ffffff' : '#0a0a0a'};
                    color: ${theme === 'playful' || theme === 'bold' ? '#111' : '#fff'};
                }
            ` }} />
            </div>
        </CustomerAuthProvider>
    );
}
