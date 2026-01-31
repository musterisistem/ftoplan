'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function ContactPage() {
    const { data: session, status } = useSession();
    const [settings, setSettings] = useState({ phone: '', whatsapp: '', instagram: '', facebook: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/admin/studio-settings').then(r => r.json()).then(data => {
                if (data.error) return;
                setSettings({ phone: data.phone || '', whatsapp: data.whatsapp || '', instagram: data.instagram || '', facebook: data.facebook || '' });
            });
        }
    }, [status]);

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/[^\d+]/g, '');
        const hasPlus = cleaned.startsWith('+');
        const digits = cleaned.replace(/\D/g, '');
        let formatted = hasPlus ? '+' : '';
        if (digits.length > 0) {
            if (digits.startsWith('90')) {
                formatted += '90 ';
                const rest = digits.substring(2);
                if (rest.length > 0) formatted += '(' + rest.substring(0, 3) + ') ';
                if (rest.length > 3) formatted += rest.substring(3, 6) + ' ';
                if (rest.length > 6) formatted += rest.substring(6, 8) + ' ';
                if (rest.length > 8) formatted += rest.substring(8, 10);
            } else if (digits.startsWith('0')) {
                formatted += '0 ';
                if (digits.length > 1) formatted += '(' + digits.substring(1, 4) + ') ';
                if (digits.length > 4) formatted += digits.substring(4, 7) + ' ';
                if (digits.length > 7) formatted += digits.substring(7, 9) + ' ';
                if (digits.length > 9) formatted += digits.substring(9, 11);
            } else {
                if (digits.length > 0) formatted += '(' + digits.substring(0, 3) + ') ';
                if (digits.length > 3) formatted += digits.substring(3, 6) + ' ';
                if (digits.length > 6) formatted += digits.substring(6, 8) + ' ';
                if (digits.length > 8) formatted += digits.substring(8, 10);
            }
        }
        return formatted.trim();
    };

    const formatWhatsApp = (value: string) => {
        const cleaned = value.replace(/[^\d+]/g, '');
        const digits = cleaned.replace(/\D/g, '');
        if (digits.length === 0) return cleaned.startsWith('+') ? '+' : '';
        let result = '';
        if (digits.startsWith('90')) {
            result = digits.substring(0, 12);
        } else if (digits.startsWith('0')) {
            result = '90' + digits.substring(1, 11);
        } else {
            result = '90' + digits.substring(0, 10);
        }
        return '+' + result;
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('/api/admin/studio-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
        setSaving(false);
        setMessage(res.ok ? 'Kaydedildi!' : 'Hata');
        setTimeout(() => setMessage(''), 3000);
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">İletişim Bilgileri</h1>
                    <p className="text-gray-500">Müşterilerinizin size ulaşması için</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                    <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && <div className={`mb-4 p-4 rounded-xl ${message.includes('Hata') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" /> Telefon
                    </label>
                    <input type="tel" value={settings.phone} onChange={e => setSettings({ ...settings, phone: formatPhoneNumber(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="+90 (555) 123 45 67" />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp
                    </label>
                    <input type="tel" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: formatWhatsApp(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="+905551234567" />
                    <p className="text-xs text-gray-500 mt-1">⚠️ Bu numara müşteri sitesindeki WhatsApp butonunda kullanılacak</p>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">@</span>
                        <input type="text" value={settings.instagram} onChange={e => setSettings({ ...settings, instagram: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="kullaniciadi" />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                    </label>
                    <input type="url" value={settings.facebook} onChange={e => setSettings({ ...settings, facebook: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="https://facebook.com/..." />
                </div>
            </div>
        </div>
    );
}
