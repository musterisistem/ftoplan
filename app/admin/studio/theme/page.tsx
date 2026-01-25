'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Palette, Image, Globe } from 'lucide-react';

export default function ThemePage() {
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState({ siteTheme: 'warm' as 'warm' | 'playful' | 'bold', primaryColor: '#ec4899', logo: '', bannerImage: '' });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/admin/studio-settings').then(r => r.json()).then(data => {
                if (data.error) return;
                setSettings({
                    siteTheme: data.siteTheme || 'warm',
                    primaryColor: data.primaryColor || '#ec4899',
                    logo: data.logo || '',
                    bannerImage: data.bannerImage || ''
                });
                if (data.logo) setLogoPreview(data.logo);
                if (data.bannerImage) setBannerPreview(data.bannerImage);
            });
        }
    }, [status]);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
            if (bannerPreview && bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        };
    }, [logoPreview, bannerPreview]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (bannerPreview && bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'studio');

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            return res.ok ? data.url : null;
        } catch {
            return null;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            let logoUrl = settings.logo;
            let bannerUrl = settings.bannerImage;

            if (logoFile) {
                const uploaded = await uploadFile(logoFile);
                if (uploaded) {
                    logoUrl = uploaded;
                } else {
                    setMessage('Logo yüklenemedi');
                    setSaving(false);
                    return;
                }
            }

            if (bannerFile) {
                const uploaded = await uploadFile(bannerFile);
                if (uploaded) {
                    bannerUrl = uploaded;
                } else {
                    setMessage('Banner yüklenemedi');
                    setSaving(false);
                    return;
                }
            }

            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteTheme: settings.siteTheme,
                    primaryColor: settings.primaryColor,
                    logo: logoUrl,
                    bannerImage: bannerUrl
                })
            });

            if (res.ok) {
                setMessage('✅ Kaydedildi! Değişiklikler müşteri sitesine yansıdı.');
                setSettings({ ...settings, logo: logoUrl, bannerImage: bannerUrl });
                setLogoFile(null);
                setBannerFile(null);
                if (logoInputRef.current) logoInputRef.current.value = '';
                if (bannerInputRef.current) bannerInputRef.current.value = '';
            } else {
                setMessage('Kayıt başarısız');
            }
        } catch {
            setMessage('Kayıt hatası');
        }

        setSaving(false);
        setTimeout(() => setMessage(''), 5000);
    };

    const themes = [
        { id: 'warm', name: 'Warm', desc: 'Sıcak ve romantik', color: '#ec4899' },
        { id: 'playful', name: 'Playful', desc: 'Eğlenceli ve renkli', color: '#f97316' },
        { id: 'bold', name: 'Bold', desc: 'Cesur ve şık', color: '#7c2d3e' }
    ];

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tema Ayarları</h1>
                    <p className="text-gray-500">Müşteri sitenizin görünümünü özelleştirin</p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-xl ${message.includes('başarısız') || message.includes('hatası') || message.includes('yüklenemedi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {/* Tema Seçimi */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-600" /> Site Teması
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                type="button"
                                onClick={() => setSettings({ ...settings, siteTheme: theme.id as any })}
                                className={`p-4 rounded-xl border-2 transition-all ${settings.siteTheme === theme.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="w-full h-20 rounded-lg mb-3" style={{ backgroundColor: theme.color }}></div>
                                <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                                <p className="text-xs text-gray-500">{theme.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ana Renk */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Palette className="w-4 h-4" /> Ana Renk
                    </label>
                    <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
                    />
                </div>

                {/* Logo */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Image className="w-4 h-4" /> Logo
                    </label>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {logoPreview && (
                        <div className="mt-3">
                            <img src={logoPreview} alt="Logo Önizleme" className="h-20 object-contain border rounded-lg p-3 bg-gray-50" />
                            {logoFile && <p className="text-xs text-green-600 mt-1">✓ Yeni logo seçildi - Kaydet butonuna basın</p>}
                        </div>
                    )}
                </div>

                {/* Banner */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4" /> Banner Görseli
                    </label>
                    <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {bannerPreview && (
                        <div className="mt-3">
                            <img src={bannerPreview} alt="Banner Önizleme" className="w-full h-48 object-cover rounded-lg border" />
                            {bannerFile && <p className="text-xs text-green-600 mt-1">✓ Yeni banner seçildi - Kaydet butonuna basın</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
