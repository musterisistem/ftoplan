'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Palette, Image as ImageIcon, Upload, Check, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function ThemeSettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);

    const [settings, setSettings] = useState({
        siteTheme: 'warm',
        primaryColor: '#ec4899',
        logo: '',
        bannerImage: '',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setSettings({
                            siteTheme: data.siteTheme || 'warm',
                            primaryColor: data.primaryColor || '#ec4899',
                            logo: data.logo || '',
                            bannerImage: data.bannerImage || '',
                        });
                        if (data.logo) setLogoPreview(data.logo);
                        if (data.bannerImage) setBannerPreview(data.bannerImage);
                    }
                })
                .finally(() => setLoading(false));
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
            if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        };
    }, [logoPreview, bannerPreview]);

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
            let currentLogo = settings.logo;
            let currentBanner = settings.bannerImage;

            if (logoFile) {
                const url = await uploadFileToApi(logoFile, 'studio/logos');
                if (url) currentLogo = url;
            }
            if (bannerFile) {
                const url = await uploadFileToApi(bannerFile, 'studio/banners');
                if (url) currentBanner = url;
            }

            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...settings, logo: currentLogo, bannerImage: currentBanner })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Tema ayarları kaydedildi!' });
                setSettings(prev => ({ ...prev, logo: currentLogo, bannerImage: currentBanner }));
                setLogoFile(null);
                setBannerFile(null);
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

    const themes = [
        { id: 'warm', name: 'Warm', color: 'from-pink-500 to-rose-500', desc: 'Sıcak ve Romantik', accent: '#ec4899' },
        { id: 'playful', name: 'Playful', color: 'from-orange-400 to-amber-500', desc: 'Canlı ve Enerjik', accent: '#f97316' },
        { id: 'bold', name: 'Bold', color: 'from-rose-900 to-red-800', desc: 'Modern ve Cesur', accent: '#7c2d3e' },
    ];

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Palette className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Tema & Görünüm</h1>
                            <p className="text-gray-500">Sitenizin görsel kimliğini özelleştirin</p>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Theme Selection */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        Tema Seçimi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => setSettings({ ...settings, siteTheme: theme.id, primaryColor: theme.accent })}
                                className={`relative p-5 rounded-2xl border-2 text-left transition-all group hover:scale-[1.02] ${settings.siteTheme === theme.id
                                        ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${theme.color} mb-4 shadow-inner`} />
                                <div className="font-bold text-gray-900 text-lg">{theme.name}</div>
                                <div className="text-sm text-gray-500">{theme.desc}</div>
                                {settings.siteTheme === theme.id && (
                                    <div className="absolute top-4 right-4 bg-violet-600 text-white p-1.5 rounded-full shadow-lg">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logo & Banner */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-violet-500" />
                        Logo ve Banner
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Logo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Logo</label>
                            <div className="relative w-full aspect-square max-w-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-violet-400 transition-all">
                                {logoPreview ? (
                                    <img src={logoPreview} className="w-full h-full object-contain p-4" alt="Logo" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="w-10 h-10 mx-auto mb-2" />
                                        <span className="text-sm">Logo Yükle</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'logo')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">PNG veya JPG, transparan önerilir</p>
                        </div>

                        {/* Banner */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Banner</label>
                            <div className="relative w-full aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-violet-400 transition-all">
                                {bannerPreview ? (
                                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Upload className="w-10 h-10 mx-auto mb-2" />
                                        <span className="text-sm">Banner Yükle</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'banner')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">1920x600 önerilir</p>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
