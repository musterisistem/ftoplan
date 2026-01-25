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
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    const totalPhotos = portfolioPhotos.length + newFiles.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <ImageIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Galeri Yönetimi</h1>
                            <p className="text-gray-500">Portfolyo fotoğraflarınızı yönetin</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
                            <Grid className="w-4 h-4 inline mr-2" />
                            {totalPhotos} Fotoğraf
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Gallery Grid */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Add Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-amber-400 hover:bg-amber-50 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                                <Plus className="w-7 h-7 text-gray-400 group-hover:text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-amber-600">Fotoğraf Ekle</span>
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
                            <div key={`existing-${index}`} className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                                <img src={photo.url} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                                <button
                                    onClick={() => removeExisting(index)}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* New Photos */}
                        {newPreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-2 ring-green-500">
                                <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                    YENİ
                                </div>
                                <img src={preview} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                                <button
                                    onClick={() => removeNew(index)}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPhotos === 0 && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Henüz fotoğraf yok</h3>
                            <p className="text-gray-500">Portfolyonuza fotoğraf eklemek için yukarıdaki butonu kullanın</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
