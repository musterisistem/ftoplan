'use client';

import { useState } from 'react';
import { Plus, Wallet, FileText, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import { Payment } from '@/types';

// Mock data
const mockPayments = [
    { id: '1', amount: 5000, date: '2026-01-10', type: 'kapora', description: 'Sözleşme kaporası' },
    { id: '2', amount: 10000, date: '2026-03-15', type: 'havale', description: 'Ara ödeme' },
];

export default function FinancialPanel() {
    const [payments, setPayments] = useState(mockPayments);
    const contractTotal = 35000;
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = contractTotal - totalPaid;

    const paymentPercentage = Math.round((totalPaid / contractTotal) * 100);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Sözleşme Tutarı</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₺{contractTotal.toLocaleString('tr-TR')}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Tahsil Edilen</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₺{totalPaid.toLocaleString('tr-TR')}</p>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${paymentPercentage}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Kalan Bakiye</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-600">₺{balance.toLocaleString('tr-TR')}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-purple-600" />
                        Ödeme Geçmişi
                    </h3>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Ödeme Ekle
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(payment.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ₺{payment.amount.toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                        {payment.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.description}
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
