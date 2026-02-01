'use client';

import React, { useEffect, useState } from 'react';
import { Camera, Users, Calendar, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import DashboardSlider from '@/components/admin/dashboard/DashboardSlider';
import { SchedulePanel } from '@/components/admin/dashboard/DashboardComponents';
import { WaterFillStorage } from '@/components/admin/dashboard/WaterFillStorage';
import { ActiveAlbumsWidget } from '@/components/admin/dashboard/ActiveAlbumsWidget';
import { UpcomingShootsWidget } from '@/components/admin/dashboard/UpcomingShootsWidget';

// --- Data Fetching ---
async function getDashboardStats() {
    try {
        const res = await fetch('/api/admin/dashboard/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return res.json();
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        return null;
    }
}

export default function DashboardPage() {
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        getDashboardStats().then(data => {
            if (data) setStats(data);
            setLoading(false);
        });

        // Update time every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) {
        return <div className="p-6 text-red-500">Veri yüklenemedi.</div>;
    }

    // Get greeting based on time
    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi Günler' : 'İyi Akşamlar';

    // Format date
    const dateStr = currentTime.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const timeStr = currentTime.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{greeting}!</h1>
                        <p className="text-sm text-gray-500 mt-1">Bugün, {dateStr}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Aktif</span>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">{timeStr}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 space-y-6">
                {/* Main Grid: Left (Slider + Metrics) and Right (Calendar) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Slider + Metrics (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Slider */}
                        <DashboardSlider />

                        {/* 4 Compact Metrics - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Metric 1 - Photos */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                                        <Camera className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        +12%
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Toplam Fotoğraf</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.counts.photos.toLocaleString('tr-TR')}</div>
                                    <div className="text-xs text-gray-400">Son 30 gün</div>
                                </div>
                            </div>

                            {/* Metric 2 - Customers */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 transition-all shadow-lg hover:shadow-xl group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        +8%
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Aktif Müşteriler</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.counts.activeCustomers.toLocaleString('tr-TR')}</div>
                                    <div className="text-xs text-gray-400">Toplam müşteri</div>
                                </div>
                            </div>

                            {/* Metric 3 - Shoots */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-green-300 transition-all shadow-lg hover:shadow-xl group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                        Bu ay
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Bu Ayki Çekimler</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.counts.activeShootsMonth}</div>
                                    <div className="text-xs text-gray-400">{stats.todaySchedule?.length || 0} bugün</div>
                                </div>
                            </div>

                            {/* Metric 4 - Revenue */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-orange-300 transition-all shadow-lg hover:shadow-xl group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                                        <DollarSign className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                        -5%
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-500">Toplam Gelir</div>
                                    <div className="text-2xl font-bold text-gray-900">₺{stats.counts.totalRevenue.toLocaleString('tr-TR')}</div>
                                    <div className="text-xs text-gray-400">Tüm zamanlar</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Calendar (1 column, full height) */}
                    <div className="lg:col-span-1">
                        <SchedulePanel
                            calendar={stats.calendar || { currentMonth: 'Aralık 2025', daysWithEvents: [] }}
                            schedule={stats.todaySchedule || []}
                        />
                    </div>
                </div>

                {/* Bottom Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Water Fill Storage */}
                    <WaterFillStorage
                        used={stats.storage.used}
                        limit={stats.storage.limit}
                    />

                    {/* Active Albums Widget */}
                    <ActiveAlbumsWidget albums={stats.activeAlbums || []} />

                    {/* Upcoming Shoots Widget */}
                    <UpcomingShootsWidget shoots={stats.upcomingShootsDetailed || []} />
                </div>
            </div>
        </div>
    );
}
