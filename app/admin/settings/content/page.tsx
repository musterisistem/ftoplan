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
        <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">İçerik Yönetimi</h1>
                    <p className="text-xs text-gray-500 font-medium">Sitenizin metin içeriklerini düzenleyin</p>
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

            {message.text && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* About Text Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 text-indigo-500" />
                        Hakkımızda Yazısı
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-xs text-gray-500 mb-2">Bu metin müşteri sitesindeki "Hakkımızda" sayfasında görünür</p>
                    <textarea
                        value={aboutText}
                        onChange={e => setAboutText(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all resize-y text-gray-900 placeholder-gray-400 text-sm leading-relaxed"
                        placeholder="Stüdyonuz hakkında hikayenizi, deneyiminizi ve fotoğrafçılık yaklaşımınızı anlatın..."
                    />

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Type className="w-3 h-3" />
                            <span>{aboutText.length} karakter</span>
                        </div>
                        <span>Zengin içerik için paragraflar kullanın</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
