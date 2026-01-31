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
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Globe className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">İletişim & Sosyal Medya</h1>
                            <p className="text-gray-500">İletişim ve sosyal medya bağlantılarınızı yönetin</p>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* WhatsApp Alert */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-800">WhatsApp Butonu</h3>
                        <p className="text-sm text-green-700">Aşağıya girdiğiniz WhatsApp numarası, müşteri sitesindeki sabit WhatsApp butonunda kullanılır.</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Phone & WhatsApp */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Phone className="w-4 h-4 text-blue-500" />
                                    Telefon Numarası
                                </label>
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={e => setSettings({ ...settings, phone: formatPhoneNumber(e.target.value) })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+90 (555) 123 45 67"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <MessageCircle className="w-4 h-4 text-green-500" />
                                    WhatsApp Numarası
                                </label>
                                <input
                                    type="tel"
                                    value={settings.whatsapp}
                                    onChange={e => setSettings({ ...settings, whatsapp: formatWhatsApp(e.target.value) })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+905551234567"
                                />
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Ülke kodu ile birlikte yazın
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-sm text-gray-500">Sosyal Medya</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Instagram className="w-4 h-4 text-pink-500" />
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={settings.instagram}
                                    onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    placeholder="https://instagram.com/kullaniciadi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Facebook className="w-4 h-4 text-blue-600" />
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={settings.facebook}
                                    onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="https://facebook.com/sayfaadi"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
