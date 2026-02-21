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
        <div className="p-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
                    <p className="text-sm text-gray-500 mt-1">{customers.length} kayıtlı müşteri</p>
                </div>
                <Link
                    id="tour-new-customer-btn"
                    href="/admin/appointments/new"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Yeni Müşteri
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="İsim, telefon veya e-posta ile ara..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-1.5">
                        {(['all', 'active', 'archived'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterStatus === status
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'Tümü' : status === 'active' ? 'Aktif' : 'Arşiv'} ({statusCounts[status]})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="col-span-4">Müşteri</div>
                    <div className="col-span-3">İletişim</div>
                    <div className="col-span-2">Durum</div>
                    <div className="col-span-3 text-right">İşlemler</div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Yükleniyor...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCustomers.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">Müşteri bulunamadı</p>
                    </div>
                )}

                {/* Customer Rows */}
                {!loading && filteredCustomers.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer._id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:px-5 md:py-3.5 hover:bg-gray-50/50 transition-colors items-center"
                            >
                                {/* Customer Info */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                                        {customer.brideName?.charAt(0) || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">
                                            {customer.brideName}{customer.groomName ? ` & ${customer.groomName}` : ''}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="col-span-1 md:col-span-3 space-y-0.5">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Phone className="w-3 h-3 text-gray-400" />
                                        <span>{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Mail className="w-3 h-3 text-gray-400" />
                                        <span className="truncate">{customer.email || '-'}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${customer.status === 'active'
                                        ? 'bg-green-50 text-green-700'
                                        : customer.status === 'completed'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {customer.status === 'active' ? (
                                            <><CheckCircle2 className="w-3 h-3" /> Aktif</>
                                        ) : customer.status === 'completed' ? (
                                            <><CheckCircle2 className="w-3 h-3" /> Bitti</>
                                        ) : (
                                            <><XCircle className="w-3 h-3" /> Arşiv</>
                                        )}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-1.5">
                                    <Link
                                        href={`/admin/customers/${customer._id}/manage`}
                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                                    >
                                        Müşteri Sayfası
                                        <ChevronRight className="w-3 h-3" />
                                    </Link>
                                    <Link
                                        href={`/admin/appointments/new?customer=${customer._id}`}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Randevu"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/admin/customers/${customer._id}`}
                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Düzenle"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer._id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                {filteredCustomers.length > 0 && (
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        {filteredCustomers.length} müşteri gösteriliyor
                    </div>
                )}
            </div>
        </div>
    );
}
