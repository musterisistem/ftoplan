'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Layout, Type } from 'lucide-react';

export default function HomeSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        heroTitle: '',
        heroSubtitle: '',
        aboutText: '', // It's on home page too
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/studio-settings');
            const data = await res.json();
            if (data.user) {
                setFormData({
                    heroTitle: data.user.heroTitle || '',
                    heroSubtitle: data.user.heroSubtitle || '',
                    aboutText: data.user.aboutText || '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.refresh();
                // success toast
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <Layout className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Ana Sayfa Ayarları</h1>
                    <p className="text-gray-400 text-sm">Web sitenizin giriş ekranı metinlerini buradan düzenleyebilirsiniz.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Hero Section */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Type className="w-4 h-4 text-purple-400" />
                        Giriş Ekranı (Hero)
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                Slider Başlığı (Büyük Manşet)
                            </label>
                            <input
                                type="text"
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                placeholder="Örn: Catch Your Life Moment"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">Giriş ekranındaki en büyük yazıdır.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                Slider Alt Başlığı (Küçük Yazı)
                            </label>
                            <input
                                type="text"
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                placeholder="Örn: Creative Studio"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* About Section Short */}
                <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Hakkımızda (Kısa Özet)</h3>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                            Ana Sayfa Hakkımızda Yazısı
                        </label>
                        <textarea
                            rows={3}
                            value={formData.aboutText}
                            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                            placeholder="Stüdyonuz hakkında kısa bir cümle..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}
