'use client';

import React from 'react';
import {
    Camera,
    Users,
    Calendar as CalendarIcon,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- 1. Metric Cards ---
interface MetricCardProps {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    value: string | number;
    change?: number;
    subtext?: string;
}

export function MetricCard({ icon: Icon, iconBg, iconColor, title, value, change, subtext }: MetricCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div className="text-gray-500 text-sm mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
        </div>
    );
}

// --- 2. Monthly Activity Chart ---
interface MonthlyActivityProps {
    data: Array<{ name: string; count: number }>;
}

export function MonthlyActivityChart({ data }: MonthlyActivityProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Aylık Aktivite</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                    <option>Bu Ay</option>
                    <option>Geçen Ay</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px'
                        }}
                        cursor={{ fill: '#F9FAFB' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- 3. Mini Calendar ---
interface CalendarProps {
    currentMonth: string;
    daysWithEvents: number[];
}

export function MiniCalendar({ currentMonth, daysWithEvents }: CalendarProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const hasEvent = (day: number | null) => {
        if (!day) return false;
        return daysWithEvents.includes(day);
    };

    const days = getDaysInMonth();
    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{currentMonth}</h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 pb-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm
                            ${!day ? 'invisible' : ''}
                            ${isToday(day) ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'}
                            ${hasEvent(day) && !isToday(day) ? 'bg-blue-50 font-medium' : ''}
                            ${day && !isToday(day) ? 'hover:bg-gray-50 cursor-pointer' : ''}
                            relative
                        `}
                    >
                        {day}
                        {hasEvent(day) && !isToday(day) && (
                            <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 4. Today's Schedule ---
interface ScheduleItem {
    time: string;
    customerName: string;
    type: string;
    location?: string;
}

interface TodayScheduleProps {
    schedule: ScheduleItem[];
}

export function TodaySchedule({ schedule }: TodayScheduleProps) {
    return (
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Bugünün Programı</h3>
                {schedule.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                        {schedule.length} Çekim
                    </span>
                )}
            </div>

            {schedule.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                    Bugün randevunuz bulunmamaktadır
                </div>
            ) : (
                <div className="space-y-3">
                    {schedule.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{item.time}</span>
                                </div>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    {item.type}
                                </span>
                            </div>
                            <div className="text-sm text-gray-700 mb-1 font-medium">
                                {item.customerName}
                            </div>
                            {item.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- 5. Schedule Panel (Calendar + Today's Schedule) ---
interface SchedulePanelProps {
    calendar: {
        currentMonth: string;
        daysWithEvents: number[];
    };
    schedule: ScheduleItem[];
}

export function SchedulePanel({ calendar, schedule }: SchedulePanelProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 h-full shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Takvim</h2>
            <MiniCalendar
                currentMonth={calendar.currentMonth}
                daysWithEvents={calendar.daysWithEvents}
            />
            <TodaySchedule schedule={schedule} />
        </div>
    );
}
