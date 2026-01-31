'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft,
    Save,
    User,
    Phone,
    Mail,
    Calendar,
    FileText,
    Trash2,
    Loader2,
    Copy,
    Check
} from 'lucide-react';
import Link from 'next/link';
import { useAlert } from '@/context/AlertContext';

export default function CustomerEditPage() {
    const router = useRouter();
    const params = useParams();
    const { showAlert } = useAlert();
    const customerId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [copyFeedback, setCopyFeedback] = useState('');

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const clean = numbers.startsWith('0') ? numbers : '0' + numbers;
        const capped = clean.substring(0, 11);
        let result = '';
        if (capped.length > 0) result += '(' + capped.substring(0, 4);
        if (capped.length > 4) result += ') ' + capped.substring(4, 7);
        if (capped.length > 7) result += ' ' + capped.substring(7, 9);
        if (capped.length > 9) result += ' ' + capped.substring(9, 11);
        return result;
    };



    const [formData, setFormData] = useState({
        brideName: '',
        groomName: '',
        phone: '',
        email: '',
        notes: '',
        status: 'active',
        tcId: '',
        selectionLimits: { album: 22, cover: 1, poster: 1 },
        selectedPhotos: []
    });

    // Fetch customer data
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await fetch(`/api/customers/${customerId}`);
                if (!res.ok) throw new Error('Müşteri bulunamadı');
                const data = await res.json();
                setFormData({
                    brideName: data.brideName || '',
                    groomName: data.groomName || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    notes: data.notes || '',
                    status: data.status || 'active',
                    tcId: data.tcId || '',
                    selectionLimits: data.selectionLimits || { album: 22, cover: 1, poster: 1 },
                    selectedPhotos: data.selectedPhotos || []
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchCustomer();
        }
    }, [customerId]);

    useEffect(() => {
        console.log('Selection Page Updated: File Copy Feature Ready');
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('limit_')) {
            const limitType = name.replace('limit_', '');
            setFormData(prev => ({
                ...prev,
                selectionLimits: {
                    ...prev.selectionLimits,
                    [limitType]: parseInt(value) || 0
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/customers/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Güncelleme başarısız');
            }

            showAlert('Müşteri bilgileri başarıyla güncellendi', 'success');
            router.push('/admin/customers');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Silme işlemi başarısız');
            }

            showAlert('Müşteri başarıyla silindi', 'success');
            router.push('/admin/customers');
        } catch (err: any) {
            setError(err.message);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto min-h-screen space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/customers"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Müşteri Düzenle</h1>
                        <p className="text-gray-500 text-sm">Müşteri bilgilerini güncelleyin</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Sil
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Gelin Adı
                            </label>
                            <input
                                type="text"
                                name="brideName"
                                value={formData.brideName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Damat Adı
                            </label>
                            <input
                                type="text"
                                name="groomName"
                                value={formData.groomName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Telefon
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                E-posta
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                TC / Pasaport (11 Haneli)
                            </label>
                            <input
                                type="text"
                                name="tcId"
                                value={formData.tcId}
                                onChange={(e) => setFormData({ ...formData, tcId: e.target.value.replace(/\D/g, '').substring(0, 11) })}
                                maxLength={11}
                                placeholder="Kimlik No"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Durum
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="active">Aktif</option>
                                <option value="completed">Tamamlandı</option>
                                <option value="archived">Arşivlendi</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Notlar
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                    </div>

                </div>

                {/* Selection Limits Settings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Save className="w-5 h-5 text-indigo-500" />
                        Albüm Onay Ayarları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Albüm Fotoğraf Sayısı
                            </label>
                            <input
                                type="number"
                                name="limit_album"
                                value={formData.selectionLimits?.album}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Poster Sayısı
                            </label>
                            <input
                                type="number"
                                name="limit_poster"
                                value={formData.selectionLimits?.poster}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kapak Fotoğraf Sayısı
                            </label>
                            <input
                                type="number"
                                name="limit_cover"
                                value={formData.selectionLimits?.cover}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Approved Selections Gallery */}
                {formData.selectedPhotos && formData.selectedPhotos.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Check className="w-6 h-6 text-green-500" />
                            Onaylanan Albüm Seçimleri
                        </h3>

                        {/* Render categories: Album, Cover, Poster */}
                        {['album', 'cover', 'poster'].map((type) => {
                            const photos = formData.selectedPhotos.filter((p: any) => p.type === type);
                            if (photos.length === 0) return null;

                            const distinctFilenames = photos.map((p: any) => p.filename || p.url.split('/').pop());

                            // Generate Strings
                            const winString = distinctFilenames.map((f: string) => `"${f}"`).join(' OR ');
                            const macString = distinctFilenames.join(' OR ');

                            const copyToClipboard = (text: string, platform: 'win' | 'mac') => {
                                navigator.clipboard.writeText(text).then(() => {
                                    setCopyFeedback(`${platform === 'win' ? 'Windows' : 'Mac'} formatında kopyalandı!`);
                                    setTimeout(() => setCopyFeedback(''), 3000);
                                });
                            };

                            const title = type === 'album' ? 'Albüm Fotoğrafları' : type === 'cover' ? 'Kapak Fotoğrafları' : 'Poster Fotoğrafları';
                            const bgColor = type === 'album' ? 'bg-green-50' : type === 'cover' ? 'bg-purple-50' : 'bg-orange-50';
                            const iconColor = type === 'album' ? 'text-green-600' : type === 'cover' ? 'text-purple-600' : 'text-orange-600';
                            const Icon = type === 'album' ? FileText : type === 'cover' ? User : FileText;

                            return (
                                <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}>
                                                <Icon className={`w-5 h-5 ${iconColor}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{title} ({photos.length})</h4>
                                                <p className="text-xs text-gray-400">Windows ve Mac için arama kodları</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(winString, 'win')}
                                                className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Windows Kopyala
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(macString, 'mac')}
                                                className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Mac Kopyala
                                            </button>
                                        </div>
                                    </div>

                                    {/* Text Preview Area */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
                                        <p className="text-xs text-gray-500 font-mono break-all leading-relaxed max-h-32 overflow-y-auto">
                                            {winString}
                                        </p>
                                    </div>

                                    {/* Mini Gallery Grid */}
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {photos.map((photo: any, idx: number) => (
                                            <div key={idx} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                                                <img src={photo.url} alt="selection" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Kaydet
                    </button>
                </div>
            </form >
        </div >
    );
}
