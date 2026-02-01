'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Globe, MessageCircle, Instagram, Facebook, Phone, Loader2, Check, AlertCircle, Info } from 'lucide-react';

export default function ContactSettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);

    const [settings, setSettings] = useState({
        phone: '',
        whatsapp: '',
        instagram: '',
        facebook: '',
    });

    const formatPhoneNumber = (value: string) => {
        // Only allow digits and +
        const cleaned = value.replace(/[^\d+]/g, '');

        // If it starts with +, keep it. Otherwise work with digits.
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

    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setSettings({
                            phone: data.phone || '',
                            whatsapp: data.whatsapp || '',
                            instagram: data.instagram || '',
                            facebook: data.facebook || '',
                        });
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
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'İletişim bilgileri kaydedildi!' });
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
                    <h1 className="text-lg font-bold text-gray-900">İletişim & Sosyal Medya</h1>
                    <p className="text-xs text-gray-500 font-medium">İletişim kanallarınızı ve sosyal medya hesaplarınızı buradan yönetin</p>
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

            {/* Info Alert */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">WhatsApp Butonu</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Aşağıya girdiğiniz WhatsApp numarası, müşteri sitesindeki sabit WhatsApp butonunda kullanılır.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        Bağlantılar
                    </h2>
                </div>
                <div className="p-6 space-y-8">
                    {/* Phone & WhatsApp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Telefon Numarası</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={e => setSettings({ ...settings, phone: formatPhoneNumber(e.target.value) })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="+90 (555) 123 45 67"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">WhatsApp Numarası</label>
                            <div className="relative">
                                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={settings.whatsapp}
                                    onChange={e => setSettings({ ...settings, whatsapp: formatWhatsApp(e.target.value) })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="+905551234567"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                Ülke kodu ile birlikte yazın
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Sosyal Medya Hesapları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Instagram</label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={settings.instagram}
                                        onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="https://instagram.com/kullaniciadi"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Facebook</label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={settings.facebook}
                                        onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="https://facebook.com/sayfaadi"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
