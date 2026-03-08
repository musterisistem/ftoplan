'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, XCircle, Tag, Search, RefreshCw, Power } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
    validUntil?: string;
    createdAt: string;
}

export default function CouponManagerClient() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form States
    const [newCode, setNewCode] = useState('');
    const [newDiscount, setNewDiscount] = useState<number | ''>('');
    const [newMaxUses, setNewMaxUses] = useState<number | ''>('');
    const [newValidUntil, setNewValidUntil] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            toast.error('Kuponlar yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || !newDiscount) {
            toast.error('Kod ve indirim oranı zorunludur.');
            return;
        }

        const toastId = toast.loading('Oluşturuluyor...');
        try {
            const res = await fetch('/api/superadmin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: newCode,
                    discountPercentage: newDiscount,
                    maxUses: newMaxUses || 0,
                    validUntil: newValidUntil ? new Date(newValidUntil).toISOString() : null
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Kupon başarıyla oluşturuldu', { id: toastId });
                setCoupons([data.coupon, ...coupons]);
                setIsAddModalOpen(false);
                setNewCode('');
                setNewDiscount('');
                setNewMaxUses('');
                setNewValidUntil('');
            } else {
                toast.error(data.error || 'Oluşturulamadı', { id: toastId });
            }
        } catch (error) {
            toast.error('Sunucu hatası', { id: toastId });
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const toastId = toast.loading('Güncelleniyor...');
        try {
            const res = await fetch(`/api/superadmin/coupons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (res.ok) {
                toast.success('Durum güncellendi', { id: toastId });
                setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
            } else {
                toast.error('Güncellenemedi', { id: toastId });
            }
        } catch {
            toast.error('Bağlantı hatası', { id: toastId });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kupon kodunu silmek istediğinize emin misiniz?')) return;

        const toastId = toast.loading('Siliniyor...');
        try {
            const res = await fetch(`/api/superadmin/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Kupon silindi', { id: toastId });
                setCoupons(coupons.filter(c => c._id !== id));
            } else {
                toast.error('Silinemedi', { id: toastId });
            }
        } catch {
            toast.error('Bağlantı hatası', { id: toastId });
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in cursor-default">
            <Toaster position="top-right" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kupon Yönetimi</h1>
                        <p className="text-sm text-gray-500 mt-1">Sisteme kayıt olurken paketlerde kullanılabilecek indirim kodları.</p>
                    </div>
                </div>

                <div className="flex w-full md:w-auto items-center gap-3">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Kupon ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchCoupons}
                        className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-all active:scale-95"
                        title="Yenile"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 active:scale-95 transition-all text-sm whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> Yeni Kupon
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Kupon Kodu</th>
                                <th className="px-6 py-4">İndirim</th>
                                <th className="px-6 py-4">Kullanım</th>
                                <th className="px-6 py-4">Son Tarih</th>
                                <th className="px-6 py-4 text-center">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Kuponlar yükleniyor...
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Eşleşen kupon bulunamadı. Yeni bir tane ekleyebilirsiniz.
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md text-sm border border-indigo-100">
                                                    {coupon.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-emerald-600 text-sm">
                                                %{coupon.discountPercentage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {coupon.usedCount} <span className="text-gray-400 font-normal">/ {coupon.maxUses === 0 ? 'Sınırsız' : coupon.maxUses}</span>
                                                </span>
                                                {coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses && (
                                                    <span className="text-xs text-red-500 font-medium mt-0.5">Limit Doldu</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {coupon.validUntil ? (
                                                <span className={`text-sm ${new Date(coupon.validUntil) < new Date() ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                                                    {new Date(coupon.validUntil).toLocaleDateString('tr-TR')}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Süresiz</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold focus:outline-none transition-all ${coupon.isActive
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <Power className="w-3 h-3" />
                                                {coupon.isActive ? 'Aktif' : 'Pasif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Coupon Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Kupon Oluştur</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kupon Kodu <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                                    placeholder="Örn: YAZ20"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-mono uppercase bg-gray-50 focus:bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Sadece harf ve rakam, boşluksuz girilir.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">İndirim Oranı (%) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="100"
                                            value={newDiscount}
                                            onChange={(e) => setNewDiscount(Number(e.target.value))}
                                            placeholder="20"
                                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kullanım Limiti</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newMaxUses}
                                        onChange={(e) => setNewMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="Sınırsız (0)"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Son Geçerlilik Tarihi</label>
                                <input
                                    type="date"
                                    value={newValidUntil}
                                    onChange={(e) => setNewValidUntil(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Eğer tarih seçilmezse kupon süresiz olur.</p>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
