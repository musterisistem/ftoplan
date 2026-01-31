'use client';

import { useState, useMemo, useEffect } from 'react';
import { Grid, Heart, Check, Image as ImageIcon, Layout, BookOpen, AlertCircle, Loader2, ArrowRight, X, ZoomIn, Info, Lock, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
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
    const [lightboxPhoto, setLightboxPhoto] = useState<any | null>(null);
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

    useEffect(() => {
        if (!isLoading && !loggedInCustomer) {
            const slug = window.location.pathname.split('/')[2];
            if (slug && slug !== 'undefined') {
                router.push(`/studio/${slug}`);
            }
        }
    }, [isLoading, loggedInCustomer, router]);

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

    if (!loggedInCustomer) return null; // Redirect handles it

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

    const handleConfirmSubmit = async () => {
        closePopup();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/customers/${customer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedPhotos,
                    selectionCompleted: true,
                    appointmentStatus: 'fotograflar_secildi',
                    albumStatus: 'tasarim_asamasinda'
                })
            });

            if (res.ok) {
                setPopup({
                    isOpen: true,
                    type: 'success',
                    title: 'Başarılı!',
                    message: selectionSuccessMessage || 'Seçimleriniz başarıyla iletildi! Teşekkür ederiz.',
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
        if (!isValid) return;
        setPopup({
            isOpen: true,
            type: 'confirm',
            title: 'Onaylıyor musunuz?',
            message: 'Seçimlerinizi onaylayıp göndermek istiyor musunuz? Bu işlem geri alınamaz.',
            onConfirm: handleConfirmSubmit
        });
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
                        <div className={`flex justify-between ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}><span>Kapak</span><span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{counts.cover} Adet</span></div>
                        <div className={`flex justify-between ${isPink ? 'text-[#831843]' : 'text-gray-300'}`}><span>Poster</span><span className={`font-bold ${isPink ? 'text-[#831843]' : 'text-white'}`}>{counts.poster} Adet</span></div>
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

                    <div className={`flex items-center justify-between border-t pt-4 ${isPink ? 'border-pink-200/50' : 'border-white/5'}`}>
                        <div className={`flex p-1 rounded-xl border ${subActionBg}`}>
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? filterBtnActive : filterBtnInactive}`}
                            >
                                Hepsi
                            </button>
                            <button
                                onClick={() => setActiveTab('selected')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'selected' ? filterBtnActive : filterBtnInactive}`}
                            >
                                Seçilenler
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || submitting}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isValid
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
                {(activeTab === 'all' ? photos : photos.filter(p => selectedPhotos.find(s => s.url === p.url))).map((photo, i) => {
                    const photoSelections = selectedPhotos.filter(s => s.url === photo.url);
                    const isSelected = photoSelections.length > 0;
                    const isSelectedInActiveCat = photoSelections.some(s => s.type === activeCategory);

                    return (
                        <div
                            key={i}
                            onClick={() => setLightboxPhoto(photo)}
                            className={`group relative aspect-[2/3] md:aspect-square ${gridItemBg} rounded-2xl overflow-hidden cursor-zoom-in transition-all duration-300 ${isSelectedInActiveCat
                                ? `ring-2 ring-offset-2 ${isPink ? 'ring-offset-[#FFFBF0]' : 'ring-offset-black'} ${activeCategory === 'album' ? 'ring-green-500' :
                                    activeCategory === 'cover' ? 'ring-purple-500' : 'ring-orange-500'
                                }`
                                : `hover:opacity-90 hover:ring-1 ${gridItemRingHover}`}`}
                        >
                            <img src={photo.url} alt="Photo" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                {photoSelections.map((sel, idx) => (
                                    <div key={idx} className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase text-white shadow-lg backdrop-blur-md flex items-center gap-1 ${sel.type === 'album' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                                        sel.type === 'cover' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-orange-600 to-red-600'
                                        }`}>
                                        <Check className="w-3 h-3" />
                                        {sel.type}
                                    </div>
                                ))}
                            </div>

                            {isSelectedInActiveCat && (
                                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center`}>
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            )}
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
                {lightboxPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setLightboxPhoto(null)}
                            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-[75vh] flex items-center justify-center"
                        >
                            <img
                                src={lightboxPhoto.url}
                                alt="Seçim"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                            />
                        </motion.div>

                        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
                            {customer.canDownload && (
                                <a
                                    href={lightboxPhoto.url}
                                    download={lightboxPhoto.filename || "foto-plan.jpg"}
                                    onClick={(e) => {
                                        // Stop propagation to prevent closing lightbox
                                        e.stopPropagation();
                                    }}
                                    className="flex items-center gap-3 px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 active:scale-95 uppercase tracking-widest text-sm"
                                >
                                    <Download className="w-5 h-5" />
                                    Fotoğrafı İndir
                                </a>
                            )}
                            <button
                                onClick={() => setLightboxPhoto(null)}
                                className="px-10 py-4 bg-white/5 text-white/70 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/10 backdrop-blur-md"
                            >
                                Pencereyi Kapat
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox kept Dark for better viewing, but updated header if needed? Nah standard dark lightbox is standard. */}
        </div>
    );
}
