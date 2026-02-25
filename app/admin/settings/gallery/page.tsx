'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Image as ImageIcon, Upload, X, Loader2, Check, AlertCircle, Grid, Plus } from 'lucide-react';

export default function GallerySettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [portfolioPhotos, setPortfolioPhotos] = useState<Array<{ url: string; title: string }>>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setPortfolioPhotos(data.portfolioPhotos || []);
                    }
                })
                .finally(() => setLoading(false));
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [newPreviews]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setNewFiles(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewPreviews(prev => [...prev, ...previews]);
    };

    const removeExisting = (index: number) => {
        setPortfolioPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeNew = (index: number) => {
        URL.revokeObjectURL(newPreviews[index]);
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFileToApi = async (file: File, folder: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        return data.url;
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let currentGallery = [...portfolioPhotos];

            for (const file of newFiles) {
                const url = await uploadFileToApi(file, 'studio/gallery');
                if (url) {
                    currentGallery.push({ url, title: 'Fotoğraf' });
                }
            }

            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioPhotos: currentGallery })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Galeri kaydedildi!' });
                setPortfolioPhotos(currentGallery);
                setNewFiles([]);
                setNewPreviews([]);
            } else {
                throw new Error('Kaydetme başarısız');
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
        );
    }

    const totalPhotos = portfolioPhotos.length + newFiles.length;

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Galeri Yönetimi</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Portfolyo fotoğraflarınızı buradan yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-sm">
                        <Grid className="w-4 h-4" />
                        {totalPhotos} Fotoğraf
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A70BA] text-white text-sm font-semibold rounded-xl hover:bg-[#7A70BA]/90 disabled:opacity-50 transition-all shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {/* Add Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all group shadow-sm"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-600 transition-colors">Fotoğraf Ekle</span>
                    </button>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    {/* Existing Photos */}
                    {portfolioPhotos.map((photo, index) => (
                        <div key={`existing-${index}`} className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                            <img src={photo.url} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <button
                                onClick={() => removeExisting(index)}
                                className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-red-50 shadow-sm hover:text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {/* New Photos */}
                    {newPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-md ring-4 ring-[#7A70BA]/20 bg-white border border-[#7A70BA]">
                            <div className="absolute top-3 left-3 z-10 bg-[#7A70BA] text-white text-[11px] px-2 py-1 rounded-lg font-bold shadow-sm">
                                YENİ
                            </div>
                            <img src={preview} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            <button
                                onClick={() => removeNew(index)}
                                className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-red-50 shadow-sm hover:text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {totalPhotos === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
                        <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <ImageIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">Henüz fotoğraf yok</h3>
                        <p className="text-sm font-medium text-gray-500">Portfolyonuza fotoğraf eklemek için "Fotoğraf Ekle" butonunu kullanın</p>
                    </div>
                )}
            </div>
        </div>
    );
}
