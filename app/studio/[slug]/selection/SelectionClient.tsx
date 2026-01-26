'use client';

import { useState, useMemo } from 'react';
import { Grid, Heart, Check, Image as ImageIcon, Layout, BookOpen, AlertCircle, Loader2, ArrowRight, X, ZoomIn, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface SelectionClientProps {
    customer: any;
    photos: any[];
}

type CategoryType = 'album' | 'cover' | 'poster';

export default function SelectionClient({ customer, photos }: SelectionClientProps) {
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>(customer.selectedPhotos || []);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'selected'>('all');

    // New State for Lightbox & Active Category
    const [activeCategory, setActiveCategory] = useState<CategoryType>('album');
    const [lightboxPhoto, setLightboxPhoto] = useState<any | null>(null);

    // Limits
    const limits = customer.selectionLimits || { album: 22, cover: 1, poster: 1 };

    // Derived Counts
    const counts = useMemo(() => {
        return {
            album: selectedPhotos.filter(p => p.type === 'album').length,
            cover: selectedPhotos.filter(p => p.type === 'cover').length,
            poster: selectedPhotos.filter(p => p.type === 'poster').length,
        };
    }, [selectedPhotos]);

    // Validation
    const isValid =
        counts.album === limits.album &&
        counts.cover === limits.cover &&
        counts.poster === limits.poster;

    const remaining = {
        album: limits.album - counts.album,
        cover: limits.cover - counts.cover,
        poster: limits.poster - counts.poster,
    };

    // Popup State
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

    // Helper to close popup
    const closePopup = () => setPopup(prev => ({ ...prev, isOpen: false }));

    const toggleSelection = (photo: any, targetType: CategoryType) => {
        // Find index of exact match (URL + Type)
        const existingIndex = selectedPhotos.findIndex(p => p.url === photo.url && p.type === targetType);

        // If exists, remove it
        if (existingIndex >= 0) {
            const newSelections = [...selectedPhotos];
            newSelections.splice(existingIndex, 1);
            setSelectedPhotos(newSelections);
            return;
        }

        // If trying to add but limit reached
        if (remaining[targetType] <= 0) {
            setPopup({
                isOpen: true,
                type: 'warning',
                title: 'Limit Doldu',
                message: `Bu kategori için seçim limitiniz doldu! (${limits[targetType]} adet)`,
            });
            return;
        }

        // Add new selection
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
                    message: 'Seçimleriniz başarıyla iletildi! Teşekkür ederiz.',
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
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-4xl font-bold font-syne mb-4">Seçimleriniz Onaylandı</h1>
                <p className="text-gray-400 text-lg mb-8">
                    Fotoğraf seçim işleminiz tamamlanmıştır. Albüm tasarım süreciniz başlamıştır.
                </p>
                <div className="bg-[#111] p-6 rounded-2xl inline-block text-left min-w-[300px]">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Özet</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span>Albüm</span><span className="text-white font-bold">{counts.album} Adet</span></div>
                        <div className="flex justify-between"><span>Kapak</span><span className="text-white font-bold">{counts.cover} Adet</span></div>
                        <div className="flex justify-between"><span>Poster</span><span className="text-white font-bold">{counts.poster} Adet</span></div>
                    </div>
                </div>
            </div>
        );
    }

    // Helper for category labels/colors
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
            {/* ACTION HEADER (Sticky) */}
            <div className="sticky top-20 z-30 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 shadow-2xl ring-1 ring-white/5">
                <div className="flex flex-col gap-4">

                    {/* 1. Category Tabs */}
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
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <config.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : `text-${config.color}-400`}`} />
                                    <div className="flex flex-col text-left relative z-10">
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{config.label}</span>
                                        <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{counts[cat]} / {limits[cat]}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* 2. Sub-Actions (Filter & Submit) */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Hepsi
                            </button>
                            <button
                                onClick={() => setActiveTab('selected')}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'selected' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Seçilenler
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || submitting}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isValid
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            GÖNDER
                        </button>
                    </div>
                </div>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {(activeTab === 'all' ? photos : photos.filter(p => selectedPhotos.find(s => s.url === p.url))).map((photo, i) => {
                    // Find ALL selections for this photo
                    const photoSelections = selectedPhotos.filter(s => s.url === photo.url);
                    const isSelected = photoSelections.length > 0;
                    const isSelectedInActiveCat = photoSelections.some(s => s.type === activeCategory);

                    return (
                        <div
                            key={i}
                            onClick={() => setLightboxPhoto(photo)}
                            className={`group relative aspect-[2/3] md:aspect-square bg-gray-900 rounded-2xl overflow-hidden cursor-zoom-in transition-all duration-300 ${isSelectedInActiveCat
                                ? `ring-2 ring-offset-2 ring-offset-black ${activeCategory === 'album' ? 'ring-green-500' :
                                    activeCategory === 'cover' ? 'ring-purple-500' : 'ring-orange-500'
                                }`
                                : 'hover:opacity-90 hover:ring-1 hover:ring-white/20'}`}
                        >
                            <img src={photo.url} alt="Photo" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

                            {/* Selection Badges */}
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

                            {/* Checked Overlay (Only if selected in CURRENT category) */}
                            {isSelectedInActiveCat && (
                                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center`}>
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Hover Zoom Hint */}
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full border border-white/10">
                                    <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* CUSTOM ALERT POPUP */}
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
                            className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative Background */}
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

                            <h3 className="text-xl font-bold text-center text-white mb-2 font-syne">{popup.title}</h3>
                            <p className="text-gray-400 text-center text-sm mb-8">{popup.message}</p>

                            <div className="flex gap-3">
                                {popup.type === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={closePopup}
                                            className="flex-1 py-3.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
                                        >
                                            Vazgeç
                                        </button>
                                        <button
                                            onClick={popup.onConfirm}
                                            className="flex-1 py-3.5 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
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

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {lightboxPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black flex flex-col"
                    >
                        {/* Lightbox Header */}
                        <div className="h-20 flex items-center justify-between px-6 z-50 bg-gradient-to-b from-black/90 to-transparent">
                            <span className="text-white/70 text-sm font-mono tracking-widest">{lightboxPhoto.filename}</span>
                            <button
                                onClick={() => setLightboxPhoto(null)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Lightbox Content (Zoomable) */}
                        <div className="flex-1 overflow-hidden relative">
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.5}
                                maxScale={4}
                                centerOnInit
                            >
                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <img
                                        src={lightboxPhoto.url}
                                        alt="Fullscreen"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>

                        {/* Lightbox Footer (Controls) */}
                        <div className="p-6 pb-32 bg-black/90 backdrop-blur-xl border-t border-white/10">
                            <div className="max-w-md mx-auto">
                                {(() => {
                                    // Logic for lightbox (Multiple Selections)
                                    const isSelectedInCurrentCat = selectedPhotos.some(s => s.url === lightboxPhoto.url && s.type === activeCategory);

                                    return (
                                        <div className="flex flex-col gap-4">
                                            {/* Context Info */}
                                            <div className="flex items-center justify-between text-sm px-1">
                                                <span className="text-gray-400">Aktif Kategori:</span>
                                                <div className={`flex items-center gap-2 font-bold uppercase tracking-widest bg-gradient-to-r ${currentCatConfig.gradient} bg-clip-text text-transparent`}>
                                                    <currentCatConfig.icon className={`w-4 h-4 text-${currentCatConfig.color}-500`} />
                                                    {currentCatConfig.label}
                                                </div>
                                            </div>

                                            {/* Main Action Button */}
                                            <button
                                                onClick={() => {
                                                    toggleSelection(lightboxPhoto, activeCategory);
                                                }}
                                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${isSelectedInCurrentCat
                                                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-900/30' // Remove action
                                                    : `bg-gradient-to-r ${currentCatConfig.gradient} text-white shadow-${currentCatConfig.color}-900/30 hover:shadow-${currentCatConfig.color}-500/40 hover:scale-[1.02]` // Add action
                                                    }`}
                                            >
                                                {isSelectedInCurrentCat ? (
                                                    <>
                                                        <X className="w-6 h-6" />
                                                        {currentCatConfig.label}'DEN ÇIKAR
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-6 h-6" />
                                                        {currentCatConfig.label}E EKLE
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
