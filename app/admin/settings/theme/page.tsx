'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Palette, Image as ImageIcon, Upload, Check, Loader2, AlertCircle, Sparkles, ExternalLink, Moon, Sun } from 'lucide-react';

export default function ThemeSettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);

    const [settings, setSettings] = useState({
        siteTheme: 'warm',
        primaryColor: '#ec4899',
        logo: '', // Legacy/Fallback
        siteLogoLight: '', // For Light Theme (Dark Logo)
        siteLogoDark: '',  // For Dark Theme (Light Logo)
        bannerImage: '',
        slug: '',
        heroTitle: '',
        heroSubtitle: '',
    });

    // File States
    const [siteLogoLightFile, setSiteLogoLightFile] = useState<File | null>(null);
    const [siteLogoLightPreview, setSiteLogoLightPreview] = useState('');

    const [siteLogoDarkFile, setSiteLogoDarkFile] = useState<File | null>(null);
    const [siteLogoDarkPreview, setSiteLogoDarkPreview] = useState('');

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
                            siteLogoLight: data.siteLogoLight || '',
                            siteLogoDark: data.siteLogoDark || '',
                            bannerImage: data.bannerImage || '',
                            slug: data.slug || '',
                            heroTitle: data.heroTitle || '',
                            heroSubtitle: data.heroSubtitle || '',
                        });

                        // Set Initial Previews
                        if (data.siteLogoLight) setSiteLogoLightPreview(data.siteLogoLight);
                        // Fallback logic for existing users: if no specific light logo, use main logo
                        else if (data.logo) setSiteLogoLightPreview(data.logo);

                        if (data.siteLogoDark) setSiteLogoDarkPreview(data.siteLogoDark);
                        // Fallback logic for existing users: if no specific dark logo, use main logo
                        else if (data.logo) setSiteLogoDarkPreview(data.logo);

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
            if (siteLogoLightPreview?.startsWith('blob:')) URL.revokeObjectURL(siteLogoLightPreview);
            if (siteLogoDarkPreview?.startsWith('blob:')) URL.revokeObjectURL(siteLogoDarkPreview);
            if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        };
    }, [siteLogoLightPreview, siteLogoDarkPreview, bannerPreview]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'siteLogoLight' | 'siteLogoDark' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);

        if (type === 'siteLogoLight') {
            setSiteLogoLightFile(file);
            setSiteLogoLightPreview(preview);
        } else if (type === 'siteLogoDark') {
            setSiteLogoDarkFile(file);
            setSiteLogoDarkPreview(preview);
        } else {
            setBannerFile(file);
            setBannerPreview(preview);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();

            // Files
            if (siteLogoLightFile) formData.append('siteLogoLight', siteLogoLightFile);
            if (siteLogoDarkFile) formData.append('siteLogoDark', siteLogoDarkFile);
            if (bannerFile) {
                // Use legacy upload for banner if simpler, or just allow API to handle
                // Note: Our modified API does NOT handle 'banner' file upload directly via specific key yet,
                // It handles logo keys. We need to check if we broke banner upload.
                // The previous code used a separate /api/upload endpoint for banners/logos.
                // We should ideally keep that for banners OR update the main settings API to handle banner.
                // Let's stick to the previous pattern for BANNER for safety, or migrate it.
                // Detailed Plan: Let's use the new API for logos, but keep the separate upload for banners 
                // to minimize risk, OR just let the API handle it if we updated it?
                // Wait, we didn't add 'banner' file handling to the main API route in the previous step.
                // We only added logo handling. So we MUST manually upload banner here first.

                const bannerFormData = new FormData();
                bannerFormData.append('file', bannerFile);
                bannerFormData.append('folder', 'studio/banners');
                const res = await fetch('/api/upload', { method: 'POST', body: bannerFormData });
                const data = await res.json();
                if (data.url) {
                    // Update the settings object effectively
                    settings.bannerImage = data.url;
                }
            }

            // Prepare Theme Settings specific data
            const themeSettingsData = {
                siteTheme: settings.siteTheme,
                primaryColor: settings.primaryColor,
                heroTitle: settings.heroTitle,
                heroSubtitle: settings.heroSubtitle,
                bannerImage: settings.bannerImage, // updated if uploaded
                // We don't send logos in JSON, we send them as files in FormData
            };

            formData.append('themeSettings', JSON.stringify(themeSettingsData));

            const res = await fetch('/api/studio/settings', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setMessage({ type: 'success', text: 'Tema ayarları kaydedildi!' });
                // Update local state with returned user data to ensure sync
                if (data.user) {
                    setSettings(prev => ({
                        ...prev,
                        siteLogoLight: data.user.siteLogoLight,
                        siteLogoDark: data.user.siteLogoDark,
                        logo: data.user.logo
                    }));
                }
                setSiteLogoLightFile(null);
                setSiteLogoDarkFile(null);
                setBannerFile(null);
            } else {
                throw new Error('Kaydetme başarısız');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        }
    };

    const themes = [
        { id: 'warm', name: 'Dark Theme', color: 'bg-slate-900', desc: 'Şık ve modern karanlık görünüm', accent: '#ec4899', type: 'dark' },
        { id: 'light', name: 'Light Theme', color: 'bg-white border', desc: 'Aydınlık ve ferah görünüm', accent: '#ec4899', type: 'light' },
    ];

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tema & Görünüm</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Sitenizin görsel kimliğini özelleştirin</p>
                </div>
                <div className="flex items-center gap-3">
                    {settings.slug && (
                        <a
                            href={`/studio/${settings.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-semibold rounded-xl transition-all shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Önizle</span>
                        </a>
                    )}
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

            {/* Theme Selection */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                        Tema Seçimi
                    </h2>
                </div>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => setSettings({ ...settings, siteTheme: theme.id, primaryColor: theme.accent })}
                                className={`relative p-5 rounded-2xl border-2 text-left transition-all group bg-white ${settings.siteTheme === theme.id
                                    ? 'border-[#7A70BA] ring-2 ring-[#7A70BA]/20 shadow-md'
                                    : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`w-full aspect-video rounded-xl ${theme.color} mb-4 shadow-inner`} />
                                <div className="font-bold text-gray-900 text-base">{theme.name}</div>
                                <div className="text-sm font-semibold text-gray-500 mt-1">{theme.desc}</div>
                                {settings.siteTheme === theme.id && (
                                    <div className="absolute top-4 right-4 bg-[#7A70BA] text-white p-1.5 rounded-full shadow-sm">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Logos for Themes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        Site Logoları
                    </h2>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Light Theme Logo (Should be Dark) */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-5 h-5 text-orange-500" />
                            <label className="text-sm font-semibold text-gray-700">Light Tema Logosu</label>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 mb-4">
                            Açık renkli (beyaz) arka planda görünecektir. <br />
                            <strong className="text-gray-900">Koyu renkli (siyah) logo yükleyiniz.</strong>
                        </p>

                        <div className="flex flex-col gap-3">
                            {/* Preview Container - White Background for Light Theme Simulation */}
                            <div className="relative aspect-[3/2] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-white hover:border-[#7A70BA]/50 transition-colors group">
                                {siteLogoLightPreview ? (
                                    <img src={siteLogoLightPreview} className="w-full h-full object-contain p-6" alt="Light Theme Logo" />
                                ) : (
                                    <div className="text-center p-6 bg-white rounded-xl border border-gray-100 m-4 shadow-sm w-full h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <span className="text-sm font-semibold text-gray-400">Siyah Logo Yükle</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'siteLogoLight')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dark Theme Logo (Should be Light) */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <label className="text-sm font-semibold text-gray-700">Dark Tema Logosu</label>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 mb-4">
                            Koyu renkli (siyah) arka planda görünecektir. <br />
                            <strong className="text-gray-900">Açık renkli (beyaz) logo yükleyiniz.</strong>
                        </p>

                        <div className="flex flex-col gap-3">
                            {/* Preview Container - Dark Background for Dark Theme Simulation */}
                            <div className="relative aspect-[3/2] bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-gray-800 hover:border-[#7A70BA]/50 transition-colors group">
                                {siteLogoDarkPreview ? (
                                    <img src={siteLogoDarkPreview} className="w-full h-full object-contain p-6" alt="Dark Theme Logo" />
                                ) : (
                                    <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 m-4 shadow-sm w-full h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                                        <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                                        <span className="text-sm font-semibold text-gray-400">Beyaz Logo Yükle</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileSelect(e, 'siteLogoDark')}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Banner Override */}
            {/* Note: This section remains largely as is, to handle Banner */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        Site Banner
                    </h2>
                </div>
                <div className="p-6 md:p-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Resmi</label>
                    <div className="flex items-start gap-4">
                        <div className="relative w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-white hover:border-[#7A70BA]/50 transition-colors">
                            {bannerPreview ? (
                                <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-300" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, 'banner')}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Text Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <Palette className="w-5 h-5 text-gray-400" />
                        Ana Sayfa Yazıları
                    </h2>
                </div>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Büyük Başlık (Title)</label>
                            <input
                                type="text"
                                value={settings.heroTitle}
                                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                className="w-full px-5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                placeholder="Örn: Catch Your Life Moment"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Başlık (Subtitle)</label>
                            <input
                                type="text"
                                value={settings.heroSubtitle}
                                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                className="w-full px-5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                placeholder="Örn: Photography & Cinema"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
