'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Save, User, Mail, Phone, Building, Loader2, Check, AlertCircle, ExternalLink } from 'lucide-react';

export default function GeneralSettingsPage() {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isFetched = useRef(false);

    const [settings, setSettings] = useState({
        name: '',
        email: '',
        phone: '',
        studioName: '',
        slug: '',
        address: '',
        selectionSuccessMessage: '',
    });

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

    useEffect(() => {
        if (status === 'authenticated' && !isFetched.current) {
            isFetched.current = true;
            fetch('/api/admin/studio-settings')
                .then(r => r.json())
                .then(data => {
                    if (!data.error) {
                        setSettings({
                            name: data.name || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            studioName: data.studioName || '',
                            slug: data.slug || '',
                            address: data.address || '',
                            selectionSuccessMessage: data.selectionSuccessMessage || '',
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
                setMessage({ type: 'success', text: 'Bilgiler başarıyla kaydedildi!' });
            } else {
                throw new Error('Kaydetme başarısız');
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
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
                    <h1 className="text-lg font-bold text-gray-900">Genel Bilgiler</h1>
                    <p className="text-xs text-gray-500 font-medium">Profil ve işletme bilgilerinizi buradan yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    {settings.slug && (
                        <a
                            href={`/studio/${settings.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Siteye Git</span>
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-100'
                    : 'bg-green-50 text-green-700 border-green-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Temel Bilgiler
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Name & Studio Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.name}
                                    onChange={e => setSettings({ ...settings, name: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Stüdyo Adı</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.studioName}
                                    onChange={e => setSettings({ ...settings, studioName: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="Stüdyo İsmi"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">E-posta Adresi</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Telefon Numarası</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={e => setSettings({ ...settings, phone: formatPhoneNumber(e.target.value) })}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="(555) 555 55 55"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Stüdyo Linki (Kullanıcı Adı)</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-xs font-medium">
                                .com/studio/
                            </span>
                            <input
                                type="text"
                                value={settings.slug}
                                readOnly
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-r-lg cursor-not-allowed text-gray-500 outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Bu alan sistemseldir ve sadece yönetici tarafından değiştirilebilir.</p>
                    </div>
                </div>
            </div>

            {/* Address & Message Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-500" />
                        Adres ve İletişim Detayları
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Açık Adres</label>
                        <textarea
                            value={settings.address}
                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400 min-h-[80px]"
                            placeholder="Stüdyo adresi..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Seçim Başarı Mesajı</label>
                        <textarea
                            value={settings.selectionSuccessMessage}
                            onChange={e => setSettings({ ...settings, selectionSuccessMessage: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400 min-h-[80px]"
                            placeholder="Müşterileriniz fotoğraf seçimini tamamladığında görecekleri mesaj..."
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Müşteri panelinde işlem sonunda gösterilir.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
