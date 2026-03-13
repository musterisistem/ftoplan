'use client';

import { useState, useMemo, useEffect } from 'react';
import { Grid, Heart, Check, Image as ImageIcon, Layout, BookOpen, AlertCircle, Loader2, ArrowRight, X, ZoomIn, ZoomOut, Info, Lock, Download, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useRouter } from 'next/navigation';

interface SelectionClientProps {
    customer: any;
    photos: any[];
    selectionSuccessMessage?: string;
    theme?: string; // Added theme prop
}

type CategoryType = 'album' | 'cover' | 'poster';

export default function SelectionClient({ customer, photos, selectionSuccessMessage, theme = 'warm' }: SelectionClientProps) {
    const { customer: loggedInCustomer, isLoading } = useCustomerAuth();
    const router = useRouter();

    const [selectedPhotos, setSelectedPhotos] = useState<any[]>(customer.selectedPhotos || []);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'selected'>('all');
    const [activeCategory, setActiveCategory] = useState<CategoryType>('album');
    const [zoomedCover, setZoomedCover] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isDownloadingZip, setIsDownloadingZip] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // New states for Cover Selection Phase
    const [phase, setPhase] = useState<'photos' | 'cover'>('photos');
    const [selectedAlbumCover, setSelectedAlbumCover] = useState<{name: string, imageUrl: string} | null>(customer.selectedAlbumCover || null);

    // Get the photos being currently viewed (all or selected)
    const displayedPhotos = useMemo(() => {
        return activeTab === 'all'
            ? photos
            : photos.filter(p => selectedPhotos.find(s => s.url === p.url && s.type === activeCategory));
    }, [activeTab, photos, selectedPhotos, activeCategory]);
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        type: 'warning' | 'confirm' | 'success' | 'error';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
    });

    const isPink = theme === 'light';

    // Theme Styles
    const stickyHeaderBg = isPink ? 'bg-[#FFFBF0]/90 border-pink-200 ring-pink-100' : 'bg-black/80 border-white/10 ring-white/5';
    const tabBase = isPink
        ? 'bg-white/60 border-pink-100 text-[#831843]/60 hover:bg-white hover:border-pink-200'
        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20';

    const subActionBg = isPink ? 'bg-white/60 border-pink-100' : 'bg-white/5 border-white/5';
    const filterBtnActive = isPink ? 'bg-[#831843] text-white shadow-lg' : 'bg-white text-black shadow-lg';
    const filterBtnInactive = isPink ? 'text-[#831843]/60 hover:text-[#831843]' : 'text-gray-400 hover:text-white';

    // Grid Item
    const gridItemBg = isPink ? 'bg-[#FFF0F5]' : 'bg-gray-900';
    const gridItemRingHover = isPink ? 'hover:ring-pink-300' : 'hover:ring-white/20';

    // Popup
    const popupBg = isPink ? 'bg-white border-pink-100' : 'bg-[#111] border-white/10';
    const popupText = isPink ? 'text-[#831843]' : 'text-white';
    const popupSubText = isPink ? 'text-[#9D174D]/70' : 'text-gray-400';


    // Limits
    const limits = customer.selectionLimits || { album: 22, cover: 1, poster: 1 };
    const counts = useMemo(() => {
        return {
            album: selectedPhotos.filter(p => p.type === 'album').length,
            cover: selectedPhotos.filter(p => p.type === 'cover').length,
            poster: selectedPhotos.filter(p => p.type === 'poster').length,
        };
    }, [selectedPhotos]);

    const isValid =
        counts.album === limits.album &&
        counts.cover === limits.cover &&
        counts.poster === limits.poster;

    const remaining = {
        album: limits.album - counts.album,
        cover: limits.cover - counts.cover,
        poster: limits.poster - counts.poster,
    };

    // Redundant client-side redirect removed since SelectionPage server component handles authentication

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${isPink ? 'text-[#831843]' : 'text-white'}`} />
                    <p className={isPink ? 'text-[#9D174D]' : 'text-gray-400'}>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!customer) return null;

    const closePopup = () => setPopup(prev => ({ ...prev, isOpen: false }));

    const toggleSelection = (photo: any, targetType: CategoryType) => {
        const existingIndex = selectedPhotos.findIndex(p => p.url === photo.url && p.type === targetType);
        if (existingIndex >= 0) {
            const newSelections = [...selectedPhotos];
            newSelections.splice(existingIndex, 1);
            setSelectedPhotos(newSelections);
            return;
        }
        if (remaining[targetType] <= 0) {
            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Limit Doldu',
                message: `Bu kategori için seçim limitiniz doldu! (${limits[targetType]} adet)`,
            });
            return;
        }
        setSelectedPhotos([...selectedPhotos, {
            url: photo.url,
            filename: photo.filename,
            type: targetType
        }]);
    };

    const handleDownloadZip = async () => {
        if (photos.length === 0) return;
        setIsDownloadingZip(true);
        setDownloadProgress(0);

        try {
            const zip = new JSZip();
            const folder = zip.folder("Album_Fotograflari");

            const fetchPhoto = async (photo: any, idx: number) => {
                try {
                    const response = await fetch(photo.url);
                    const blob = await response.blob();
                    const filename = photo.filename || `foto_${idx + 1}.jpg`;
                    folder?.file(filename, blob);
                } catch (err) {
                    console.error("Fotoğraf indirilemedi:", photo.url, err);
                }
            };

            const chunkSize = 5; // Download 5 photos at a time to prevent memory issues
            for (let i = 0; i < photos.length; i += chunkSize) {
                const chunk = photos.slice(i, i + chunkSize);
                await Promise.all(chunk.map((photo, idx) => fetchPhoto(photo, i + idx)));
                setDownloadProgress(Math.round(((i + chunk.length) / photos.length) * 100));
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            saveAs(zipContent, `album_fotograflari.zip`);

            setPopup({
                isOpen: true,
                type: 'success',
                title: 'İndirme Tamamlandı',
                message: 'Tüm fotoğraflar başarıyla indirildi.',
            });
        } catch (error) {
            console.error("ZIP oluşturma hatası:", error);
            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Hata',
                message: 'Fotoğraflar indirilirken bir hata oluştu.',
            });
        } finally {
            setIsDownloadingZip(false);
            setDownloadProgress(0);
        }
    };

    const handleConfirmSubmit = async () => {
        closePopup();
        
        const hasCoverProvider = !!(customer.albumProviderId) && !customer.isCoverSelectionCompleted;
        
        // If finishing the photo phase and we have a cover step, go to cover step
        if (phase === 'photos' && hasCoverProvider) {
            setPhase('cover');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Final submit (either from direct submit without provider, or from cover phase)
        setSubmitting(true);
        try {
            const payload: any = {
                selectedPhotos,
                selectionCompleted: true,
                appointmentStatus: 'fotograflar_secildi',
                albumStatus: 'tasarim_asamasinda',
                source: 'customer'   // Bildirim sadece müşteri aksiyonuyla tetiklenir
            };

            if (selectedAlbumCover) {
                payload.selectedAlbumCover = selectedAlbumCover;
                payload.isCoverSelectionCompleted = true;
            }

            const res = await fetch(`/api/customers/${customer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setPopup({
                    isOpen: true,
                    type: 'success',
                    title: 'Seçiminiz Tamamlandı!',
                    message: selectionSuccessMessage || 'Seçiminiz tamamlandı, teşekkürler. Ürününüz en kısa sürede hazırlanacaktır.',
                    onConfirm: () => window.location.reload()
                });
            } else {
                throw new Error('Gönderim başarısız.');
            }
        } catch (err) {
            setPopup({
                isOpen: true,
                type: 'error',
                title: 'Hata',
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (phase === 'photos') {
            if (!isValid) return;
            // Go to cover phase if albumProviderId is assigned and cover selection not yet done
            const hasCoverProvider = !!(customer.albumProviderId) && !customer.isCoverSelectionCompleted;
            
            if (hasCoverProvider) {
                // Go directly to cover selection phase — no popup needed
                setPhase('cover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // No cover step: show a confirm popup before submitting
            setPopup({
                isOpen: true,
                type: 'confirm',
                title: 'Onaylıyor musunuz?',
                message: 'Seçimlerinizi onaylayıp göndermek istiyor musunuz? Bu işlem geri alınamaz.',
                onConfirm: handleConfirmSubmit
            });
        } else {
            // Cover phase submit
            const provider = typeof customer.albumProviderId === 'object' ? customer.albumProviderId : null;
            const covers = provider?.covers || [];

            // Only require selection if covers actually exist
            if (covers.length > 0 && !selectedAlbumCover) {
                setPopup({
                    isOpen: true,
                    type: 'warning',
                    title: 'Seçim Yapmadınız',
                    message: 'Lütfen tasarımına karar verdiğiniz kapak modelini seçin.',
                });
                return;
            }
            setPopup({
                isOpen: true,
                type: 'confirm',
                title: 'Siparişi Tamamla',
                message: 'Albüm kapağı dahil tüm seçimlerinizi onaylayıp göndermek istiyor musunuz?',
                onConfirm: handleConfirmSubmit
            });
        }
    };

    if (customer.selectionCompleted) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center px-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isPink ? 'bg-green-100 text-green-600' : 'bg-green-500/10 text-green-500'}`}>
                    <Check className="w-12 h-12" />
                </div>
                <h1 className={`text-4xl font-bold font-syne mb-4 ${isPink ? 'text-[#831843]' : 'text-white'}`}>Seçimleriniz Onaylandı</h1>
                <p className={`${isPink ? 'text-[#9D174D]' : 'text-gray-400'} text-lg mb-8 max-w-2xl mx-auto leading-relaxed`}>
                    {selectionSuccessMessage || "Fotoğraf seçim işleminiz tamamlanmıştır. Albüm tasarım süreciniz başlamıştır."}
                </p>
                <div className={`${isPink ? 'bg-white border border-pink-100 shadow-xl shadow-pink-100' : 'bg-[#111]'} p-6 rounded-2xl inline-block text-left min-w-[300px]`}>
                    <h3 className={`${isPink ? 'text-[#831843]/60' : 'text-gray-500'} text-xs font-bold uppercase tracking-widest mb-4`}>Özet</h3>
                    <div className="space-y-3">
                        <div className={`flex justify-between ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}><span>Albüm</span><span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{counts.album} Adet</span></div>
                        <div className={`flex justify-between ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}><span>İç Kapak Fotoğrafı</span><span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{counts.cover} Adet</span></div>
                        <div className={`flex justify-between ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}><span>Poster</span><span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{counts.poster} Adet</span></div>
                        {(customer.selectedAlbumCover || customer.isCoverSelectionCompleted) && (
                            <div className={`flex justify-between border-t ${isPink ? 'border-pink-100 pt-3' : 'border-gray-800 pt-3'} ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}>
                                <span>Albüm Kapak Modeli</span>
                                <span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{customer.selectedAlbumCover?.name || 'Seçildi'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const getCategoryConfig = (cat: CategoryType) => {
        switch (cat) {
            case 'album': return { label: 'ALBÜM', color: 'green', gradient: 'from-green-600 to-emerald-600', icon: BookOpen };
            case 'cover': return { label: 'KAPAK', color: 'purple', gradient: 'from-purple-600 to-indigo-600', icon: Layout };
            case 'poster': return { label: 'POSTER', color: 'orange', gradient: 'from-orange-600 to-red-600', icon: ImageIcon };
        }
    };

    const currentCatConfig = getCategoryConfig(activeCategory);

    // --- Cover Selection UI Phase ---
    if (phase === 'cover' && customer.albumProviderId) {
        const provider = typeof customer.albumProviderId === 'object' ? customer.albumProviderId : null;
        const covers = provider?.covers || [];
        const providerName = provider?.name || 'Albüm Kapak Seçimi';

        return (
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="text-center mb-8">
                    <h2 className={`text-2xl md:text-3xl font-bold font-syne mb-2 ${isPink ? 'text-[#831843]' : 'text-white'}`}>Albüm Kapak Modeli Seçimi</h2>
                    <p className={`text-base ${isPink ? 'text-[#9D174D]/70' : 'text-gray-400'}`}>
                        Fotoğraf seçimlerinizi tamamladınız. Şimdi lütfen albüm kapağı modelini seçin.
                    </p>
                </div>

                <div className={`sticky top-20 z-30 backdrop-blur-xl border rounded-2xl p-4 mb-6 shadow-2xl ring-1 flex justify-end items-center ${stickyHeaderBg}`}>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${(selectedAlbumCover || covers.length === 0)
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30'
                            : (isPink ? 'bg-pink-50 text-pink-300 cursor-not-allowed border border-pink-100' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5')
                            }`}
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        SİPARİŞİ TAMAMLA
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {covers.map((cover: any, i: number) => {
                        const isCoverSelected = selectedAlbumCover?.imageUrl === cover.imageUrl;
                        
                        return (
                            <div 
                                key={i} 
                                onClick={() => setSelectedAlbumCover({ name: cover.name, imageUrl: cover.imageUrl })}
                                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${gridItemBg} ${isCoverSelected
                                    ? `ring-4 ring-offset-2 ${isPink ? 'ring-green-500 ring-offset-[#FFFBF0]' : 'ring-green-500 ring-offset-black'} scale-[1.02]`
                                    : `hover:opacity-90 hover:ring-2 ${gridItemRingHover}`}`}
                            >
                                <div className="aspect-[4/3] flex items-center justify-center p-2">
                                    <img 
                                        src={cover.imageUrl} 
                                        alt={cover.name} 
                                        className="w-full h-full object-cover rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110" 
                                    />
                                </div>
                                
                                {/* Zoom Button Overlay */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setZoomedCover(cover.imageUrl);
                                    }}
                                    className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
                                </button>

                                <div className={`p-4 border-t text-center relative ${isPink ? 'border-pink-100 bg-white/50' : 'border-white/5 bg-black/50'}`}>
                                    <h4 className={`text-sm font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{cover.name}</h4>
                                    
                                    {isCoverSelected && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Seçildi
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                
                <AnimatePresence>
                    {popup.isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[2100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className={`${popupBg} border p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden`}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${popup.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                    popup.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                        popup.type === 'confirm' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                    {popup.type === 'error' && <AlertCircle className="w-8 h-8" />}
                                    {popup.type === 'success' && <Check className="w-8 h-8" />}
                                    {popup.type === 'confirm' && <Info className="w-8 h-8" />}
                                    {popup.type === 'warning' && <AlertCircle className="w-8 h-8" />}
                                </div>

                                <h3 className={`text-xl font-bold text-center mb-2 font-syne ${popupText}`}>{popup.title}</h3>
                                <p className={`${popupSubText} text-center text-sm mb-8`}>{popup.message}</p>

                                <div className="flex gap-3">
                                    {popup.type === 'confirm' ? (
                                        <>
                                            <button
                                                onClick={closePopup}
                                                className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${isPink ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                            >
                                                Vazgeç
                                            </button>
                                            <button
                                                onClick={popup.onConfirm}
                                                className={`flex-1 py-3.5 rounded-xl font-bold transition-colors shadow-lg ${isPink ? 'bg-[#831843] text-white hover:bg-[#9D174D]' : 'bg-white text-black hover:bg-gray-200'}`}
                                            >
                                                Onayla
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                closePopup();
                                                if (popup.onConfirm) popup.onConfirm();
                                            }}
                                            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-white to-gray-200 text-black hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
                                        >
                                            Tamam
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cover Zoom Modal */}
                <AnimatePresence>
                    {zoomedCover && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        >
                            <button
                                onClick={() => setZoomedCover(null)}
                                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <div className="w-full h-full p-4 flex items-center justify-center">
                                <TransformWrapper initialScale={1} minScale={0.5} maxScale={4} centerOnInit>
                                    <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                        <img
                                            src={zoomedCover}
                                            alt="Zoomed Cover"
                                            className="max-w-full max-h-[90vh] object-contain cursor-grab active:cursor-grabbing rounded-xl shadow-2xl"
                                            draggable={false}
                                        />
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
    // --- End of Cover Selection UI Phase ---

    return (
        <div className="max-w-7xl mx-auto px-4 pb-24">
            <div className={`sticky top-20 z-30 backdrop-blur-xl border rounded-2xl p-4 mb-6 shadow-2xl ring-1 ${stickyHeaderBg}`}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {(['album', 'cover', 'poster'] as CategoryType[]).map((cat) => {
                            const config = getCategoryConfig(cat);
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all min-w-[150px] relative overflow-hidden group ${isActive
                                        ? `bg-gradient-to-r ${config.gradient} border-transparent text-white shadow-lg shadow-${config.color}-500/25`
                                        : tabBase
                                        }`}
                                >
                                    <config.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : (isPink ? `text-${config.color}-500/70` : `text-${config.color}-400`)}`} />
                                    <div className="flex flex-col text-left relative z-10">
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{config.label}</span>
                                        <span className={`text-sm font-bold ${isActive ? 'text-white' : (isPink ? 'text-[#831843]/80' : 'text-gray-300')}`}>{counts[cat]} / {limits[cat]}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className={`flex flex-col md:flex-row items-center justify-between border-t pt-4 gap-4 ${isPink ? 'border-pink-200/50' : 'border-white/5'}`}>
                        <div className="flex flex-wrap gap-3 items-center justify-center w-full md:w-auto">
                            <div className={`flex p-1 rounded-xl border w-full sm:w-auto ${subActionBg}`}>
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'all' ? filterBtnActive : filterBtnInactive}`}
                                >
                                    Hepsi
                                </button>
                                <button
                                    onClick={() => setActiveTab('selected')}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'selected' ? filterBtnActive : filterBtnInactive}`}
                                >
                                    Seçilenler
                                </button>
                            </div>
                            {customer.canDownload && (
                                <button
                                    onClick={handleDownloadZip}
                                    disabled={isDownloadingZip}
                                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border shadow-sm ${isPink
                                            ? 'bg-white border-pink-200 text-[#831843] hover:bg-pink-50 hover:border-pink-300'
                                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isDownloadingZip ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                                    <span>
                                        {isDownloadingZip ? `İndiriliyor... ${downloadProgress}%` : 'Tüm Albümü İndir'}
                                    </span>
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || submitting}
                            className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${isValid
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105'
                                : (isPink ? 'bg-pink-50 text-pink-300 cursor-not-allowed border border-pink-100' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5')
                                }`}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            GÖNDER
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {displayedPhotos.map((photo, i) => {
                    const photoSelections = selectedPhotos.filter(s => s.url === photo.url);
                    const isSelected = photoSelections.length > 0;
                    const isSelectedInActiveCat = photoSelections.some(s => s.type === activeCategory);

                    return (
                        <div key={i} className="flex flex-col gap-2">
                            <div
                                onClick={() => setLightboxIndex(i)}
                                className={`group relative aspect-[2/3] md:aspect-square ${gridItemBg} rounded-2xl overflow-hidden cursor-zoom-in transition-all duration-300 ${isSelectedInActiveCat
                                    ? `ring-2 ring-offset-2 ${isPink ? 'ring-offset-[#FFFBF0]' : 'ring-offset-black'} ${activeCategory === 'album' ? 'ring-green-500' :
                                        activeCategory === 'cover' ? 'ring-purple-500' : 'ring-orange-500'
                                    }`
                                    : `hover:opacity-90 hover:ring-1 ${gridItemRingHover}`}`}
                            >
                                <img src={photo.url} alt="Seçim" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
                                    {photoSelections.map((sel, idx) => (
                                        <div key={idx} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase text-white shadow-lg backdrop-blur-md flex items-center gap-1 ${sel.type === 'album' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                                            sel.type === 'cover' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-orange-600 to-red-600'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                            {sel.type}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fast Selection Toggle Button under image */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(photo, activeCategory);
                                }}
                                className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${isSelectedInActiveCat
                                        ? `bg-gradient-to-r ${currentCatConfig.gradient} text-white shadow-lg shadow-${currentCatConfig.color}-500/25`
                                        : (isPink ? 'bg-white border border-pink-100 text-[#831843]/70 hover:bg-pink-50' : 'bg-[#111] text-gray-400 border border-white/5 hover:bg-white/5 hover:text-white')
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelectedInActiveCat ? 'border-white/30 bg-white/20' : (isPink ? 'border-pink-200' : 'border-gray-600')
                                    }`}>
                                    {isSelectedInActiveCat && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {isSelectedInActiveCat ? 'Seçildi' : 'Seç'}
                            </button>
                        </div>
                    )
                })}
            </div>

            <AnimatePresence>
                {popup.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={`${popupBg} border p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${popup.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                popup.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                    popup.type === 'confirm' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                {popup.type === 'error' && <AlertCircle className="w-8 h-8" />}
                                {popup.type === 'success' && <Check className="w-8 h-8" />}
                                {popup.type === 'confirm' && <Info className="w-8 h-8" />}
                                {popup.type === 'warning' && <AlertCircle className="w-8 h-8" />}
                            </div>

                            <h3 className={`text-xl font-bold text-center mb-2 font-syne ${popupText}`}>{popup.title}</h3>
                            <p className={`${popupSubText} text-center text-sm mb-8`}>{popup.message}</p>

                            <div className="flex gap-3">
                                {popup.type === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={closePopup}
                                            className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${isPink ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                        >
                                            Vazgeç
                                        </button>
                                        <button
                                            onClick={popup.onConfirm}
                                            className={`flex-1 py-3.5 rounded-xl font-bold transition-colors shadow-lg ${isPink ? 'bg-[#831843] text-white hover:bg-[#9D174D]' : 'bg-white text-black hover:bg-gray-200'}`}
                                        >
                                            Onayla
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            closePopup();
                                            if (popup.onConfirm) popup.onConfirm();
                                        }}
                                        className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-white to-gray-200 text-black hover:scale-[1.02] transition-transform shadow-lg shadow-white/10"
                                    >
                                        Tamam
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox Implementation */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                    >
                        {/* Top Controls */}
                        <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-start z-50">
                            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-mono text-sm">
                                {lightboxIndex + 1} / {displayedPhotos.length}
                            </div>
                            <button
                                onClick={() => setLightboxIndex(null)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Arrows */}
                        {lightboxIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md z-50 hidden md:flex"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                        )}
                        {lightboxIndex < displayedPhotos.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur-md z-50 hidden md:flex"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        )}

                        {/* Photo Container with Zoom */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center my-auto mt-16 md:mt-auto"
                            // Swipe Support for mobile
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -100 && lightboxIndex < displayedPhotos.length - 1) {
                                    setLightboxIndex(lightboxIndex + 1);
                                } else if (swipe > 100 && lightboxIndex > 0) {
                                    setLightboxIndex(lightboxIndex - 1);
                                }
                            }}
                        >
                            <TransformWrapper
                                initialScale={1}
                                minScale={1}
                                maxScale={4}
                                centerOnInit
                                wheel={{ step: 0.1 }}
                            >
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                    <>
                                        {/* Zoom Controls */}
                                        <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-24 flex flex-col gap-2 z-50">
                                            <button onClick={() => zoomIn(0.5)} className="p-2.5 md:p-3 bg-black/50 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all">
                                                <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                            <button onClick={() => resetTransform()} className="p-2.5 md:p-3 bg-black/50 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all font-mono text-[10px] md:text-xs font-bold leading-none flex items-center justify-center">
                                                1X
                                            </button>
                                            <button onClick={() => zoomOut(0.5)} className="p-2.5 md:p-3 bg-black/50 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all">
                                                <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>
                                        <TransformComponent wrapperClass="w-full h-full flex items-center justify-center" contentClass="w-full h-full flex items-center justify-center">
                                            <div className="w-full h-full px-4 md:px-12 pb-24 md:pb-0 flex items-center justify-center">
                                                <img
                                                    src={displayedPhotos[lightboxIndex].url}
                                                    alt="Seçim Önizleme"
                                                    className="max-w-[95%] max-h-[95%] md:max-w-[85%] md:max-h-[85%] object-contain rounded-lg drop-shadow-2xl select-none"
                                                    draggable={false}
                                                />
                                            </div>
                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                        </motion.div>

                        {/* Bottom Actions */}
                        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-50 px-4 pb-safe">
                            <div className="bg-black/80 md:bg-black/60 backdrop-blur-xl border border-white/10 p-2 md:p-2 rounded-2xl md:rounded-3xl flex gap-2 items-center w-full sm:w-auto overflow-x-auto scrollbar-hide">
                                {(() => {
                                    const currentPhoto = displayedPhotos[lightboxIndex];
                                    const isSelectedInActiveCat = selectedPhotos.some(s => s.url === currentPhoto.url && s.type === activeCategory);

                                    return (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelection(currentPhoto, activeCategory);
                                            }}
                                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm uppercase tracking-widest transition-all whitespace-nowrap ${isSelectedInActiveCat
                                                    ? `bg-gradient-to-r ${currentCatConfig.gradient} text-white shadow-lg shadow-${currentCatConfig.color}-500/30`
                                                    : 'bg-white text-black hover:bg-gray-200'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelectedInActiveCat ? 'border-white/50 bg-white/20' : 'border-black/20'
                                                }`}>
                                                <Check className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isSelectedInActiveCat ? 'text-white' : 'text-transparent'}`} />
                                            </div>
                                            {isSelectedInActiveCat ? `${currentCatConfig.label} SEÇİLDİ` : `${currentCatConfig.label} SEÇ`}
                                        </button>
                                    );
                                })()}

                                {customer.canDownload && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                const url = displayedPhotos[lightboxIndex].url;
                                                const filename = displayedPhotos[lightboxIndex].filename || "foto-plan.jpg";

                                                // Fetch the file directly as a Blob to enforce download without opening new tab
                                                const response = await fetch(url);
                                                const blob = await response.blob();
                                                saveAs(blob, filename);

                                            } catch (error) {
                                                console.error("Single file download failed", error);
                                            }
                                        }}
                                        className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/10 border border-white/10 text-white hover:bg-white/20 rounded-xl md:rounded-2xl transition-all"
                                        title="Bu Fotoğrafı İndir"
                                    >
                                        <Download className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox kept Dark for better viewing, but updated header if needed? Nah standard dark lightbox is standard. */}
        </div>
    );
}
