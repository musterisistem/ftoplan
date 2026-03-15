'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, RefreshCw, Building2, CreditCard, Banknote } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
        awaiting_transfer: { label: 'Onay Bekliyor', className: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3.5 h-3.5" /> },
        completed: { label: 'Onaylandı', className: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
        failed: { label: 'Reddedildi', className: 'bg-red-100 text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
        pending: { label: 'Bekliyor', className: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3.5 h-3.5" /> },
    };
    const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-700', icon: null };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}>
            {s.icon} {s.label}
        </span>
    );
}

export default function PaymentsPage() {
    const { showAlert } = useAlert();
    const [tab, setTab] = useState<'bank_transfer' | 'credit_card'>('bank_transfer');
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ thisMonthSales: 0, lastMonthSales: 0, thisYearSales: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [clearingHistory, setClearingHistory] = useState(false);
    const [deletingOrder, setDeletingOrder] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/payments');
            if (!res.ok) throw new Error('Sunucu hatası');
            const data = await res.json();
            setOrders(data.orders || []);
            setStats(data.stats || {});
        } catch (error) {
            console.error('Error fetching payments:', error);
            showAlert('Ödeme verileri yüklenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (orderId: string, action: 'approve' | 'reject') => {
        setActionLoading(orderId + action);
        try {
            const res = await fetch('/api/superadmin/bank-transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, action }),
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(data.message || 'İşlem tamamlandı', 'success');
                fetchData();
            } else {
                showAlert(data.error || 'İşlem başarısız', 'error');
            }
        } catch {
            showAlert('Sunucuya bağlanılamadı', 'error');
        } finally {
            setActionLoading(null);
        }
    };
    const handleClearHistory = async () => {
        if (!confirm('Tüm geçmiş işlemler silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
            return;
        }

        setClearingHistory(true);
        try {
            const res = await fetch('/api/superadmin/payments/clear-history', {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(data.message || 'Geçmiş işlemler temizlendi', 'success');
                fetchData();
            } else {
                showAlert(data.error || 'İşlem başarısız', 'error');
            }
        } catch {
            showAlert('Sunucuya bağlanılamadı', 'error');
        } finally {
            setClearingHistory(false);
        }
    };
    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        setDeletingOrder(true);
        try {
            const res = await fetch(`/api/superadmin/payments/${orderId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                showAlert(data.message || 'Sipariş silindi', 'success');
                setSelectedOrder(null);
                fetchData();
            } else {
                showAlert(data.error || 'İşlem başarısız', 'error');
            }
        } catch {
            showAlert('Sunucuya bağlanılamadı', 'error');
        } finally {
            setDeletingOrder(false);
        }
    };



    const bankOrders = orders.filter(o => o.paymentMethod === 'bank_transfer');
    const ccOrders = orders.filter(o => o.paymentMethod === 'credit_card');
    
    const pendingBankOrders = bankOrders.filter(o => o.status === 'awaiting_transfer');
    const historyBankOrders = bankOrders.filter(o => o.status !== 'awaiting_transfer');

    // Format currency properly (Turkish Lira with kuruş)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Ödemeler ve Satışlar</h1>
                    <p className="text-gray-400 text-sm">Tüm ödeme kanallarını ve satış performansınızı takip edin.</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white hover:bg-gray-700 transition-all text-sm font-semibold active:scale-95">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Verileri Güncelle
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Bu Ay Yapılan Satış', value: stats.thisMonthSales, icon: <Clock className="w-5 h-5 text-blue-400" />, bg: 'from-blue-500/10 to-transparent', border: 'border-blue-500/20' },
                    { label: 'Geçen Ay Yapılan Satış', value: stats.lastMonthSales, icon: <RefreshCw className="w-5 h-5 text-purple-400" />, bg: 'from-purple-500/10 to-transparent', border: 'border-purple-500/20' },
                    { label: 'Bu Yıl Toplam Satış', value: stats.thisYearSales, icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, bg: 'from-emerald-500/10 to-transparent', border: 'border-emerald-500/20' },
                ].map((s, i) => (
                    <div key={i} className={`bg-gray-900/50 border ${s.border} rounded-2xl p-5 bg-gradient-to-br ${s.bg}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
                            {s.icon}
                        </div>
                        <div className="text-2xl font-black text-white">
                            ₺{formatCurrency(s.value || 0)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pt-4">
                {[
                    { key: 'bank_transfer', label: 'Havale Ödemeleri', icon: <Banknote className="w-4 h-4" /> },
                    { key: 'credit_card', label: 'Kredi Kartı Ödemeleri', icon: <CreditCard className="w-4 h-4" /> },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all -mb-px ${tab === t.key ? 'border-purple-500 text-white bg-purple-500/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Bank Transfer Tab */}
            {tab === 'bank_transfer' && (
                <div className="space-y-6">
                    {/* Pending */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Onay Bekleyen ({pendingBankOrders.length})
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>
                        ) : pendingBankOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-900/30 rounded-3xl border border-dashed border-white/5">
                                <CheckCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Onay bekleyen havale bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingBankOrders.map((order: any) => (
                                    <div 
                                        key={order._id} 
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-gray-800/40 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-white/20 transition-all cursor-pointer group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                                <span className="font-bold text-white group-hover:text-purple-400 transition-colors">{order.userId?.studioName || order.userId?.name || '—'}</span>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">{order.userId?.email}</p>
                                            
                                            {order.bankName && (
                                                <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
                                                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                                        {order.bankName} {order.bankIban && `— ${order.bankIban}`}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-3 text-[11px]">
                                                <span className="text-gray-500">Sipariş: <span className="text-gray-300 font-mono">{order.orderNo}</span></span>
                                                <span className="text-gray-500">Paket: <span className="text-gray-300">{order.packageId?.name || '—'}</span></span>
                                                <span className="text-gray-400 font-bold">₺{formatCurrency(order.amount || 0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleAction(order._id, 'approve')}
                                                disabled={!!actionLoading}
                                                className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading === order._id + 'approve' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleAction(order._id, 'reject')}
                                                disabled={!!actionLoading}
                                                className="h-11 px-6 bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 text-sm font-bold rounded-xl border border-white/5 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading === order._id + 'reject' ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Reddet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* History */}
                    {historyBankOrders.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Geçmiş İşlemler</h2>
                                <button
                                    onClick={handleClearHistory}
                                    disabled={clearingHistory}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 rounded-xl text-red-400 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {clearingHistory ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                            Temizleniyor...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-3.5 h-3.5" />
                                            Geçmişi Temizle
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {historyBankOrders.map((order: any) => (
                                    <div 
                                        key={order._id} 
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-gray-900/40 border border-white/5 rounded-xl px-5 py-3 flex items-center gap-4 hover:border-white/10 transition-all cursor-pointer group"
                                    >
                                        <span className="font-semibold text-gray-300 flex-1 group-hover:text-white transition-colors">{order.userId?.studioName || order.userId?.name || '—'}</span>
                                        <span className="text-xs text-gray-500 font-mono hidden md:inline">{order.orderNo}</span>
                                        <span className="text-sm text-white font-bold">₺{formatCurrency(order.amount || 0)}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Credit Card Tab */}
            {tab === 'credit_card' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>
                    ) : ccOrders.length === 0 ? (
                        <div className="bg-gray-900/30 border border-dashed border-white/5 rounded-3xl text-center py-20">
                            <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm">Henüz kredi kartı ile yapılmış bir ödeme bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {ccOrders.map((order: any) => (
                                <div 
                                    key={order._id} 
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-gray-800/40 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors uppercase">
                                                {order.userId?.studioName || order.userId?.name || 'Misafir'}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-medium">{new Date(order.createdAt).toLocaleString('tr-TR')} | {order.packageId?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-base font-black text-white">₺{formatCurrency(order.amount || 0)}</div>
                                        <p className="text-[10px] text-gray-500 font-mono">{order.orderNo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Member Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className="relative bg-gray-900 border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-8 bg-gradient-to-br from-gray-800/50 to-transparent border-b border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                    Üyelik ve Ödeme Detayı
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">{selectedOrder.userId?.studioName || 'Stüdyo Adı Mevcut Değil'}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <span className="font-medium">{selectedOrder.userId?.name || selectedOrder.draftUserData?.name || '—'}</span>
                                <span className="text-gray-600">•</span>
                                <span>{selectedOrder.userId?.email || selectedOrder.draftUserData?.email}</span>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8">
                            {/* Member Info Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Üye Bilgileri</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">T.C. / Kimlik No</p>
                                        <p className="text-sm text-white font-mono">{selectedOrder.userId?.billingInfo?.identityNumber || 'Belirtilmemiş'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Telefon</p>
                                        <p className="text-sm text-white">{selectedOrder.userId?.phone || selectedOrder.draftUserData?.phone || 'Belirtilmemiş'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Firma Türü</p>
                                        <p className="text-sm text-white uppercase">{selectedOrder.userId?.billingInfo?.companyType === 'corporate' ? 'Kurumsal' : 'Bireysel'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kayıt Tarihi</p>
                                        <p className="text-sm text-white">{new Date(selectedOrder.userId?.createdAt || selectedOrder.createdAt).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info Section */}
                            <div className="pt-8 border-t border-white/5">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Sipariş Bilgileri</h4>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-400">Sipariş Numarası</span>
                                        <span className="text-sm text-white font-mono">{selectedOrder.orderNo}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-400">Satın Alınan Paket</span>
                                        <span className="text-sm text-white font-bold">{selectedOrder.packageId?.name || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-400">Ödeme Yöntemi</span>
                                        <span className="text-sm text-white uppercase tracking-wider font-bold">{selectedOrder.paymentMethod === 'bank_transfer' ? 'Havale/EFT' : 'Kredi Kartı'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <span className="text-base font-bold text-white">Toplam Ödeme</span>
                                        <span className="text-xl font-black text-purple-400">₺{formatCurrency(selectedOrder.amount || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-950/50 flex justify-between items-center gap-3">
                            {/* Show action buttons for awaiting_transfer orders */}
                            {selectedOrder.status === 'awaiting_transfer' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            handleAction(selectedOrder._id, 'approve');
                                            setSelectedOrder(null);
                                        }}
                                        disabled={!!actionLoading}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading === selectedOrder._id + 'approve' ? (
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        )}
                                        Onayla
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAction(selectedOrder._id, 'reject');
                                            setSelectedOrder(null);
                                        }}
                                        disabled={!!actionLoading}
                                        className="px-6 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {actionLoading === selectedOrder._id + 'reject' ? (
                                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <XCircle className="w-3.5 h-3.5" />
                                        )}
                                        Reddet
                                    </button>
                                </div>
                            )}
                            
                            {/* Show Delete button only for history items (completed or failed) */}
                            {(selectedOrder.status === 'completed' || selectedOrder.status === 'failed') && (
                                <button 
                                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                                    disabled={deletingOrder}
                                    className="px-6 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deletingOrder ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                            Siliniyor...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-3.5 h-3.5" />
                                            Siparişi Sil
                                        </>
                                    )}
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl transition-all active:scale-95 ml-auto"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
