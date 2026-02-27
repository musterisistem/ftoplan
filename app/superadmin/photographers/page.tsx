'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Server,
    Calendar,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Package
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { EmailTemplateType } from '@/models/EmailTemplate';

interface Photographer {
    _id: string;
    email: string;
    name: string;
    studioName: string;
    slug: string;
    phone: string;
    role: string;
    storageUsage: number;
    storageLimit: number;
    packageType: string;
    subscriptionExpiry: string;
    isActive: boolean;
    createdAt: string;
}

export default function PhotographersPage() {
    const [photographers, setPhotographers] = useState<Photographer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPhotographers();
    }, []);

    const fetchPhotographers = async () => {
        try {
            setLoading(true);
            setError('');
            setSelectedIds([]); // Clear selection on refresh
            const res = await fetch('/api/superadmin/photographers', {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                const data = await res.json();
                setPhotographers(data);
            } else {
                setError('Fotoğrafçılar yüklenirken hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Error fetching photographers:', error);
            setError('Sunucuya bağlanırken hata oluştu. Lütfen sayfayı yenileyin.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu üyeyi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            setDeleting(true);
            const res = await fetch(`/api/superadmin/photographers/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Üye başarıyla silindi');
                fetchPhotographers();
            } else {
                toast.error('Silme işlemi başarısız oldu');
            }
        } catch (error) {
            toast.error('Bağlantı hatası');
        } finally {
            setDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedIds.length} üyeyi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;

        try {
            setDeleting(true);
            const res = await fetch('/api/superadmin/photographers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });

            if (res.ok) {
                toast.success(`${selectedIds.length} üye başarıyla silindi`);
                fetchPhotographers();
            } else {
                toast.error('Toplu silme işlemi başarısız oldu');
            }
        } catch (error) {
            toast.error('Bağlantı hatası');
        } finally {
            setDeleting(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPhotographers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPhotographers.map(p => p._id));
        }
    };

    const filteredPhotographers = photographers.filter(p =>
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.studioName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPackageColor = (type: string) => {
        switch (type) {
            case 'kurumsal': return 'from-purple-500 to-pink-500';
            case 'standart': return 'from-blue-500 to-cyan-500';
            case 'trial': return 'from-gray-500 to-gray-400';
            default: return 'from-gray-500 to-gray-400';
        }
    };

    const getPackageName = (type: string) => {
        switch (type) {
            case 'kurumsal': return 'Kurumsal';
            case 'standart': return 'Standart';
            case 'trial': return 'Deneme';
            default: return 'Bilinmiyor';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Fotoğrafçılar</h1>
                    <p className="text-gray-400">Tüm kayıtlı fotoğrafçıları yönetin</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Fotoğrafçı
                </button>
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                        Seçilenleri Sil ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Email, isim veya stüdyo adı ile ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {error ? (
                    <div className="text-center py-20">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Bir Hata Oluştu</h3>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={fetchPhotographers}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Tekrar Dene
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : filteredPhotographers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Henüz fotoğrafçı yok</h3>
                        <p className="text-gray-400 mb-6">Yeni fotoğrafçı ekleyerek başlayın</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Fotoğrafçı Ekle
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === filteredPhotographers.length && filteredPhotographers.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-white/10 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                                        />
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Fotoğrafçı</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Paket</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Depolama</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Bitiş Tarihi</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Durum</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPhotographers.map((photographer) => (
                                    <tr key={photographer._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(photographer._id)}
                                                onChange={() => toggleSelect(photographer._id)}
                                                className="w-4 h-4 rounded border-white/10 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">
                                                        {photographer.name?.charAt(0) || photographer.email?.charAt(0) || 'F'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{photographer.name || photographer.studioName || 'İsimsiz'}</p>
                                                    <p className="text-sm text-gray-400">{photographer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPackageColor(photographer.packageType)} text-white`}>
                                                <Package className="w-3 h-3" />
                                                {getPackageName(photographer.packageType)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 max-w-[100px]">
                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                            style={{ width: `${Math.min((photographer.storageUsage / photographer.storageLimit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {(photographer.storageUsage / 1024 / 1024 / 1024).toFixed(1)} / {(photographer.storageLimit / 1024 / 1024 / 1024).toFixed(0)} GB
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(photographer.subscriptionExpiry).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {photographer.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                                                    <XCircle className="w-4 h-4" />
                                                    Pasif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/superadmin/photographers/${photographer._id}`}
                                                    className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(photographer._id)}
                                                    disabled={deleting}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Photographer Modal */}
            {
                showAddModal && (
                    <AddPhotographerModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={() => {
                            setShowAddModal(false);
                            fetchPhotographers();
                        }}
                    />
                )
            }
        </div >
    );
}

function AddPhotographerModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        studioName: '',
        slug: '',
        phone: '',
        packageType: 'standart',
        storageLimit: 10737418240, // 10GB default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/superadmin/photographers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (error) {
            setError('Sunucu hatası');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-lg border border-purple-500/20">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Yeni Fotoğrafçı Ekle</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Ad Soyad</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Stüdyo Adı</label>
                            <input
                                type="text"
                                value={formData.studioName}
                                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Müşteri Sitesi URL</label>
                        <div className="flex items-center">
                            <span className="px-3 py-2 bg-gray-700 border border-white/10 border-r-0 rounded-l-lg text-gray-400 text-sm whitespace-nowrap">
                                {typeof window !== 'undefined' ? window.location.origin : ''}/studio/
                            </span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                className="flex-1 px-4 py-2 bg-gray-800 border border-white/10 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="studyo-adi"
                                required
                            />
                        </div>
                        {formData.slug && (
                            <p className="text-xs text-purple-400 mt-2">
                                ✓ Müşteri sitesi: {typeof window !== 'undefined' ? window.location.origin : ''}/studio/{formData.slug}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Sadece küçük harf, rakam ve tire kullanılabilir</p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Şifre</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Telefon</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                            className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+90 (555) 123 45 67"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Paket</label>
                            <select
                                value={formData.packageType}
                                onChange={(e) => {
                                    const type = e.target.value;
                                    let limit = 10737418240; // 10GB default
                                    if (type === 'trial') limit = 3221225472; // 3GB
                                    if (type === 'kurumsal') limit = 32212254720; // 30GB
                                    setFormData({ ...formData, packageType: type, storageLimit: limit });
                                }}
                                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="trial">Deneme (3GB - 7 Gün)</option>
                                <option value="standart">Standart (10GB)</option>
                                <option value="kurumsal">Kurumsal (30GB)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Kota (GB)</label>
                            <input
                                type="number"
                                value={formData.storageLimit / 1024 / 1024 / 1024}
                                onChange={(e) => setFormData({ ...formData, storageLimit: parseInt(e.target.value) * 1024 * 1024 * 1024 })}
                                className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Ekleniyor...' : 'Fotoğrafçı Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
