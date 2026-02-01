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
        <div className="p-6 max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Galeri Yönetimi</h1>
                    <p className="text-xs text-gray-500 font-medium">Portfolyo fotoğraflarınızı buradan yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                        <Grid className="w-3.5 h-3.5" />
                        {totalPhotos} Fotoğraf
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Add Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                    >
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-indigo-200">
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 group-hover:text-indigo-600">Fotoğraf Ekle</span>
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
                        <div key={`existing-${index}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <img src={photo.url} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                onClick={() => removeExisting(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}

                    {/* New Photos */}
                    {newPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm ring-2 ring-green-500 ring-offset-2">
                            <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                YENİ
                            </div>
                            <img src={preview} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                onClick={() => removeNew(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {totalPhotos === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Henüz fotoğraf yok</h3>
                        <p className="text-xs text-gray-500">Portfolyonuza fotoğraf eklemek için yukarıdaki butonu kullanın</p>
                    </div>
                )}
            </div>
        </div>
    );
}
