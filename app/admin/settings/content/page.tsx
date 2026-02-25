'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, FileText, Loader2, Check, AlertCircle, Type, AlignLeft } from 'lucide-react';

export default function ContentSettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);

    const [settings, setSettings] = useState<any>(null);
    const [aboutText, setAboutText] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setSettings(data);
                        setAboutText(data.aboutText || '');
                    }
                })
                .finally(() => setLoading(false));
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status]);

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/admin/studio-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...settings,
                    aboutText
                })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'İçerik başarıyla kaydedildi!' });
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

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">İçerik Yönetimi</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Sitenizin metin içeriklerini düzenleyin</p>
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

            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            {/* About Text Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <AlignLeft className="w-5 h-5 text-gray-400" />
                        Hakkımızda Yazısı
                    </h2>
                </div>
                <div className="p-6 md:p-8">
                    <p className="text-sm font-semibold text-gray-500 mb-4">Bu metin müşteri sitesindeki "Hakkımızda" sayfasında görünür</p>
                    <textarea
                        value={aboutText}
                        onChange={e => setAboutText(e.target.value)}
                        rows={12}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all resize-y text-gray-900 placeholder-gray-400 text-sm font-medium leading-relaxed shadow-sm min-h-[200px]"
                        placeholder="Stüdyonuz hakkında hikayenizi, deneyiminizi ve fotoğrafçılık yaklaşımınızı anlatın..."
                    />

                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <Type className="w-3.5 h-3.5" />
                            <span>{aboutText.length} karakter</span>
                        </div>
                        <span className="bg-white px-3 py-1.5 rounded-full border border-gray-200 hidden sm:inline-block shadow-sm">Zengin içerik için paragraflar kullanın</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
