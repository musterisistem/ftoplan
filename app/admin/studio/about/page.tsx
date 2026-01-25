'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, FileText } from 'lucide-react';

export default function AboutPage() {
    const { data: session, status } = useSession();
    const [aboutText, setAboutText] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/admin/studio-settings').then(r => r.json()).then(data => {
                if (!data.error) setAboutText(data.aboutText || '');
            });
        }
    }, [status]);

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('/api/admin/studio-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ aboutText }) });
        setSaving(false);
        setMessage(res.ok ? 'Kaydedildi!' : 'Hata');
        setTimeout(() => setMessage(''), 3000);
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hakkımızda</h1>
                    <p className="text-gray-500">Stüdyonuz hakkında bilgi ekleyin</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                    <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && <div className={`mb-4 p-4 rounded-xl ${message.includes('Hata') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" /> Hakkımızda Metni
                </label>
                <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={10} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" placeholder="Stüdyonuz hakkında bilgi yazın..."></textarea>
                <p className="text-xs text-gray-500 mt-2">{aboutText.length} karakter</p>
            </div>
        </div>
    );
}
