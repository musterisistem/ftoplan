'use client';

import { useState, useEffect } from 'react';
import {
    UserX,
    UserCheck,
    Search,
    Users,
    ShieldAlert,
    Loader2,
    Mail,
    CheckCircle2,
    AlertCircle,
    User as UserIcon
} from 'lucide-react';

interface BlockedCustomer {
    id: string;
    userId: string;
    username: string;
    name: string;
    isBlocked: boolean;
    email: string;
}

export default function BlockedCustomersPage() {
    const [customers, setCustomers] = useState<BlockedCustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/customers/blocked');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlock = async (userId: string, currentStatus: boolean) => {
        try {
            setActionLoading(userId);
            const res = await fetch('/api/admin/customers/blocked', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isBlocked: !currentStatus })
            });

            if (res.ok) {
                setCustomers(prev => prev.map(c =>
                    c.userId === userId ? { ...c, isBlocked: !currentStatus } : c
                ));
                setNotification({
                    type: 'success',
                    message: !currentStatus ? 'Müşteri başarıyla engellendi.' : 'Müşterinin engeli kaldırıldı.'
                });
                setTimeout(() => setNotification(null), 3000);
            } else {
                throw new Error('İşlem başarısız');
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Bir hata oluştu.' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header section */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shadow-sm border border-gray-200">
                        <UserX className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Engellenenler</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Müşterilerinizin sisteme giriş yetkisini yönetin</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Müşteri ismi veya kullanıcı adı ile ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7A70BA]/10 focus:border-[#7A70BA] transition-all text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                    />
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-8 right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-300`}>
                    <div className={`px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="font-bold text-sm">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-sm text-gray-700 leading-relaxed font-medium">
                    <strong className="text-gray-900 font-semibold">Bilgilendirme:</strong> Engellediğiniz müşteriler, doğru kullanıcı adı ve şifreye sahip olsalar dahi sisteme giriş yapamazlar. Giriş denediklerinde hesaplarının engelli olduğuna dair bir uyarı alırlar. Siz engeli kaldırmadığınız sürece bu kısıtlama devam eder.
                </div>
            </div>

            {/* Customers List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Müşteri / Üye</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kullanıcı Bilgileri</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                                        <span className="text-sm font-semibold text-gray-500">Yükleniyor...</span>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 group-hover:bg-white transition-colors">
                                                    <UserIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                                                    <div className="text-xs font-medium text-gray-500 mt-0.5">Müşteri No: #{customer.id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 bg-gray-100 w-fit px-2 py-0.5 rounded-md border border-gray-200">
                                                    <span className="text-gray-400">@</span>{customer.username}
                                                </div>
                                                <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {customer.email || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border shadow-sm ${customer.isBlocked
                                                    ? 'bg-red-50 text-red-600 border-red-200'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    }`}>
                                                    {customer.isBlocked ? 'Engelli' : 'Aktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleBlock(customer.userId, customer.isBlocked)}
                                                disabled={actionLoading === customer.userId}
                                                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm border ${customer.isBlocked
                                                    ? 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                                    : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                                                    } disabled:opacity-50`}
                                            >
                                                {actionLoading === customer.userId ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : customer.isBlocked ? (
                                                    <>
                                                        <UserCheck className="w-4 h-4" />
                                                        Engeli Kaldır
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserX className="w-4 h-4" />
                                                        Müşteriyi Engelle
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <div className="text-sm font-semibold text-gray-500">Müşteri bulunamadı.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
