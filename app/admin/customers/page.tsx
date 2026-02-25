'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    UserPlus,
    Calendar,
    Edit2,
    Trash2,
    Phone,
    Mail,
    CheckCircle2,
    Loader2,
    ChevronRight,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAlert } from '@/context/AlertContext';

interface Customer {
    _id: string;
    brideName: string;
    groomName?: string;
    phone: string;
    email?: string;
    status: 'active' | 'completed' | 'archived';
    createdAt: string;
    notes?: string;
}

export default function CustomersPage() {
    const { showAlert } = useAlert();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/api/customers');
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
        fetchCustomers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCustomers(prev => prev.filter(c => c._id !== id));
                showAlert('Müşteri başarıyla silindi', 'success');
            } else {
                showAlert('Silme işlemi başarısız', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const name = `${customer.brideName || ''} ${customer.groomName || ''}`.toLowerCase();
        const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
            customer.phone?.includes(searchQuery) ||
            customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        completed: customers.filter(c => c.status === 'completed').length,
        archived: customers.filter(c => c.status === 'archived').length
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">Müşteriler</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">{customers.length} kayıtlı müşteri</p>
                </div>
                <Link
                    id="tour-new-customer-btn"
                    href="/admin/appointments/new"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                    <UserPlus className="w-4 h-4" />
                    Yeni Müşteri Ekle
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-200/60 shadow-sm flex flex-col overflow-hidden">

                {/* Toolbar */}
                <div className="p-5 border-b border-zinc-200/60 bg-white/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="İsim, telefon veya e-posta ile ara..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-full text-sm font-medium focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all shadow-sm text-zinc-700"
                        />
                    </div>

                    <div className="flex bg-zinc-100/80 p-1.5 rounded-full w-full md:w-auto overflow-x-auto custom-scrollbar">
                        {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex-1 md:flex-none px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filterStatus === status
                                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50'
                                    : 'text-zinc-500 hover:text-zinc-800'
                                    }`}
                            >
                                {status === 'all' ? 'Tümü' : status === 'active' ? 'Aktif' : status === 'completed' ? 'Tamamlanan' : 'Arşiv'}
                                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filterStatus === status ? 'bg-zinc-100 text-zinc-800' : 'bg-transparent text-zinc-400'}`}>
                                    {statusCounts[status]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Header Row */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-10 py-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-4">Müşteri Profili</div>
                    <div className="col-span-3">İletişim</div>
                    <div className="col-span-2">Durum</div>
                    <div className="col-span-3 text-right">İşlemler</div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-500">Müşteriler Yükleniyor...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCustomers.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-900 font-semibold mb-1">Müşteri Bulunamadı</p>
                        <p className="text-slate-500 text-sm">Arama kriterlerinize uygun sonuç yok veya henüz müşteri eklenmemiş.</p>
                    </div>
                )}

                {/* Customer Rows */}
                {!loading && filteredCustomers.length > 0 && (
                    <div className="px-4 pb-4 space-y-3">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer._id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-300 items-center rounded-full group cursor-default"
                            >
                                {/* Customer Info */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm flex-shrink-0">
                                        {customer.brideName?.charAt(0) || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-zinc-800 text-sm truncate group-hover:text-zinc-950 transition-colors">
                                            {customer.brideName}{customer.groomName ? ` & ${customer.groomName}` : ''}
                                        </p>
                                        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                                            Kayıt: {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="col-span-1 md:col-span-3 space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="truncate">{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                        <Mail className="w-3.5 h-3.5 text-zinc-300" />
                                        <span className="truncate">{customer.email || '-'}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2 flex items-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${customer.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : customer.status === 'completed'
                                            ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                                        }`}>
                                        {customer.status === 'active' ? 'Aktif' : customer.status === 'completed' ? 'Tamamlandı' : 'Arşiv'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/customers/${customer._id}/manage`}
                                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                        Yönet
                                    </Link>
                                    <Link
                                        href={`/admin/appointments/new?customer=${customer._id}`}
                                        className="p-2 text-zinc-500 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded-full transition-all"
                                        title="Randevu Ekle"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/admin/customers/${customer._id}`}
                                        className="p-2 text-zinc-500 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 rounded-full transition-all"
                                        title="Düzenle"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer._id)}
                                        className="p-2 text-zinc-400 hover:text-rose-600 bg-zinc-50 border border-zinc-200 hover:border-rose-200 hover:bg-rose-50 rounded-full transition-all"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {filteredCustomers.length > 0 && !loading && (
                    <div className="px-6 py-5 border-t border-white/40 bg-white/40 text-xs text-slate-500 font-semibold text-center md:text-left">
                        Toplam <span className="font-bold text-indigo-600">{filteredCustomers.length}</span> müşteri gösteriliyor.
                    </div>
                )}
            </div>
        </div>
    );
}
