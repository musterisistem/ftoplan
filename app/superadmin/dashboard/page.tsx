'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    Users,
    TrendingUp,
    Server,
    CreditCard,
    Calendar,
    Activity,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface Stats {
    users?: { total: number; active: number };
    storage?: { totalBytes: number; limitBytes: number };
    analytics?: { today: number; month: number; total: number; recent: any[] };
    expiringSubscriptions?: number;
}

export default function SuperAdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({
        users: { total: 0, active: 0 },
        storage: { totalBytes: 0, limitBytes: 0 },
        analytics: { today: 0, month: 0, total: 0, recent: [] },
        expiringSubscriptions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/superadmin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Görüntülenme (Toplam)',
            value: stats.analytics?.total || 0,
            icon: TrendingUp,
            subtext: 'Tüm zamanlar',
            color: 'from-amber-500 to-orange-500',
            isPositive: true
        },
        {
            title: 'Toplam Depolama',
            value: `${((stats.storage?.totalBytes || 0) / 1024 / 1024 / 1024).toFixed(1)} GB`,
            icon: Server,
            subtext: `Hedef Limit: ${((stats.storage?.limitBytes || 0) / 1024 / 1024 / 1024).toFixed(0)} GB`,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Görüntülenme (Bugün)',
            value: stats.analytics?.today || 0,
            icon: Activity,
            subtext: 'Sayfa Gösterimi',
            color: 'from-green-500 to-emerald-500',
            isPositive: true
        },
        {
            title: 'Görüntülenme (Bu Ay)',
            value: stats.analytics?.month || 0,
            icon: Calendar,
            subtext: 'Bu ay toplam',
            color: 'from-amber-500 to-orange-500'
        },
        {
            title: 'Süresi Doluyor',
            value: stats.expiringSubscriptions || 0,
            icon: Calendar,
            subtext: '30 gün içinde',
            color: 'from-red-500 to-rose-500',
            isWarning: (stats.expiringSubscriptions || 0) > 0
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Hoş Geldiniz, {session?.user?.name || 'Sistem Yöneticisi'}
                </h1>
                <p className="text-gray-400">
                    Kadraj Panel platformunun genel durumunu ve canlı istatistiklerini buradan takip edebilirsiniz.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${stat.isWarning ? 'ring-2 ring-red-500/50' : ''}`}
                    >
                        {/* Gradient Background */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl rounded-full -mr-8 -mt-8`}></div>

                        <div className="relative">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>

                            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>

                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-white">{stat.value}</span>
                                {stat.subtext && (
                                    <span className="text-sm text-gray-500 mb-1">{stat.subtext}</span>
                                )}
                            </div>

                            {stat.change && (
                                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    <span>{stat.change}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* LIVE ANALYTICS TABLE */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        Canlı Gezinme Akışı (Son 10)
                    </h2>
                    <span className="text-xs text-green-400 animate-pulse">● Canlı</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-4 py-3 text-left">Ziyaretçi</th>
                                <th className="px-4 py-3 text-left">Sayfa</th>
                                <th className="px-4 py-3 text-left">Stüdyo</th>
                                <th className="px-4 py-3 text-right">Zaman</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.analytics?.recent && stats.analytics.recent.length > 0 ? (
                                stats.analytics.recent.map((view: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${view.role === 'admin' ? 'bg-purple-500' : 'bg-blue-400'}`}></div>
                                                <span className="text-sm text-gray-300">{view.role === 'guest' ? 'Misafir' : view.role}</span>
                                                <span className="text-xs text-gray-500 font-mono">({view.visitorId?.substring(0, 5)})</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-white font-mono">{view.path}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">
                                            {view.targetUserId?.studioName || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-gray-400">
                                            {new Date(view.timestamp).toLocaleTimeString('tr-TR')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Henüz veri yok...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Photographers */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Son Kayıt Olan Fotoğrafçılar
                    </h2>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Yükleniyor...</div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Henüz kayıtlı fotoğrafçı yok.
                                <br />
                                <span className="text-sm">Yeni fotoğrafçı eklemek için "Fotoğrafçılar" sayfasını ziyaret edin.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subscription Alerts */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        Abonelik Uyarıları
                    </h2>

                    <div className="space-y-3">
                        <div className="text-center py-8 text-gray-500">
                            Yakında süresi dolacak abonelik yok.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
