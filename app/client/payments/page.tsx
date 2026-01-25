'use client';

import { Wallet, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const mockPayments = {
    contractTotal: 35000,
    paid: 15000,
    balance: 20000,
    history: [
        { id: 1, date: '2026-01-10', amount: 5000, type: 'Kapora', status: 'completed' },
        { id: 2, date: '2026-03-15', amount: 10000, type: 'Ara Ödeme', status: 'completed' },
    ],
    nextPayment: { date: '2026-06-01', amount: 20000 }
};

export default function ClientPaymentsPage() {
    const progress = Math.round((mockPayments.paid / mockPayments.contractTotal) * 100);

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ödemelerim</h1>
                <p className="mt-1 text-sm text-gray-500">Sözleşme ve ödeme detaylarınızı buradan takip edebilirsiniz.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-16 h-16 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Toplam Sözleşme</p>
                    <p className="text-3xl font-bold text-gray-900">₺{mockPayments.contractTotal.toLocaleString('tr-TR')}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Ödenen Tutar</p>
                    <p className="text-3xl font-bold text-green-600">₺{mockPayments.paid.toLocaleString('tr-TR')}</p>
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock className="w-16 h-16 text-orange-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Kalan Bakiye</p>
                    <p className="text-3xl font-bold text-orange-500">₺{mockPayments.balance.toLocaleString('tr-TR')}</p>
                </div>
            </div>

            {/* Next Payment Alert */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Sonraki Ödeme Tarihi</h3>
                        <p className="text-orange-700 text-sm mt-1">
                            Kalan ₺{mockPayments.nextPayment.amount.toLocaleString('tr-TR')} tutarındaki ödemeniz
                            <span className="font-bold ml-1">{new Date(mockPayments.nextPayment.date).toLocaleDateString('tr-TR')}</span> tarihinde yapılmalıdır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Ödeme Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockPayments.history.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(payment.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₺{payment.amount.toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {payment.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            Ödendi
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
