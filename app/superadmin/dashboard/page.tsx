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
    totalPhotographers: number;
    activePhotographers: number;
    totalStorage: number;
    usedStorage: number;
    monthlyRevenue: number;
    expiringSubscriptions: number;
}

export default function SuperAdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({
        totalPhotographers: 0,
        activePhotographers: 0,
        totalStorage: 0,
        usedStorage: 0,
        monthlyRevenue: 0,
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
            title: 'Toplam Fotoğrafçı',
            value: stats.totalPhotographers,
            icon: Users,
            change: '+3',
            isPositive: true,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Aktif Fotoğrafçı',
            value: stats.activePhotographers,
            icon: Activity,
            change: `${stats.activePhotographers}/${stats.totalPhotographers}`,
            isPositive: true,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Toplam Depolama',
            value: `${(stats.usedStorage / 1024 / 1024 / 1024).toFixed(1)} GB`,
            icon: Server,
            subtext: `/ ${(stats.totalStorage / 1024 / 1024 / 1024).toFixed(0)} GB`,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Aylık Gelir',
            value: `₺${stats.monthlyRevenue.toLocaleString()}`,
            icon: CreditCard,
            change: '+12%',
            isPositive: true,
            color: 'from-amber-500 to-orange-500'
        },
        {
            title: 'Süresi Doluyor',
            value: stats.expiringSubscriptions,
            icon: Calendar,
            subtext: '30 gün içinde',
            color: 'from-red-500 to-rose-500',
            isWarning: stats.expiringSubscriptions > 0
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
                    FotoPlan platformunun genel durumunu buradan takip edebilirsiniz.
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
