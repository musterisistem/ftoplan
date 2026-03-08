'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Download, Eye, ExternalLink, Calendar as CalendarIcon, Filter, Camera, Mail, X, Send } from 'lucide-react';
import Link from 'next/link';

export default function CustomerPoolPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mail Modal States
    const [showMailModal, setShowMailModal] = useState(false);
    const [mailSubject, setMailSubject] = useState('');
    const [mailMessage, setMailMessage] = useState('');
    const [sendingMail, setSendingMail] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/superadmin/customers');
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
        const matchesSearch = (
            customer.name?.toLowerCase().includes(searchStr) ||
            customer.email?.toLowerCase().includes(searchStr) ||
            customer.phone?.toLowerCase().includes(searchStr) ||
            customer.photographerId?.name?.toLowerCase().includes(searchStr) ||
            customer.photographerId?.studioName?.toLowerCase().includes(searchStr)
        );

        let matchesStatus = true;
        if (statusFilter === 'completed') matchesStatus = customer.isSelectionCompleted === true;
        if (statusFilter === 'pending') matchesStatus = customer.isSelectionCompleted !== true;

        return matchesSearch && matchesStatus;
    });

    const exportToExcel = () => {
        if (filteredCustomers.length === 0) {
            alert('Dışa aktarılacak müşteri bulunamadı.');
            return;
        }

        const headers = ['İsim Soyisim', 'Email', 'Telefon', 'Fotoğrafçı', 'Stüdyo', 'Durum', 'Tarih'];
        const csvContent = [
            headers.join(','),
            ...filteredCustomers.map(c => [
                `"${c.name || ''}"`,
                `"${c.email || ''}"`,
                `"${c.phone || ''}"`,
                `"${c.photographerId?.name || 'Silinmiş Kullanıcı'}"`,
                `"${c.photographerId?.studioName || ''}"`,
                `"${c.isSelectionCompleted ? 'Seçim Tamamlandı' : 'Seçim Bekliyor'}"`,
                `"${new Date(c.createdAt).toLocaleDateString('tr-TR')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'musteri_havuzu.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendBulkEmail = async () => {
        if (!mailSubject || !mailMessage) {
            alert('Lütfen konu ve mesaj alanlarını doldurun.');
            return;
        }

        const emails = filteredCustomers
            .map(c => c.email)
            .filter(email => email && email.includes('@'));

        if (emails.length === 0) {
            alert('Seçili filtreye uygun geçerli e-posta adresine sahip müşteri bulunamadı.');
            return;
        }

        if (!confirm(`${emails.length} müşteriye e-posta gönderilecek. Onaylıyor musunuz?`)) return;

        setSendingMail(true);
        try {
            const res = await fetch('/api/superadmin/communications/customer-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: mailSubject,
                    message: mailMessage,
                    emails
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`E-posta başarıyla gönderildi!\nBaşarılı: ${data.sent}\nBaşarısız: ${data.failed}`);
                setShowMailModal(false);
                setMailSubject('');
                setMailMessage('');
            } else {
                alert('Hata: ' + data.error);
            }
        } catch (error) {
            console.error('Mail error:', error);
            alert('Bir hata oluştu.');
        } finally {
            setSendingMail(false);
        }
    };

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
                        Sistemdeki tüm fotoğrafçıların eklediği toplam {customers.length} müşteri kaydı bulunuyor.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-600/30 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Excel İndir
                    </button>
                    <button
                        onClick={() => setShowMailModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Toplu Mail Gönder
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Müşteri adı, email, telefon veya fotoğrafçı/stüdyo adı ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
                    >
                        <option value="all">Tüm Durumlar</option>
                        <option value="completed">Seçimi Tamamlayan Müşteriler</option>
                        <option value="pending">Seçim Bekleyen, Müşteriler</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-gray-900/50">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Müşteri Detayları</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Fotoğrafçı & Stüdyo</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Durum</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Tarih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                            Yükleniyor...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400">
                                        Müşteri kaydı bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{customer.name}</span>
                                                <span className="text-sm text-gray-400">{customer.email}</span>
                                                {customer.phone && <span className="text-xs text-gray-500">{customer.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-purple-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-sm">
                                                        {customer.photographerId ? customer.photographerId.name : 'Silinmiş Kullanıcı'}
                                                    </span>
                                                    {customer.photographerId?.studioName && (
                                                        <span className="text-xs text-gray-400">{customer.photographerId.studioName}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${customer.isSelectionCompleted
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {customer.isSelectionCompleted ? 'Seçim Tamamlandı' : 'Seçim Bekliyor'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mail Modal */}
            {showMailModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-400" />
                                Müşterilere Toplu Mail Gönder
                            </h2>
                            <button onClick={() => setShowMailModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                                <p className="text-sm text-purple-300">
                                    Filtrelenen <strong>{filteredCustomers.length}</strong> müşteriye (geçerli e-postası olanlara) mail gönderilecektir.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Konu</label>
                                <input
                                    type="text"
                                    value={mailSubject}
                                    onChange={(e) => setMailSubject(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="Mailin konusu..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Mesaj (HTML Destekli)</label>
                                <textarea
                                    value={mailMessage}
                                    onChange={(e) => setMailMessage(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-2 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                                    placeholder="<p>Merhaba değerli müşterimiz,</p>"
                                />
                                <p className="text-xs text-gray-500 mt-2">Mesajınız altyapı tarafından standart kurumsal şablona giydirilerek gönderilir.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-gray-800/50">
                            <button
                                onClick={() => setShowMailModal(false)}
                                className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSendBulkEmail}
                                disabled={sendingMail || !mailSubject || !mailMessage}
                                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                {sendingMail ? 'Gönderiliyor...' : 'Gönder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
