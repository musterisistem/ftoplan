'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useAlert } from '@/context/AlertContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, Loader2, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';

export default function AlbumProviderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { showAlert } = useAlert();
    const { data: session } = useSession();
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    
    // New cover state
    const [newCoverName, setNewCoverName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProviderDetails();
    }, [id]);

    const fetchProviderDetails = async () => {
        try {
            const res = await fetch('/api/admin/album-providers');
            if (res.ok) {
                const data = await res.json();
                const found = data.find((p: any) => p._id === id);
                if (found) {
                    setProvider(found);
                } else {
                    showAlert('Tedarikçi bulunamadı.', 'error');
                    router.push('/admin/album-providers');
                }
            }
        } catch {
            showAlert('Veriler yüklenirken bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Shared helper — validates + sets file & preview
    const applyFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            showAlert('Lütfen sadece görsel (JPG, PNG vb.) seçin.', 'warning');
            return;
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) applyFile(e.target.files[0]);
    };

    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDrop      = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) applyFile(file);
    };

    const uploadCoverImage = async () => {
        if (!selectedFile) return null;

        // ── Step 1: Compress the image to max 900 KB ──────────────────────
        let fileToUpload: File = selectedFile;
        try {
            setUploadProgress('Görsel optimize ediliyor...');
            const options = {
                maxSizeMB: 0.9,          // 900 KB upper limit
                maxWidthOrHeight: 2000,  // keep reasonable resolution
                useWebWorker: true,
                onProgress: (p: number) => setUploadProgress(`Optimize ediliyor: %${p}`),
            };
            const compressed = await imageCompression(selectedFile, options);
            // Keep the original filename but signal it is a JPEG
            fileToUpload = new File([compressed], selectedFile.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        } catch (err) {
            console.warn('Compression failed, uploading original:', err);
        }

        // ── Step 2: Build organized folder path ───────────────────────────
        // Path: album-covers/{providerName}/{photographerStudio}
        const providerSlug = (provider?.name || 'provider').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const studioSlug = ((session?.user as any)?.studioName || (session?.user as any)?.name || 'fotograf').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const folder = `album-covers/${providerSlug}/${studioSlug}`;

        setUploadProgress('BunnyCDN\'e yükleniyor...');
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.url;
            } else {
                return null;
            }
        } catch {
            return null;
        } finally {
            setUploadProgress('');
        }
    };

    const handleAddCover = async () => {
        if (!newCoverName.trim()) {
            showAlert('Lütfen kapak modeline bir isim verin.', 'warning');
            return;
        }
        if (!selectedFile) {
            showAlert('Lütfen bir kapak görseli seçin.', 'warning');
            return;
        }

        setIsUploading(true);
        
        // 1. Upload to BunnyCDN
        const imageUrl = await uploadCoverImage();
        
        if (!imageUrl) {
            showAlert('Görsel yüklenirken bir hata oluştu.', 'error');
            setIsUploading(false);
            return;
        }

        // 2. Append to provider's covers and save
        const newCoverItem = {
            name: newCoverName.trim(),
            imageUrl: imageUrl
        };

        const updatedCovers = [...(provider.covers || []), newCoverItem];

        try {
            const res = await fetch(`/api/admin/album-providers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ covers: updatedCovers })
            });

            if (res.ok) {
                const updated = await res.json();
                setProvider(updated);
                setNewCoverName('');
                setSelectedFile(null);
                setPreviewUrl('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                showAlert('Kapak modeli başarıyla eklendi.', 'success');
            } else {
                showAlert('Kapak veritabanına kaydedilemedi.', 'error');
            }
        } catch {
            showAlert('Bir ağ hatası oluştu.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteCover = async (indexToDelete: number) => {
        if (!confirm('Bu kapağı silmek istediğinize emin misiniz?')) return;

        const updatedCovers = provider.covers.filter((_: any, i: number) => i !== indexToDelete);

        try {
            const res = await fetch(`/api/admin/album-providers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ covers: updatedCovers })
            });

            if (res.ok) {
                const updated = await res.json();
                setProvider(updated);
                showAlert('Kapak kaldırıldı.', 'success');
            } else {
                showAlert('İşlem başarısız oldu.', 'error');
            }
        } catch {
            showAlert('Bir ağ hatası oluştu.', 'error');
        }
    };

    if (loading || !provider) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/album-providers" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-500 hover:text-indigo-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            {provider.name}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">
                            Kapak Modelleri Yönetimi
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Upload New Cover */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
                        <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-indigo-500" />
                            Yeni Kapak Ekle
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Model Adı (Örn: Siyah Deri)</label>
                                <input
                                    type="text"
                                    value={newCoverName}
                                    onChange={(e) => setNewCoverName(e.target.value)}
                                    placeholder="Kapak modeli adı"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kapak Görseli</label>
                                <div 
                                    className={`border-2 border-dashed rounded-2xl overflow-hidden text-center cursor-pointer group transition-all ${
                                        isDragging
                                            ? 'border-[#544ee8] bg-[#f3f4fa] scale-[1.01]'
                                            : 'border-[#e5e7eb] hover:bg-[#f9fafb] hover:border-[#544ee8]/40'
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} alt="Önizleme" className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Değiştir</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`flex flex-col items-center gap-2 p-6 transition-colors ${
                                            isDragging ? 'text-[#544ee8]' : 'text-slate-400 group-hover:text-[#544ee8]'
                                        }`}>
                                            <Upload className={`w-8 h-8 transition-transform ${isDragging ? 'scale-125' : ''}`} />
                                            <span className="text-xs font-bold">
                                                {isDragging ? 'Bırakın!' : 'Görsel Seçin veya Sürükleyin'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">JPG, PNG, WebP — Otomatik optimize edilir</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>



                            <button
                                onClick={handleAddCover}
                                disabled={isUploading}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#544ee8] hover:bg-[#4338ca] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#544ee8]/20 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> {uploadProgress || 'Yükleniyor...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Kaydet ve Ekle
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Existing Covers Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
                        <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                            Kayıtlı Modeller <span className="text-xs ml-2 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{provider.covers?.length || 0}</span>
                        </h3>

                        {!provider.covers || provider.covers.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm font-medium">Henüz bu tedarikçiye ait kapak modeli eklenmemiş.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                {provider.covers.map((cover: any, index: number) => (
                                    <div key={index} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-slate-100">
                                            <img 
                                                src={cover.imageUrl} 
                                                alt={cover.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Hover Delete Action */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDeleteCover(index)}
                                                    className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 hover:scale-110 transition-all shadow-lg"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border-t border-slate-100 text-center">
                                            <p className="text-xs font-bold text-slate-800 truncate" title={cover.name}>{cover.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
