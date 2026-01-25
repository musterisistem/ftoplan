'use client';

import { useSession, signOut } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Image as ImageIcon, Check, X, ChevronLeft, ChevronRight,
    LogOut, Heart, Send, Loader2, Grid3X3, Square, Sparkles, Star
} from 'lucide-react';

interface Photo {
    url: string;
    filename: string;
}

interface StudioInfo {
    studioName: string;
    primaryColor: string;
    logo: string;
    siteTheme: 'warm' | 'playful' | 'bold';
}

interface CustomerData {
    _id: string;
    brideName: string;
    groomName: string;
    photos: Photo[];
    appointmentStatus: string;
}

export default function PhotoSelectionPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState('');
    const [studioInfo, setStudioInfo] = useState<StudioInfo>({
        studioName: '',
        primaryColor: '#8b4d62',
        logo: '',
        siteTheme: 'warm'
    });
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session || session.user.role !== 'couple') {
            router.push(`/studio/${slug}`);
            return;
        }

        fetchData();
    }, [session, status]);

    const fetchData = async () => {
        try {
            if (session?.user?.customerId) {
                const customerRes = await fetch(`/api/customers/${session.user.customerId}`);
                if (customerRes.ok) {
                    const data: CustomerData = await customerRes.json();
                    setPhotos(data.photos || []);
                    setCustomerName(`${data.brideName}${data.groomName ? ' & ' + data.groomName : ''}`);
                    if (data.appointmentStatus === 'fotograflar_secildi') {
                        setSubmitted(true);
                    }
                }
            }

            const studioRes = await fetch(`/api/studio/${slug}`);
            if (studioRes.ok) {
                const data = await studioRes.json();
                setStudioInfo({
                    studioName: data.studioName || data.name || 'Stüdyo',
                    primaryColor: data.primaryColor || '#8b4d62',
                    logo: data.logo || '',
                    siteTheme: data.siteTheme || 'warm'
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePhotoSelection = (index: number) => {
        const newSelected = new Set(selectedPhotos);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedPhotos(newSelected);
    };

    const handleSubmitSelection = async () => {
        if (selectedPhotos.size === 0) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentStatus: 'fotograflar_secildi' })
            });

            if (res.ok) setSubmitted(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Touch/Swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null || selectedPhoto === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && selectedPhoto < photos.length - 1) setSelectedPhoto(selectedPhoto + 1);
            else if (diff < 0 && selectedPhoto > 0) setSelectedPhoto(selectedPhoto - 1);
        }
        setTouchStart(null);
    };

    const primaryColor = studioInfo.primaryColor;
    const theme = studioInfo.siteTheme;

    // Theme-specific styles
    const getThemeStyles = () => {
        switch (theme) {
            case 'playful':
                return {
                    background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)',
                    badgeIcon: Star,
                    fontFamily: 'inherit',
                    headerBg: 'bg-white',
                    cardStyle: 'rounded-3xl shadow-lg'
                };
            case 'bold':
                return {
                    background: '#FDF8F5',
                    badgeIcon: Sparkles,
                    fontFamily: 'inherit',
                    headerBg: 'bg-white border border-gray-100',
                    cardStyle: 'rounded-3xl shadow-xl border border-gray-100'
                };
            case 'warm':
            default:
                return {
                    background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 25%, #FBEAE3 50%, #FDF8F5 100%)',
                    badgeIcon: Sparkles,
                    fontFamily: 'Georgia, serif',
                    headerBg: 'bg-white/90 backdrop-blur-xl',
                    cardStyle: 'rounded-2xl shadow-lg'
                };
        }
    };

    const styles = getThemeStyles();
    const BadgeIcon = styles.badgeIcon;

    if (status === 'loading' || loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: styles.background }}
            >
                <div className="text-center">
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse"
                        style={{ backgroundColor: `${primaryColor}20` }}
                    >
                        <Heart className="w-8 h-8" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'couple') return null;

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.4s ease-out forwards; }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .photo-item { animation: fade-up 0.4s ease-out forwards; opacity: 0; }
                .script-font { font-family: 'Dancing Script', cursive; }
            ` }} />

            <div
                className="min-h-screen pb-32"
                style={{ background: styles.background }}
            >
                {/* Hero Banner */}
                <div className="pt-20 pb-8 px-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${theme === 'playful' ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'} rounded-full shadow-sm mb-4 animate-fade-up`}>
                        <BadgeIcon className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-700">Fotoğraf Seçimi</span>
                    </div>
                    <h1
                        className="text-3xl font-bold text-gray-900 mb-2 animate-fade-up"
                        style={{ fontFamily: styles.fontFamily, animationDelay: '0.1s' }}
                    >
                        {theme === 'playful' ? (
                            <span className="script-font italic" style={{ color: primaryColor }}>{customerName}</span>
                        ) : (
                            customerName
                        )}
                    </h1>
                    <p className="text-gray-600 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        Albümünüz için en güzel fotoğrafları seçin
                    </p>
                </div>

                {/* Stats Bar */}
                <div className={`sticky top-[60px] z-30 ${styles.headerBg} border-y border-gray-100 px-4 py-3 mx-4 ${styles.cardStyle} mb-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                                style={{ backgroundColor: selectedPhotos.size > 0 ? primaryColor : '#9ca3af' }}
                            >
                                {selectedPhotos.size}
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-900">Seçilen</span>
                                <p className="text-xs text-gray-500">{photos.length} fotoğraftan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                            >
                                <Grid3X3 className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setViewMode('single')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'single' ? 'bg-white shadow' : ''}`}
                            >
                                <Square className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {submitted && (
                    <div className={`mx-4 mb-4 p-6 ${styles.cardStyle} bg-white text-center animate-scale-in`}>
                        <div
                            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-float"
                            style={{ backgroundColor: '#dcfce7' }}
                        >
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Seçiminiz Kaydedildi!</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Fotoğraflarınız fotoğrafçınıza iletildi.
                        </p>
                    </div>
                )}

                {/* No Photos */}
                {photos.length === 0 && (
                    <div className="text-center py-16 px-6 animate-fade-up">
                        <div
                            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                            style={{ backgroundColor: `${primaryColor}15` }}
                        >
                            <ImageIcon className="w-12 h-12" style={{ color: primaryColor }} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Henüz Fotoğraf Yok</h2>
                        <p className="text-gray-500">Çekim tamamlandıktan sonra fotoğraflarınız burada görünecektir.</p>
                    </div>
                )}

                {/* Photo Grid */}
                {photos.length > 0 && (
                    <div className={`px-4 grid gap-2 ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className={`photo-item relative overflow-hidden ${theme === 'bold' ? 'rounded-3xl' : 'rounded-2xl'} bg-white shadow-lg cursor-pointer group ${viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'
                                    } ${selectedPhotos.has(index) ? 'ring-4' : ''}`}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    boxShadow: selectedPhotos.has(index) ? `0 0 0 4px ${primaryColor}` : undefined
                                }}
                                onClick={() => viewMode === 'grid' ? setSelectedPhoto(index) : togglePhotoSelection(index)}
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Selection Checkbox */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); togglePhotoSelection(index); }}
                                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${selectedPhotos.has(index) ? 'text-white' : 'bg-white/90 border border-gray-200'
                                        }`}
                                    style={selectedPhotos.has(index) ? { backgroundColor: primaryColor } : {}}
                                >
                                    {selectedPhotos.has(index) && <Check className="w-5 h-5" />}
                                </button>

                                {/* Number Badge - Bold theme style */}
                                {theme === 'bold' ? (
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-3xl font-bold text-white/30">{String(index + 1).padStart(2, '0')}</span>
                                    </div>
                                ) : (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
                                        <span className="text-white text-xs font-medium">{index + 1}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                {selectedPhoto !== null && (
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-fade-in"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="flex items-center justify-between p-4 text-white">
                            <button onClick={() => setSelectedPhoto(null)} className="p-2 hover:bg-white/10 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                            <span className="text-sm">{selectedPhoto + 1} / {photos.length}</span>
                            <button
                                onClick={() => togglePhotoSelection(selectedPhoto)}
                                className={`p-2 rounded-xl ${selectedPhotos.has(selectedPhoto) ? 'text-white' : 'border border-white/30'}`}
                                style={selectedPhotos.has(selectedPhoto) ? { backgroundColor: primaryColor } : {}}
                            >
                                {selectedPhotos.has(selectedPhoto) ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center px-4 relative">
                            <img src={photos[selectedPhoto].url} alt="" className="max-w-full max-h-full object-contain" />

                            {selectedPhoto > 0 && (
                                <button
                                    onClick={() => setSelectedPhoto(selectedPhoto - 1)}
                                    className="hidden md:flex absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}
                            {selectedPhoto < photos.length - 1 && (
                                <button
                                    onClick={() => setSelectedPhoto(selectedPhoto + 1)}
                                    className="hidden md:flex absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        <div className="p-4 flex justify-center">
                            <button
                                onClick={() => togglePhotoSelection(selectedPhoto)}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all"
                                style={{ backgroundColor: selectedPhotos.has(selectedPhoto) ? primaryColor : 'rgba(255,255,255,0.1)' }}
                            >
                                {selectedPhotos.has(selectedPhoto) ? <><Check className="w-5 h-5" /> Seçildi</> : <><Heart className="w-5 h-5" /> Seç</>}
                            </button>
                        </div>
                        <p className="text-center text-white/50 text-xs pb-4 md:hidden">← Kaydırarak gezinin →</p>
                    </div>
                )}

                {/* Submit Bar */}
                {photos.length > 0 && !submitted && (
                    <div
                        className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 z-40"
                        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                    >
                        <button
                            onClick={handleSubmitSelection}
                            disabled={selectedPhotos.size === 0 || submitting}
                            className={`w-full max-w-md mx-auto block py-4 ${theme === 'bold' ? 'rounded-full' : 'rounded-full'} font-semibold text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                            style={{ backgroundColor: selectedPhotos.size > 0 ? primaryColor : '#9ca3af' }}
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {submitting ? 'Gönderiliyor...' : `Seçimi Gönder (${selectedPhotos.size})`}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
