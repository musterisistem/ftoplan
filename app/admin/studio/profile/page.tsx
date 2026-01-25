'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, User, Mail, Phone, Building } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState({ name: '', email: '', phone: '', studioName: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/admin/studio-settings').then(r => r.json()).then(data => {
                if (data.error) return;
                setSettings({ name: data.name || '', email: data.email || '', phone: data.phone || '', studioName: data.studioName || '' });
            });
        }
    }, [status]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        const res = await fetch('/api/admin/studio-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        setSaving(false);
        setMessage(res.ok ? 'Kaydedildi!' : 'Hata oluştu');
        setTimeout(() => setMessage(''), 3000);
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h1>
                    <p className="text-gray-500">Kişisel bilgilerinizi düzenleyin</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && <div className={`mb-4 p-4 rounded-xl ${message.includes('Hata') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" /> Ad Soyad
                    </label>
                    <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Ahmet Yılmaz" />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4" /> Email
                    </label>
                    <input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="ahmet@example.com" />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" /> Telefon
                    </label>
                    <input type="tel" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="+90 555 123 4567" />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Building className="w-4 h-4" /> Stüdyo Adı
                    </label>
                    <input type="text" value={settings.studioName} onChange={e => setSettings({ ...settings, studioName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Ahmet Photo Studio" />
                </div>
            </div>
        </div>
    );
}
