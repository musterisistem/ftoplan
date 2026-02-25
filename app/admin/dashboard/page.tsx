'use client';

import React, { useEffect, useState } from 'react';
import { Camera, Users, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import DashboardSlider from '@/components/admin/dashboard/DashboardSlider';
import { SchedulePanel, MetricCard } from '@/components/admin/dashboard/DashboardComponents';
import { WaterFillStorage } from '@/components/admin/dashboard/WaterFillStorage';
import { ActiveAlbumsWidget } from '@/components/admin/dashboard/ActiveAlbumsWidget';
import { UpcomingShootsWidget } from '@/components/admin/dashboard/UpcomingShootsWidget';

// --- Data Fetching ---
async function getDashboardStats(month?: number, year?: number) {
    try {
        const url = new URL('/api/admin/dashboard/stats', window.location.origin);
        if (month) url.searchParams.set('month', month.toString());
        if (year) url.searchParams.set('year', year.toString());

        const res = await fetch(url.toString(), { cache: 'no-store' });
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
    const [viewDate, setViewDate] = React.useState(new Date());

    const fetchStats = async (date: Date) => {
        setLoading(true);
        const data = await getDashboardStats(date.getMonth() + 1, date.getFullYear());
        if (data) setStats(data);
        setLoading(false);
    };

    React.useEffect(() => {
        fetchStats(viewDate);
    }, [viewDate]);

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        setViewDate(newDate);
    };

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* Main Content */}
            <div className="p-8 space-y-8">
                {/* Main Grid: Left (Slider + Metrics) and Right (Calendar) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Slider + Metrics (2 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Slider */}
                        <DashboardSlider />

                        {/* Activity Graph and Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Monthly Shoots Chart (Spans 4 columns on lg) */}
                            <div className="sm:col-span-2 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Aylık Çekim Performansı</h3>
                                        <p className="text-sm text-slate-500 font-medium">Son 6 ayın istatistiği</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="h-48 w-full mt-4 relative z-10">
                                    {stats?.monthlyShootsChart?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={stats.monthlyShootsChart} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.6} />
                                                        <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                                />
                                                <RechartsTooltip
                                                    cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                                                    contentStyle={{
                                                        borderRadius: '14px',
                                                        border: '1px solid #e2e8f0',
                                                        boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                                                        fontWeight: '500',
                                                        fontSize: '13px',
                                                        padding: '10px 14px'
                                                    }}
                                                    itemStyle={{ color: '#4f46e5', fontWeight: '600' }}
                                                    labelStyle={{ color: '#1e293b', marginBottom: '4px', fontWeight: '700' }}
                                                    formatter={(value) => [`${value} Çekim`, 'Aylık Toplam']}
                                                />
                                                <Area
                                                    tooltipType="none"
                                                    type="monotone"
                                                    dataKey="value"
                                                    fill="url(#colorArea)"
                                                    stroke="none"
                                                    animationDuration={2000}
                                                />
                                                <Bar
                                                    tooltipType="none"
                                                    dataKey="value"
                                                    barSize={24}
                                                    fill="url(#colorBar)"
                                                    radius={[4, 4, 4, 4]}
                                                    animationDuration={2000}
                                                >
                                                    {stats.monthlyShootsChart.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={index === stats.monthlyShootsChart.length - 1 ? '#6366f1' : 'url(#colorBar)'} />
                                                    ))}
                                                </Bar>
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#6366f1"
                                                    strokeWidth={2.5}
                                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5', stroke: '#fff' }}
                                                    animationDuration={2000}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">Henüz yeterli veri bulunmuyor.</div>
                                    )}
                                </div>
                            </div>

                            <MetricCard
                                icon={Calendar}
                                iconBg="bg-gradient-to-br from-emerald-400 to-teal-500"
                                iconColor="text-white"
                                title="Planlanan Çekim İşleri"
                                value={stats.counts.activeShootsMonth}
                                subtext={`Yalnızca bu aya ait programlanmış çekim sayısıdır. (${stats.todaySchedule?.length || 0} tanesi bugün)`}
                            />
                            <MetricCard
                                icon={DollarSign}
                                iconBg="bg-gradient-to-br from-amber-400 to-orange-500"
                                iconColor="text-white"
                                title="Toplam Elde Edilen Gelir"
                                value={`₺${stats.counts.totalRevenue.toLocaleString('tr-TR')}`}
                                subtext="Sisteme işlenen kayıtlı müşteri sözleşmelerinden elde edilmiş tüm zamanların brüt geliridir."
                            />
                            <MetricCard
                                icon={ImageIcon}
                                iconBg="bg-gradient-to-br from-purple-500 to-fuchsia-500"
                                iconColor="text-white"
                                title="Müşteri Albüm Onayı Bekleyenler"
                                value={stats.counts.pendingSelection || 0}
                                subtext="Fotoğraflar yüklenip, randevu durumu 'Albüm Bekleniyor' olan sipariş sayısı."
                            />
                            <MetricCard
                                icon={UploadCloud}
                                iconBg="bg-gradient-to-br from-blue-400 to-indigo-500"
                                iconColor="text-white"
                                title="Fotoğraf Yüklenmesi Beklenenler"
                                value={stats.counts.pendingUploads || 0}
                                subtext="Çekimi tamamlanan fakat sisteme henüz fotoğraf yüklemesi yapılmayan müşteriler."
                            />
                        </div>
                    </div>

                    {/* Right Column - Calendar (1 column, full height) */}
                    <div className="lg:col-span-1">
                        <SchedulePanel
                            calendar={stats.calendar || { currentMonth: 'Aralık 2025', daysWithEvents: [] }}
                            schedule={stats.todaySchedule || []}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            viewDate={viewDate}
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
