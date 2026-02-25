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
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Genel Bilgiler</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Profil ve işletme bilgilerinizi buradan yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    {settings.slug && (
                        <a
                            href={`/studio/${settings.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-semibold rounded-xl transition-all shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Siteye Git</span>
                        </a>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A70BA] text-white text-sm font-semibold rounded-xl hover:bg-[#7A70BA]/90 disabled:opacity-50 transition-all shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <User className="w-5 h-5 text-gray-400" />
                        Temel Bilgiler
                    </h2>
                </div>
                <div className="p-6 md:p-8 space-y-7">
                    {/* Name & Studio Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.name}
                                    onChange={e => setSettings({ ...settings, name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stüdyo Adı</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={settings.studioName}
                                    onChange={e => setSettings({ ...settings, studioName: e.target.value })}
                                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                    placeholder="Stüdyo İsmi"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresi</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={e => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon Numarası</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={e => setSettings({ ...settings, phone: formatPhoneNumber(e.target.value) })}
                                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                    placeholder="(555) 555 55 55"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stüdyo Linki (Kullanıcı Adı)</label>
                        <div className="flex flex-row items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white focus-within:ring-4 focus-within:ring-[#7A70BA]/10 focus-within:border-[#7A70BA] transition-all">
                            <span className="px-5 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-500 text-sm font-semibold shrink-0">
                                .com/studio/
                            </span>
                            <input
                                type="text"
                                value={settings.slug}
                                readOnly
                                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 cursor-not-allowed text-gray-500 font-semibold outline-none"
                            />
                        </div>
                        <p className="text-xs font-semibold text-gray-400 mt-2">Bu alan sistemseldir ve sadece yönetici tarafından değiştirilebilir.</p>
                    </div>
                </div>
            </div>

            {/* Address & Message Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                        <Building className="w-5 h-5 text-gray-400" />
                        Adres ve İletişim Detayları
                    </h2>
                </div>
                <div className="p-6 md:p-8 space-y-7">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Açık Adres</label>
                        <textarea
                            value={settings.address}
                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                            className="w-full px-5 py-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm min-h-[120px] resize-y"
                            placeholder="Stüdyo adresi..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Seçim Başarı Mesajı</label>
                        <textarea
                            value={settings.selectionSuccessMessage}
                            onChange={e => setSettings({ ...settings, selectionSuccessMessage: e.target.value })}
                            className="w-full px-5 py-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm min-h-[120px] resize-y"
                            placeholder="Müşterileriniz fotoğraf seçimini tamamladığında görecekleri mesaj..."
                        />
                        <p className="text-xs font-semibold text-gray-400 mt-2">Müşteri panelinde işlem sonunda gösterilir.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
