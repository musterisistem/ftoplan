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
interface CalendarEvent {
    day: number;
    time: string;
    customerName: string;
    type: string;
    location: string;
}

interface CalendarProps {
    currentMonth: string;
    daysWithEvents: number[];
    eventDetails?: CalendarEvent[];
}

export function MiniCalendar({ currentMonth, daysWithEvents, eventDetails = [] }: CalendarProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [hoveredDay, setHoveredDay] = React.useState<number | null>(null);
    const [popupPos, setPopupPos] = React.useState({ x: 0, y: 0 });

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        // Adjust for Monday start (0 is Sunday, so we need to map to 1-7)
        let adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
        for (let i = 0; i < adjustedStart; i++) {
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

    const getDayEvents = (day: number) => {
        return eventDetails.filter(event => event.day === day);
    };

    const days = getDaysInMonth();
    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    return (
        <div className="relative">
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

            <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pb-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const dayEvents = day ? getDayEvents(day) : [];
                    return (
                        <div
                            key={index}
                            onMouseEnter={(e) => {
                                if (day && dayEvents.length > 0) {
                                    setHoveredDay(day);
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPopupPos({
                                        x: rect.left + rect.width / 2,
                                        y: rect.top
                                    });
                                }
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`
                                aspect-square flex items-center justify-center rounded-lg text-sm
                                ${!day ? 'invisible' : ''}
                                ${isToday(day) ? 'bg-blue-600 text-white font-semibold shadow-md z-10' : 'text-gray-700'}
                                ${hasEvent(day) && !isToday(day) ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' : ''}
                                ${day && !isToday(day) ? 'hover:bg-gray-100 cursor-pointer transition-colors' : ''}
                                relative
                            `}
                        >
                            {day}
                            {hasEvent(day) && !isToday(day) && (
                                <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Hover Popup */}
            {hoveredDay !== null && getDayEvents(hoveredDay).length > 0 && (
                <div
                    className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 transform -translate-x-1/2 -translate-y-[calc(100%+15px)] pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95"
                    style={{ left: popupPos.x, top: popupPos.y }}
                >
                    {/* Header: Date */}
                    <div className="bg-blue-600 rounded-t-2xl p-4 text-white">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Tarih</span>
                                <span className="text-sm font-bold">
                                    {hoveredDay} {currentMonth}
                                </span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold">
                                {getDayEvents(hoveredDay).length} Çekim
                            </div>
                        </div>
                    </div>

                    {/* Content: Events */}
                    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                        {getDayEvents(hoveredDay).map((event, i) => (
                            <div key={i} className="relative pl-4 border-l-2 border-blue-500 py-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 text-blue-600">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold">{event.time}</span>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-900 mb-1">
                                    {event.customerName}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Tip */}
                    <div className="px-4 py-2 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                        <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-wider">Weey.NET • Randevu Detayları</p>
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-50 border-r border-b border-gray-100 rotate-45"></div>
                </div>
            )}
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
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">
                        {schedule.length} Çekim
                    </span>
                )}
            </div>

            {schedule.length === 0 ? (
                <div className="bg-gray-50 rounded-xl py-8 flex flex-col items-center justify-center text-center px-4 border border-dashed border-gray-200">
                    <CalendarIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-400">Bugün randevunuz bulunmamaktadır</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedule.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 border border-transparent transition-all group">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-gray-900">{item.time}</span>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 bg-white border border-blue-100 px-2 py-1 rounded-lg shadow-sm">
                                    {item.type}
                                </span>
                            </div>
                            <div className="text-sm text-gray-800 mb-2 font-bold ml-10">
                                {item.customerName}
                            </div>
                            {item.location && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 ml-10">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
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
        eventDetails?: CalendarEvent[];
    };
    schedule: ScheduleItem[];
}

export function SchedulePanel({ calendar, schedule }: SchedulePanelProps) {
    return (
        <div className="bg-white rounded-2xl p-7 border border-gray-100 h-full shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Takvim</h2>
            </div>
            <MiniCalendar
                currentMonth={calendar.currentMonth}
                daysWithEvents={calendar.daysWithEvents}
                eventDetails={calendar.eventDetails}
            />
            <div className="h-px bg-gray-100 my-8"></div>
            <TodaySchedule schedule={schedule} />
        </div>
    );
}
