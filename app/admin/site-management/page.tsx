'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
    Save,
    User,
    Palette,
    FileText,
    Mail,
    Image as ImageIcon,
    Globe,
    Phone,
    Instagram,
    Facebook,
    MessageCircle,
    Building,
    Upload,
    Check,
    X,
    Loader2
} from 'lucide-react';
import { uploadToBunny } from '@/lib/bunny'; // We can't use server action directly here, using API route logic in handleSave

export default function SiteManagementPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'general';
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Unified State
    const [settings, setSettings] = useState({
        // General
        name: '',
        email: '',
        phone: '',
        studioName: '',
        // Theme
        siteTheme: 'warm',
        primaryColor: '#ec4899',
        logo: '',
        bannerImage: '',
        // Content
        aboutText: '',
        // Contact
        whatsapp: '',
        instagram: '',
        facebook: '',
        // Gallery
        portfolioPhotos: [] as Array<{ url: string, title: string }>
    });

    // File States
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState('');

    // New Gallery Photos
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isFetched = useRef(false);

    // Sync tab with URL parameter
    useEffect(() => {
        setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    // Initial Fetch - runs only ONCE
    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setSettings(prev => ({ ...prev, ...data }));
                        if (data.logo) setLogoPreview(data.logo);
                        if (data.bannerImage) setBannerPreview(data.bannerImage);
                    }
                })
                .finally(() => setLoading(false));
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status]);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
            if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
            newGalleryPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [logoPreview, bannerPreview, newGalleryPreviews]);

    // Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(preview);
        } else {
            setBannerFile(file);
            setBannerPreview(preview);
        }
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setNewGalleryFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryPhoto = (index: number, isNew: boolean) => {
        if (isNew) {
            setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
            setNewGalleryPreviews(prev => {
                URL.revokeObjectURL(prev[index]);
                return prev.filter((_, i) => i !== index);
            });
        } else {
            setSettings(prev => ({
                ...prev,
                portfolioPhotos: prev.portfolioPhotos.filter((_, i) => i !== index)
            }));
        }
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
        setMessage({ type: 'info', text: 'Dosyalar yükleniyor ve ayarlar kaydediliyor...' });

        try {
            let currentLogo = settings.logo;
            let currentBanner = settings.bannerImage;
            let currentGallery = [...settings.portfolioPhotos];

            // 1. Upload Logo
            if (logoFile) {
                const url = await uploadFileToApi(logoFile, 'studio/logos');
                if (url) currentLogo = url;
            }

            // 2. Upload Banner
            if (bannerFile) {
                const url = await uploadFileToApi(bannerFile, 'studio/banners');
                if (url) currentBanner = url;
            }

            // 3. Upload Gallery
            for (const file of newGalleryFiles) {
                const url = await uploadFileToApi(file, 'studio/gallery');
                if (url) {
                    currentGallery.push({ url, title: 'Yeni Fotoğraf' });
                }
            }

            // 4. Save All Settings
            const payload = {
                ...settings,
                logo: currentLogo,
                bannerImage: currentBanner,
                portfolioPhotos: currentGallery
            };

            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: '✅ Tüm ayarlar başarıyla kaydedildi!' });
                setSettings(payload);
                // Clear file states
                setLogoFile(null);
                setBannerFile(null);
                setNewGalleryFiles([]);
                setNewGalleryPreviews([]);
            } else {
                throw new Error('Kaydetme başarısız');
            }

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: '❌ Bir hata oluştu. Lütfen tekrar deneyin.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-purple-600" /></div>;
    }

    if (status === 'unauthenticated') {
        return <div className="p-10 text-center">Giriş yapmanız gerekiyor.</div>;
    }

    const tabs = [
        { id: 'general', label: 'Genel Bilgiler', icon: User },
        { id: 'theme', label: 'Tema & Görünüm', icon: Palette },
        { id: 'content', label: 'İçerik Yönetimi', icon: FileText },
        { id: 'contact', label: 'İletişim & Sosyal', icon: Globe },
        { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Site Yönetimi</h1>
                        <p className="text-gray-500 mt-1">Müşteri sitenizin tüm ayarlarını tek yerden yönetin.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="font-medium">{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                    </button>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {message.type === 'error' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="flex gap-8 items-start">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sticky top-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">

                        {/* GENEL BİLGİLER */}
                        {activeTab === 'general' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-purple-600" /> Profil ve Stüdyo Bilgileri
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                                        <input
                                            value={settings.name}
                                            onChange={e => setSettings({ ...settings, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="Örn: Ahmet Yılmaz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Stüdyo Adı</label>
                                        <input
                                            value={settings.studioName}
                                            onChange={e => setSettings({ ...settings, studioName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="Örn: Ahmet Photo Art"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
                                        <input
                                            value={settings.email}
                                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="iletisim@domain.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                                        <input
                                            value={settings.phone}
                                            onChange={e => setSettings({ ...settings, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="+90 555 123 4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEMA VE GÖRÜNÜM */}
                        {activeTab === 'theme' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-purple-600" /> Tema Seçimi
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'warm', name: 'Warm', color: '#ec4899', desc: 'Sıcak ve Romantik' },
                                            { id: 'playful', name: 'Playful', color: '#f97316', desc: 'Canlı ve Enerjik' },
                                            { id: 'bold', name: 'Bold', color: '#7c2d3e', desc: 'Modern ve Cesur' }
                                        ].map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setSettings({ ...settings, siteTheme: theme.id as any })}
                                                className={`relative p-4 rounded-xl border-2 text-left transition-all ${settings.siteTheme === theme.id
                                                    ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="w-full h-24 rounded-lg mb-3 shadow-inner" style={{ backgroundColor: theme.color }}></div>
                                                <div className="font-bold text-gray-900">{theme.name}</div>
                                                <div className="text-xs text-gray-500">{theme.desc}</div>
                                                {settings.siteTheme === theme.id && <div className="absolute top-4 right-4 bg-purple-600 text-white p-1 rounded-full"><Check className="w-3 h-3" /></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-purple-600" /> Logo ve Banner
                                    </h2>
                                    <div className="space-y-6">
                                        {/* Logo */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Yükle</label>
                                            <div className="flex gap-6 items-start">
                                                <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} className="w-full h-full object-contain p-2" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'logo')}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer"
                                                    />
                                                    <p className="mt-2 text-xs text-gray-500">PNG veya JPG formatında, transparan arka planlı logo önerilir.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Banner */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Yükle</label>
                                            <div className="flex gap-6 items-start">
                                                <div className="w-48 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                                    {bannerPreview ? (
                                                        <img src={bannerPreview} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileSelect(e, 'banner')}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer"
                                                    />
                                                    <p className="mt-2 text-xs text-gray-500">Geniş formatlı (1920x600 gibi) yüksek çözünürlüklü görsel önerilir.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* İÇERİK YÖNETİMİ */}
                        {activeTab === 'content' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" /> Hakkımızda Yazısı
                                </h2>
                                <textarea
                                    value={settings.aboutText}
                                    onChange={e => setSettings({ ...settings, aboutText: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-y"
                                    placeholder="Stüdyonuz hakkında bilgi verin..."
                                />
                                <p className="mt-2 text-sm text-gray-500">Bu metin 'Hakkımızda' sayfasında gösterilecektir.</p>
                            </div>
                        )}

                        {/* İLETİŞİM VE SOSYAL */}
                        {activeTab === 'contact' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-purple-600" /> İletişim ve Sosyal Medya
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp Numarası
                                        </label>
                                        <input
                                            value={settings.whatsapp}
                                            onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="+905551234567 (Müşteri sitesindeki buton bu numarayı kullanır)"
                                        />
                                        <p className="mt-1 text-xs text-orange-600">Önemli: Buraya girilen numara sitedeki WhatsApp butonu için kullanılır.</p>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Instagram className="w-4 h-4 text-pink-600" /> Instagram Linki
                                        </label>
                                        <input
                                            value={settings.instagram}
                                            onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="https://instagram.com/kullaniciadi"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Facebook className="w-4 h-4 text-blue-600" /> Facebook Linki
                                        </label>
                                        <input
                                            value={settings.facebook}
                                            onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="https://facebook.com/sayfaadi"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GALERİ */}
                        {activeTab === 'gallery' && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-purple-600" /> Portfolyo Galerisi
                                    </h2>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all font-medium text-sm"
                                    >
                                        <Upload className="w-4 h-4" /> Fotoğraf Ekle
                                    </button>
                                    <input
                                        type="file"
                                        multiple
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleGallerySelect}
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Existing Photos */}
                                    {settings.portfolioPhotos.map((photo, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
                                            <img src={photo.url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <button
                                                    onClick={() => removeGalleryPhoto(index, false)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Photos Preview */}
                                    {newGalleryPreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm ring-2 ring-green-500">
                                            <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">YENİ</div>
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <button
                                                    onClick={() => removeGalleryPhoto(index, true)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {settings.portfolioPhotos.length === 0 && newGalleryFiles.length === 0 && (
                                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Henüz fotoğraf yüklenmemiş.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
