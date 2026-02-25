'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Globe, User, Mail, Phone, Package, Server } from 'lucide-react';
import Link from 'next/link';

interface Photographer {
    _id: string;
    email: string;
    name: string;
    studioName: string;
    slug: string;
    phone: string;
    packageType: string;
    storageLimit: number;
    isActive: boolean;
    subscriptionExpiry?: string;
}

export default function EditPhotographerPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [photographer, setPhotographer] = useState<Photographer | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        fetchPhotographer();
    }, [id]);

    const fetchPhotographer = async () => {
        try {
            const res = await fetch(`/api/superadmin/photographers/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPhotographer(data);
            } else {
                setError('Fotoğrafçı bulunamadı');
            }
        } catch (error) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!photographer) return;
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`/api/superadmin/photographers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: photographer.name,
                    studioName: photographer.studioName,
                    slug: photographer.slug,
                    phone: photographer.phone,
                    packageType: photographer.packageType,
                    storageLimit: photographer.storageLimit,
                    isActive: photographer.isActive,
                    subscriptionExpiry: photographer.subscriptionExpiry
                })
            });

            if (res.ok) {
                setSuccess('Değişiklikler kaydedildi!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            setError('Sunucu hatası');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!photographer) {
        return (
            <div className="text-center py-20 text-white">
                <p>{error || 'Fotoğrafçı bulunamadı'}</p>
                <Link href="/superadmin/photographers" className="text-purple-400 hover:underline mt-4 inline-block">
                    ← Geri Dön
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/superadmin/photographers"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Fotoğrafçı Düzenle</h1>
                        <p className="text-gray-400">{photographer.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400">
                    ✓ {success}
                </div>
            )}

            {/* Studio Site URL - Important! */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl border border-purple-500/30 p-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Müşteri Sitesi URL
                </h2>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-3 bg-gray-800 border border-white/10 rounded-l-lg text-gray-400 whitespace-nowrap">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/studio/
                    </span>
                    <input
                        type="text"
                        value={photographer.slug || ''}
                        onChange={(e) => setPhotographer({
                            ...photographer,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        })}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-white/10 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="studyo-adi"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Sadece küçük harf, rakam ve tire (-) kullanılabilir.
                </p>
                {photographer.slug && (
                    <div className="mt-3 flex items-center gap-3">
                        <a
                            href={`/studio/${photographer.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            Siteyi Görüntüle
                        </a>
                        <span className="text-sm text-purple-400">
                            {typeof window !== 'undefined' ? window.location.origin : ''}/studio/{photographer.slug}
                        </span>
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Profil Bilgileri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            value={photographer.name || ''}
                            onChange={(e) => setPhotographer({ ...photographer, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Stüdyo Adı</label>
                        <input
                            type="text"
                            value={photographer.studioName || ''}
                            onChange={(e) => setPhotographer({ ...photographer, studioName: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={photographer.email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-900/30 border border-white/10 rounded-lg text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Telefon</label>
                        <input
                            type="tel"
                            value={photographer.phone || ''}
                            onChange={(e) => setPhotographer({ ...photographer, phone: formatPhoneNumber(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+90 (555) 123 45 67"
                        />
                    </div>
                </div>
            </div>

            {/* Package & Storage */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-400" />
                    Paket & Depolama
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Paket Tipi</label>
                        <select
                            value={photographer.packageType || 'standart'}
                            onChange={(e) => {
                                const newPackage = e.target.value;
                                // Automatically adjust storage limits on package change
                                const newStorage = newPackage === 'kurumsal'
                                    ? 30 * 1024 * 1024 * 1024 // 30 GB
                                    : 10 * 1024 * 1024 * 1024; // 10 GB

                                setPhotographer({
                                    ...photographer,
                                    packageType: newPackage,
                                    storageLimit: newStorage
                                });
                            }}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="trial">Ücretsiz Deneme (14 Günlük)</option>
                            <option value="standart">Standart Paket (10GB)</option>
                            <option value="kurumsal">Kurumsal Paket (30GB)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Abonelik Bitiş Tarihi</label>
                        <input
                            type="date"
                            value={photographer?.subscriptionExpiry ? new Date(photographer.subscriptionExpiry).toISOString().split('T')[0] : ''}
                            onChange={(e) => setPhotographer({ ...photographer, subscriptionExpiry: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Depolama Limiti (GB)</label>
                        <input
                            type="number"
                            value={Math.round((photographer.storageLimit || 0) / 1024 / 1024 / 1024)}
                            onChange={(e) => setPhotographer({
                                ...photographer,
                                storageLimit: parseInt(e.target.value) * 1024 * 1024 * 1024
                            })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                        <p className="text-white font-medium">Hesap Durumu</p>
                        <p className="text-sm text-gray-400">Pasif hesaplar sisteme giriş yapamaz</p>
                    </div>
                    <button
                        onClick={() => setPhotographer({ ...photographer, isActive: !photographer.isActive })}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${photographer.isActive
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                    >
                        {photographer.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                </div>
            </div>
        </div>
    );
}
