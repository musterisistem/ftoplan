'use client';

import { useState, useEffect } from 'react';
import {
    Mail,
    Send,
    Users,
    Filter,
    History,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Code
} from 'lucide-react';

interface CommunicationLog {
    _id: string;
    subject: string;
    message: string;
    recipientCount: number;
    status: string;
    sentAt: string;
    filter: string;
}

export default function BulkEmailPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [htmlMode, setHtmlMode] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sending, setSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [history, setHistory] = useState<CommunicationLog[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (showHistory) {
            fetchHistory();
        }
    }, [showHistory]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/superadmin/communications/history?type=email');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleSend = async () => {
        if (!subject || !message) {
            alert('Konu ve mesaj alanları zorunludur');
            return;
        }

        if (!confirm(`${getFilterText(filter)} adresine email göndermek istediğinize emin misiniz?`)) {
            return;
        }

        setSending(true);
        setResult(null);

        try {
            const res = await fetch('/api/superadmin/communications/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    message,
                    htmlContent: htmlMode ? message : undefined,
                    filter
                })
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data);
                setSubject('');
                setMessage('');
                alert(`Email başarıyla gönderildi!\n\nGönderilen: ${data.sent}\nBaşarısız: ${data.failed}\nToplam: ${data.total}`);
            } else {
                alert('Hata: ' + data.error);
            }
        } catch (error) {
            console.error('Send error:', error);
            alert('Email gönderilirken hata oluştu');
        } finally {
            setSending(false);
        }
    };

    const getFilterText = (f: string) => {
        const filters: any = {
            'all': 'Tüm fotoğrafçılara',
            'trial': 'Deneme paketindeki fotoğrafçılara',
            'starter': 'Başlangıç paketindeki fotoğrafçılara',
            'pro': 'Pro paketindeki fotoğrafçılara',
            'premium': 'Premium paketindeki fotoğrafçılara',
            'active': 'Aktif fotoğrafçılara',
            'inactive': 'Pasif fotoğrafçılara'
        };
        return filters[f] || f;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'partial': return <Clock className="w-5 h-5 text-yellow-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Mail className="w-8 h-8" />
                        Toplu Email Gönderimi
                    </h1>
                    <p className="text-gray-400 mt-1">Tüm fotoğrafçılara email gönderin</p>
                </div>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-white/10"
                >
                    <History className="w-5 h-5" />
                    {showHistory ? 'Yeni Email' : 'Geçmiş'}
                </button>
            </div>

            {showHistory ? (
                /* History View */
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white">Gönderim Geçmişi</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Tarih</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Konu</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Alıcı</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Sayı</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((log) => (
                                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            {new Date(log.sentAt).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">{log.subject}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{getFilterText(log.filter)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{log.recipientCount}</td>
                                        <td className="px-6 py-4">{getStatusIcon(log.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Compose View */
                <>
                    {/* Filter Selection */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Filter className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-semibold text-white">Alıcı Seçimi</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['all', 'trial', 'starter', 'pro', 'premium', 'active', 'inactive'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-3 rounded-xl border transition-all ${filter === f
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white'
                                            : 'bg-gray-700/50 border-white/10 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {getFilterText(f).replace('fotoğrafçılara', '').replace('fotoğrafçılara', '')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Email Composer */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">Email İçeriği</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    Önizleme
                                </button>
                                <button
                                    onClick={() => setHtmlMode(!htmlMode)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${htmlMode
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                >
                                    <Code className="w-4 h-4" />
                                    HTML
                                </button>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Konu</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email konusu..."
                                className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                {htmlMode ? 'HTML İçerik' : 'Mesaj'}
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={htmlMode ? '<h1>Merhaba</h1><p>Email içeriğiniz...</p>' : 'Email mesajınızı buraya yazın...'}
                                rows={12}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                            />
                        </div>

                        {/* Preview */}
                        {showPreview && (
                            <div className="border border-purple-500/30 rounded-xl p-6 bg-gray-900/50">
                                <h3 className="text-sm font-medium text-purple-400 mb-3">Önizleme:</h3>
                                <div className="bg-white rounded-lg p-6 text-gray-900">
                                    <h2 className="text-xl font-bold mb-4">{subject || 'Konu'}</h2>
                                    {htmlMode ? (
                                        <div dangerouslySetInnerHTML={{ __html: message }} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message || 'Mesaj içeriği buraya gelecek...'}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {result && (
                            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                    <div>
                                        <p className="text-green-400 font-medium">Email Başarıyla Gönderildi!</p>
                                        <p className="text-sm text-gray-300 mt-1">
                                            Gönderilen: {result.sent} | Başarısız: {result.failed} | Toplam: {result.total}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            disabled={sending || !subject || !message}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                            {sending ? 'Gönderiliyor...' : 'Email Gönder'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
