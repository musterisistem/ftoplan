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
    const [bankOrders, setBankOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchBankOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/bank-transfers');
            if (!res.ok) throw new Error('Sunucu hatası');
            const data = await res.json();
            setBankOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching bank orders:', error);
            showAlert('Havale listesi yüklenemedi. Lütfen sayfayı yenileyin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBankOrders(); }, []);

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
                fetchBankOrders();
            } else {
                showAlert(data.error || 'İşlem başarısız', 'error');
            }
        } catch {
            showAlert('Sunucuya bağlanılamadı', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const pendingOrders = bankOrders.filter(o => o.status === 'awaiting_transfer');
    const completedOrders = bankOrders.filter(o => o.status !== 'awaiting_transfer');

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Ödemeler</h1>
                    <p className="text-gray-400 text-sm">Kredi kartı ve havale ödemelerini yönetin.</p>
                </div>
                <button onClick={fetchBankOrders} className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white hover:bg-gray-700 transition-colors text-sm">
                    <RefreshCw className="w-4 h-4" /> Yenile
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-0">
                {[
                    { key: 'bank_transfer', label: 'Havale Ödemeleri', icon: <Banknote className="w-4 h-4" /> },
                    { key: 'credit_card', label: 'Kredi Kartı Ödemeleri', icon: <CreditCard className="w-4 h-4" /> },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key as any)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${tab === t.key ? 'border-purple-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
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
                            <Clock className="w-4 h-4" /> Onay Bekleyen ({pendingOrders.length})
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>
                        ) : pendingOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-800/30 rounded-3xl border border-dashed border-white/10">
                                <CheckCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">Onay bekleyen havale bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingOrders.map((order: any) => (
                                    <div key={order._id} className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                                <span className="font-bold text-white">{order.userId?.name || '—'}</span>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="text-sm text-gray-400">{order.userId?.email}</p>
                                            
                                            {order.bankName && (
                                                <div className="flex items-center gap-2 mt-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
                                                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                                        {order.bankName} {order.bankIban && `— ${order.bankIban}`}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-500 mt-2">
                                                Sipariş: <span className="font-mono text-gray-300">{order.orderNo}</span> |
                                                Paket: {order.packageId?.name || '—'} |
                                                Tutar: <span className="text-white font-semibold">₺{(order.amount || 0).toLocaleString('tr-TR')}</span>
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString('tr-TR')}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleAction(order._id, 'approve')}
                                                disabled={!!actionLoading}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === order._id + 'approve' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleAction(order._id, 'reject')}
                                                disabled={!!actionLoading}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 text-sm font-bold rounded-xl border border-red-700/50 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === order._id + 'reject' ? <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Reddet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* History */}
                    {completedOrders.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Geçmiş Havale İşlemleri</h2>
                            <div className="space-y-2">
                                {completedOrders.map((order: any) => (
                                    <div key={order._id} className="bg-gray-800/30 border border-white/5 rounded-xl px-5 py-3 flex items-center gap-4 flex-wrap">
                                        <span className="font-medium text-gray-300 flex-1">{order.userId?.name || '—'}</span>
                                        <span className="text-sm text-gray-500 font-mono">{order.orderNo}</span>
                                        {order.bankName && (
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                                                {order.bankName}
                                            </span>
                                        )}
                                        <span className="text-sm text-white font-semibold">₺{(order.amount || 0).toLocaleString('tr-TR')}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Credit Card Notice */}
            {tab === 'credit_card' && (
                <div className="bg-gray-800/30 border border-dashed border-white/10 rounded-3xl text-center py-20">
                    <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Kredi Kartı Ödemeleri</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        Kredi kartı ödemeleri PayTR tarafından otomatik olarak onaylanmaktadır. Manuel bir işlem gerekmez.
                    </p>
                    <p className="text-gray-500 text-xs mt-4">
                        Detaylı ödeme geçmişi için PayTR merchant panelinizi kontrol edin.
                    </p>
                </div>
            )}
        </div>
    );
}
