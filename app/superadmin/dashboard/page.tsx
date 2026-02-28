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

interface LiveStats {
    recent: any[];
    onlineCount: number;
    topPages: { path: string; count: number; title: string }[];
}

export default function SuperAdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({
        users: { total: 0, active: 0 },
        storage: { totalBytes: 0, limitBytes: 0 },
        analytics: { today: 0, month: 0, total: 0, recent: [] },
        expiringSubscriptions: 0
    });
    const [liveData, setLiveData] = useState<LiveStats>({
        recent: [],
        onlineCount: 0,
        topPages: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchLiveAnalytics();

        // Poll live analytics every 10 seconds
        const liveInterval = setInterval(fetchLiveAnalytics, 10000);

        // Poll main stats every 2 minutes
        const statsInterval = setInterval(fetchStats, 120000);

        return () => {
            clearInterval(liveInterval);
            clearInterval(statsInterval);
        };
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

    const fetchLiveAnalytics = async () => {
        try {
            const res = await fetch('/api/superadmin/analytics/live');
            if (res.ok) {
                const data = await res.json();
                setLiveData(data);
            }
        } catch (error) {
            console.error('Error fetching live analytics:', error);
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
            title: 'Online Üyeler',
            value: liveData.onlineCount || 0,
            icon: Users,
            subtext: 'Son 1 saat',
            color: 'from-blue-500 to-indigo-500',
            isPositive: (liveData.onlineCount || 0) > 0
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
            title: 'Toplam Depolama',
            value: `${((stats.storage?.totalBytes || 0) / 1024 / 1024 / 1024).toFixed(1)} GB`,
            icon: Server,
            subtext: `Limit: ${((stats.storage?.limitBytes || 0) / 1024 / 1024 / 1024).toFixed(0)} GB`,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Abonelik Uyarıları',
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
                    Weey.NET platformunun genel durumunu ve canlı istatistiklerini buradan takip edebilirsiniz.
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
                        </div>
                    </div>
                ))}
            </div>

            {/* LIVE ANALYTICS TABLE */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Live Feed */}
                <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-400" />
                            Canlı Gezinme Akışı
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-400 uppercase tracking-wider font-bold">Canlı</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left">Fotoğrafçı / Stüdyo</th>
                                    <th className="px-4 py-3 text-left">Sayfa</th>
                                    <th className="px-4 py-3 text-right">Zaman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {liveData.recent && liveData.recent.length > 0 ? (
                                    liveData.recent.map((view: any, i: number) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white">
                                                        {view.photographerId?.studioName || view.photographerId?.name || 'Sistem Admini'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {view.role === 'admin' ? 'Panel' : 'Stüdyo Sitesi'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] text-gray-300 truncate max-w-[200px]" title={view.path}>
                                                        {view.path}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
                                                        {view.title || 'Sayfa Başlığı Yok'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-gray-400 font-mono">
                                                {new Date(view.timestamp).toLocaleTimeString('tr-TR')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Activity className="w-8 h-8 opacity-20" />
                                                <span>Fotoğrafçı hareketi bekleniyor...</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Pages */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                        En Çok Ziyaret Edilenler
                    </h2>

                    <div className="space-y-4">
                        {(liveData?.topPages?.length || 0) > 0 ? (
                            liveData.topPages.map((page, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="text-sm text-gray-300 truncate" title={page.path}>
                                            {page.title}
                                        </p>
                                        <p className="text-[10px] text-gray-500 truncate mt-0.5 font-mono">
                                            {page.path}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${Math.min(100, (page.count / (liveData?.topPages?.[0]?.count || 1)) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-white w-8 text-right">{page.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-gray-500 text-sm italic">Veri toplanıyor...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Photographers Stats (Static for now as requested) */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        Sistem Özeti
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Toplam Fotoğrafçı</p>
                            <p className="text-xl font-bold text-white">{stats.users?.total || 0}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Aktif Üyeler</p>
                            <p className="text-xl font-bold text-white">{stats.users?.active || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Subscription Alerts */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        Abonelik Durumu
                    </h2>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div>
                            <p className="text-sm font-medium text-red-200">Süresi Yaklaşanlar</p>
                            <p className="text-xs text-red-400/80">30 gün içinde dolacak abonelik sayısı</p>
                        </div>
                        <span className="text-2xl font-bold text-red-500">{stats.expiringSubscriptions || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
