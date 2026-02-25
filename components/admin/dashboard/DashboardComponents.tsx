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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative">
            {/* Subtle Accent Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${iconBg} opacity-[0.05] rounded-full pointer-events-none group-hover:opacity-10 transition-opacity`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : isNegative ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <div className="text-gray-500 text-sm font-semibold mb-1 relative z-10">{title}</div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight relative z-10">{value}</div>
            {subtext && <div className="text-xs font-medium text-gray-400 mt-1 relative z-10">{subtext}</div>}
        </div>
    );
}

// --- 2. Monthly Activity Chart ---
interface MonthlyActivityProps {
    data: Array<{ name: string; count: number }>;
}

export function MonthlyActivityChart({ data }: MonthlyActivityProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Aylık Aktivite</h3>
                <select className="text-sm border border-slate-200 rounded-xl px-4 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-slate-700 hover:bg-white text-center">
                    <option>Bu Ay</option>
                    <option>Geçen Ay</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.5)',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            fontWeight: 600
                        }}
                        cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="url(#colorCount)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={48}
                    />
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                        </linearGradient>
                    </defs>
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
    onPrevMonth: () => void;
    onNextMonth: () => void;
    viewDate: Date;
}

export function MiniCalendar({ currentMonth, daysWithEvents, eventDetails = [], onPrevMonth, onNextMonth, viewDate }: CalendarProps) {
    const [hoveredDay, setHoveredDay] = React.useState<number | null>(null);
    const [popupPos, setPopupPos] = React.useState({ x: 0, y: 0 });

    const getDaysInMonth = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
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
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear();
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
                    <button onClick={onPrevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Önceki Ay">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={onNextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Sonraki Ay">
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
                                aspect-square flex items-center justify-center rounded-xl text-sm transition-all duration-300
                                ${!day ? 'invisible' : ''}
                                ${isToday(day) ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/30 z-10 transform scale-105' : 'text-slate-700 font-medium'}
                                ${hasEvent(day) && !isToday(day) ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50' : ''}
                                ${day && !isToday(day) ? 'hover:bg-slate-100 cursor-pointer' : ''}
                                relative
                            `}
                        >
                            {day}
                            {hasEvent(day) && !isToday(day) && (
                                <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-sm"></span>
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
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Bugünün Programı</h3>
                {schedule.length > 0 && (
                    <span className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full font-bold shadow-sm ring-1 ring-indigo-500/10">
                        {schedule.length} Çekim
                    </span>
                )}
            </div>

            {schedule.length === 0 ? (
                <div className="bg-slate-50/50 rounded-2xl py-10 flex flex-col items-center justify-center text-center px-4 border border-dashed border-slate-200">
                    <CalendarIcon className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm font-semibold text-slate-400">Bugün randevunuz bulunmamaktadır</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {schedule.map((item, index) => (
                        <div key={index} className="p-4 bg-slate-50/80 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                                        <Clock className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="font-extrabold tracking-tight text-slate-900 text-lg">{item.time}</span>
                                </div>
                                <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-100 px-2.5 py-1 rounded-lg shadow-sm">
                                    {item.type}
                                </span>
                            </div>
                            <div className="text-sm text-slate-700 mb-2 font-bold ml-12">
                                {item.customerName}
                            </div>
                            {item.location && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-12">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
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
    onPrevMonth: () => void;
    onNextMonth: () => void;
    viewDate: Date;
}

export function SchedulePanel({ calendar, schedule, onPrevMonth, onNextMonth, viewDate }: SchedulePanelProps) {
    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 h-full shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    <CalendarIcon className="w-6 h-6 text-gray-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Takvim</h2>
            </div>
            <MiniCalendar
                currentMonth={calendar.currentMonth}
                daysWithEvents={calendar.daysWithEvents}
                eventDetails={calendar.eventDetails}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                viewDate={viewDate}
            />
            <div className="h-px bg-gray-100 my-8"></div>
            <TodaySchedule schedule={schedule} />
        </div>
    );
}
