'use client';

import { useState, useMemo, useEffect } from 'react';
import { Grid, Heart, Check, Image as ImageIcon, Layout, BookOpen, AlertCircle, Loader2, X, ZoomIn, Info, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useRouter } from 'next/navigation';

interface TrialSelectionClientProps {
    customer: any;
    photos: any[];
    photographer: any;
}

export default function TrialSelectionClient({ customer, photos: initialPhotos, photographer }: TrialSelectionClientProps) {
    const { customer: authCustomer, isLoading: authLoading, logout, login } = useCustomerAuth();
    const router = useRouter();
    const [view, setView] = useState<'grid' | 'zoom'>('grid');
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>(customer.selectedPhotos || []);
    const [filter, setFilter] = useState<'all' | 'liked'>('all');
    const [saving, setSaving] = useState(false);
    const [zoomPhoto, setZoomPhoto] = useState<any>(null);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await login(loginData.username, loginData.password);
            if (!res.success) {
                setLoginError(res.error || 'Giriş başarısız');
            }
        } catch (error) {
            setLoginError('Bağlantı hatası');
        } finally {
            setLoginLoading(false);
        }
    };

    // Filtered photos
    const photos = useMemo(() => {
        if (filter === 'liked') {
            return initialPhotos.filter(p => selectedPhotos.some((s: any) => s.url === p.url));
        }
        return initialPhotos;
    }, [initialPhotos, filter, selectedPhotos]);

    const isPink = photographer?.primaryColor === '#ec4899'; // Simple check

    const togglePhoto = async (photo: any) => {
        if (customer.selectionCompleted) return;

        const exists = selectedPhotos.find((p: any) => p.url === photo.url);
        let newSelected;
        if (exists) {
            newSelected = selectedPhotos.filter((p: any) => p.url !== photo.url);
        } else {
            newSelected = [...selectedPhotos, { ...photo, type: 'album' }]; // Default to album
        }
        setSelectedPhotos(newSelected);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/customers/${customer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedPhotos })
            });
            if (res.ok) {
                alert('Seçimleriniz kaydedildi!');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>;

    // Simplified auth check - if not logged in as THIS customer, show login or redirect
    if (!authCustomer || (authCustomer as any).id !== customer._id) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <Lock className="w-8 h-8 text-pink-500" />
                        </div>
                        <h1 className="text-2xl font-bold">Müşteri Girişi</h1>
                        <p className="text-neutral-400 text-sm mt-2">Bu galeriye erişmek için lütfen giriş yapın.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Kullanıcı Adı</label>
                            <input
                                type="text"
                                required
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                placeholder="kullaniciadiniz"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
                            <input
                                type="password"
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Giriş Yap'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} {photographer?.studioName || 'Kadraj Panel Stüdyo'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-pink-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                            <ImageIcon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">{customer.brideName} & {customer.groomName}</h1>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Fotoğraf Seçim Paneli</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">Seçilen</div>
                            <div className="text-sm font-black text-pink-500">{selectedPhotos.length} / {customer.selectionLimits?.album || '--'}</div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-pink-600/20 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                        <button onClick={logout} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
                            <X className="w-5 h-5 text-neutral-400" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Grid */}
            <main className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {photos.map((photo, index) => {
                        const isSelected = selectedPhotos.some((p: any) => p.url === photo.url);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`relative aspect-[2/3] group rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-pink-500' : 'border-transparent'}`}
                                onClick={() => togglePhoto(photo)}
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Actions */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <button
                                        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isSelected ? 'bg-pink-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                                        onClick={(e) => { e.stopPropagation(); togglePhoto(photo); }}
                                    >
                                        <Heart className={`w-5 h-5 ${isSelected ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all"
                                        onClick={(e) => { e.stopPropagation(); setZoomPhoto(photo); setView('zoom'); }}
                                    >
                                        <ZoomIn className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            {/* Zoom Modal */}
            <AnimatePresence>
                {view === 'zoom' && zoomPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                    >
                        <header className="p-6 flex items-center justify-between">
                            <div className="text-sm font-medium text-neutral-400">
                                {photos.indexOf(zoomPhoto) + 1} / {photos.length}
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => togglePhoto(zoomPhoto)}
                                    className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${selectedPhotos.some((p: any) => p.url === zoomPhoto.url) ? 'bg-pink-600' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    <Heart className={`w-5 h-5 ${selectedPhotos.some((p: any) => p.url === zoomPhoto.url) ? 'fill-current' : ''}`} />
                                    {selectedPhotos.some((p: any) => p.url === zoomPhoto.url) ? 'Seçildi' : 'Seç'}
                                </button>
                                <button onClick={() => setView('grid')} className="p-3 bg-white/10 rounded-full border border-white/10">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </header>
                        <div className="flex-1 min-h-0 flex items-center justify-center p-4">
                            <TransformWrapper>
                                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                    <img src={zoomPhoto.url} className="max-w-full max-h-full object-contain shadow-2xl" alt="" />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
