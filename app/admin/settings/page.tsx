'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    Save, Globe, Palette, Phone, Instagram, MessageCircle,
    Image as ImageIcon, X, Plus, Eye, User, Mail, Building,
    Facebook, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface StudioSettings {
    // Profile
    name: string;
    email: string;
    phone: string;
    studioName: string;
    // Studio Website
    slug: string;
    logo: string;
    bannerImage: string;
    primaryColor: string;
    siteTheme: 'warm' | 'playful' | 'bold';
    aboutText: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    portfolioPhotos: Array<{ url: string; title: string }>;
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'profile' | 'studio'>('profile');
    const [settings, setSettings] = useState<StudioSettings>({
        name: '',
        email: '',
        phone: '',
        studioName: '',
        slug: '',
        logo: '',
        bannerImage: '',
        primaryColor: '#ec4899',
        siteTheme: 'warm',
        aboutText: '',
        instagram: '',
        facebook: '',
        whatsapp: '',
        portfolioPhotos: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/studio-settings');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    name: data.name || '',
                    email: data.email || session?.user?.email || '',
                    phone: data.phone || '',
                    studioName: data.studioName || '',
                    slug: data.slug || '',
                    logo: data.logo || '',
                    bannerImage: data.bannerImage || '',
                    primaryColor: data.primaryColor || '#ec4899',
                    siteTheme: data.siteTheme || 'warm',
                    aboutText: data.aboutText || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    whatsapp: data.whatsapp || '',
                    portfolioPhotos: data.portfolioPhotos || []
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSuccess('Ayarlar başarıyla kaydedildi!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            setError('Sunucu hatası');
        } finally {
            setSaving(false);
        }
    };

    const addPortfolioPhoto = () => {
        const url = prompt('Fotoğraf URL\'si girin:');
        if (url) {
            setSettings({
                ...settings,
                portfolioPhotos: [...settings.portfolioPhotos, { url, title: '' }]
            });
        }
    };

    const removePortfolioPhoto = (index: number) => {
        setSettings({
            ...settings,
            portfolioPhotos: settings.portfolioPhotos.filter((_, i) => i !== index)
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Uygulama Ayarları</h1>
                    <p className="text-gray-500">Profil ve stüdyo web sitesi ayarlarınız</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 shadow-lg shadow-purple-500/25"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
                    ✓ {success}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'profile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <User className="w-4 h-4" />
                    Profil Bilgileri
                </button>
                <button
                    onClick={() => setActiveTab('studio')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'studio'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Globe className="w-4 h-4" />
                    Stüdyo Web Sitesi
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-600" />
                        Profil Bilgileri
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                            <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stüdyo Adı</label>
                            <input
                                type="text"
                                value={settings.studioName}
                                onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0532 xxx xx xx"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Paketiniz</label>
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-purple-50 text-purple-700 font-medium flex items-center justify-between">
                                <span className="capitalize">{session?.user?.packageType || 'Bilinmiyor'} Paket</span>
                                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-md">Değiştirmek için iletişime geçin</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Studio Tab */}
            {activeTab === 'studio' && (
                <div className="space-y-6">
                    {/* Site URL */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                    Müşteri Siteniz
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Müşterileriniz bu adresten giriş yapacak
                                </p>
                            </div>
                            {settings.slug && (
                                <Link
                                    href={`/studio/${settings.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    Siteyi Görüntüle
                                </Link>
                            )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200">
                            <span className="text-gray-500">{typeof window !== 'undefined' ? window.location.origin : ''}/studio/</span>
                            <span className="font-bold text-purple-600">{settings.slug || '...'}</span>
                            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">* URL, süper admin tarafından belirlenir</p>
                    </div>

                    {/* Branding */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-pink-600" />
                            Marka & Görünüm
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ana Renk</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Site renkleri bu renge göre ayarlanır</p>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Selector */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Site Teması</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Warm Theme */}
                                    <div
                                        onClick={() => setSettings({ ...settings, siteTheme: 'warm' })}
                                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg ${settings.siteTheme === 'warm'
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="h-28 bg-gradient-to-b from-sky-200 via-orange-100 to-orange-50 p-3">
                                            <div className="w-full h-full bg-white/50 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className="w-6 h-6 rounded-lg bg-white shadow mx-auto mb-1" />
                                                    <div className="w-12 h-1 bg-rose-400 rounded mx-auto" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h4 className="font-semibold text-gray-900 text-sm">Warm</h4>
                                            <p className="text-xs text-gray-500">Sıcak, zarif tonlar</p>
                                        </div>
                                        {settings.siteTheme === 'warm' && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                        )}
                                    </div>

                                    {/* Playful Theme */}
                                    <div
                                        onClick={() => setSettings({ ...settings, siteTheme: 'playful' })}
                                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg ${settings.siteTheme === 'playful'
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="h-28 bg-gradient-to-b from-blue-100 to-orange-50 p-3">
                                            <div className="w-full h-full bg-white/60 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <span className="text-orange-500 font-bold italic text-sm">Script</span>
                                                    <div className="w-8 h-2 bg-gray-800 rounded-full mt-1 mx-auto" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h4 className="font-semibold text-gray-900 text-sm">Playful</h4>
                                            <p className="text-xs text-gray-500">Eğlenceli, canlı</p>
                                        </div>
                                        {settings.siteTheme === 'playful' && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                        )}
                                    </div>

                                    {/* Bold Theme */}
                                    <div
                                        onClick={() => setSettings({ ...settings, siteTheme: 'bold' })}
                                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg ${settings.siteTheme === 'bold'
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="h-28 flex">
                                            <div className="w-1/2 bg-rose-900 p-2 flex items-center">
                                                <div className="text-white text-[8px] font-bold">PREMIUM</div>
                                            </div>
                                            <div className="w-1/2 bg-orange-50 p-2 flex items-end justify-end">
                                                <div className="text-rose-900 text-lg font-bold opacity-20">01</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h4 className="font-semibold text-gray-900 text-sm">Bold</h4>
                                            <p className="text-xs text-gray-500">Kurumsal, güçlü</p>
                                        </div>
                                        {settings.siteTheme === 'bold' && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Müşteri sitenizin genel görünümünü belirler</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                                <input
                                    type="url"
                                    value={settings.logo}
                                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Görsel URL</label>
                                <input
                                    type="url"
                                    value={settings.bannerImage}
                                    onChange={(e) => setSettings({ ...settings, bannerImage: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımızda Metni</label>
                                <textarea
                                    value={settings.aboutText}
                                    onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Stüdyonuz hakkında kısa bir açıklama..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social & Contact */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-green-600" />
                            Sosyal Medya & İletişim
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <MessageCircle className="w-4 h-4 text-green-500" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={settings.whatsapp}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="905xxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    value={settings.instagram}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="@kullaniciadi"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Facebook className="w-4 h-4 text-blue-600" />
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    value={settings.facebook}
                                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="sayfa-adi"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                Portfolyo Fotoğrafları
                            </h2>
                            <button
                                onClick={addPortfolioPhoto}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ekle
                            </button>
                        </div>
                        <p className="text-sm text-gray-500">Müşteri sitenizin ana sayfasında görüntülenecek</p>

                        {settings.portfolioPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {settings.portfolioPhotos.map((photo, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img
                                            src={photo.url}
                                            alt={photo.title || 'Portfolio'}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => removePortfolioPhoto(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                <ImageIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-400">Henüz portfolyo fotoğrafı eklenmemiş</p>
                                <button
                                    onClick={addPortfolioPhoto}
                                    className="mt-3 text-sm text-purple-600 hover:underline"
                                >
                                    İlk fotoğrafı ekle
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
