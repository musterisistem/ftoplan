'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Download, Calendar as CalendarIcon, CheckSquare, Square, MinusSquare } from 'lucide-react';

export default function CustomerPoolPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Excel export options
    const [exportOptions, setExportOptions] = useState({
        brideName: true,
        groomName: true,
        email: true,
        phone: true,
        weddingDate: true,
        photographer: true
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/superadmin/customer-pool');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const searchStr = searchTerm.toLowerCase();
        return (
            customer.brideName?.toLowerCase().includes(searchStr) ||
            customer.groomName?.toLowerCase().includes(searchStr) ||
            customer.email?.toLowerCase().includes(searchStr) ||
            customer.phone?.toLowerCase().includes(searchStr) ||
            customer.photographerId?.name?.toLowerCase().includes(searchStr) ||
            customer.photographerId?.studioName?.toLowerCase().includes(searchStr)
        );
    });

    const toggleAllOptions = () => {
        const allSelected = Object.values(exportOptions).every(v => v);
        const newState = !allSelected;
        setExportOptions({
            brideName: newState,
            groomName: newState,
            email: newState,
            phone: newState,
            weddingDate: newState,
            photographer: newState
        });
    };

    const exportToExcel = () => {
        if (filteredCustomers.length === 0) {
            alert('Dışa aktarılacak müşteri bulunamadı.');
            return;
        }

        const headers = [];
        if (exportOptions.brideName) headers.push('Gelin Adı');
        if (exportOptions.groomName) headers.push('Damat Adı');
        if (exportOptions.email) headers.push('Email');
        if (exportOptions.phone) headers.push('Telefon');
        if (exportOptions.weddingDate) headers.push('Düğün Tarihi');
        if (exportOptions.photographer) headers.push('Fotoğrafçı');

        const rows = filteredCustomers.map(c => {
            const row = [];
            if (exportOptions.brideName) row.push(`"${c.brideName || ''}"`);
            if (exportOptions.groomName) row.push(`"${c.groomName || ''}"`);
            if (exportOptions.email) row.push(`"${c.email || ''}"`);
            if (exportOptions.phone) row.push(`"${c.phone || ''}"`);
            if (exportOptions.weddingDate) row.push(`"${c.weddingDate ? new Date(c.weddingDate).toLocaleDateString('tr-TR') : ''}"`);
            if (exportOptions.photographer) row.push(`"${c.photographerId?.studioName || c.photographerId?.name || 'Silinmiş'}"`);
            return row.join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `musteri_havuzu_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const allSelected = Object.values(exportOptions).every(v => v);
    const someSelected = Object.values(exportOptions).some(v => v) && !allSelected;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="w-8 h-8" />
                        Müşteri Havuzu
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Tüm fotoğrafçıların eklediği toplam {customers.length} müşteri kaydı
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Gelin/Damat adı, email, telefon veya fotoğrafçı ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Export Options */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Excel Çıktı Ayarları</h2>
                    <button
                        onClick={toggleAllOptions}
                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        {allSelected ? <CheckSquare className="w-4 h-4" /> : someSelected ? <MinusSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        {allSelected ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { key: 'brideName', label: 'Gelin Adı' },
                        { key: 'groomName', label: 'Damat Adı' },
                        { key: 'email', label: 'Email' },
                        { key: 'phone', label: 'Telefon' },
                        { key: 'weddingDate', label: 'Düğün Tarihi' },
                        { key: 'photographer', label: 'Fotoğrafçı' }
                    ].map(option => (
                        <label key={option.key} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={exportOptions[option.key as keyof typeof exportOptions]}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, [option.key]: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{option.label}</span>
                        </label>
                    ))}
                </div>
                <button
                    onClick={exportToExcel}
                    disabled={!Object.values(exportOptions).some(v => v)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                    <Download className="w-5 h-5" />
                    Excel İndir ({filteredCustomers.length} kayıt)
                </button>
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-gray-900/50">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Gelin & Damat</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">İletişim</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Düğün Tarihi</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Fotoğrafçı</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                            Yükleniyor...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        Müşteri kaydı bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{customer.brideName}</span>
                                                {customer.groomName && <span className="text-sm text-gray-400">{customer.groomName}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-300">{customer.email || '-'}</span>
                                                <span className="text-xs text-gray-500">{customer.phone || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{customer.weddingDate ? new Date(customer.weddingDate).toLocaleDateString('tr-TR') : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm">
                                                    {customer.photographerId ? customer.photographerId.name : 'Silinmiş'}
                                                </span>
                                                {customer.photographerId?.studioName && (
                                                    <span className="text-xs text-gray-400">{customer.photographerId.studioName}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-400">
                                                {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
