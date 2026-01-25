'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [shoots, setShoots] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    useEffect(() => {
        const fetchShoots = async () => {
            try {
                // cache: 'no-store' ensures we get fresh data every time
                const response = await fetch('/api/shoots', { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setShoots(data);
                }
            } catch (error) {
                console.error('Failed to fetch shoots:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShoots();
    }, []);

    const getShootColor = (type: string) => {
        switch (type) {
            case 'wedding': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'engagement': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'saveTheDate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'personal': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getShootTitle = (shoot: any) => {
        // Shoot type'ı Türkçeleştir veya müşteri adını göster
        if (shoot.customer) {
            return `${shoot.customer.brideName || ''} & ${shoot.customer.groomName || ''}`;
        }
        return 'İsimsiz Çekim';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-3 flex items-center justify-between border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-gray-900 capitalize flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-purple-600" />
                        {format(currentMonth, 'MMMM yyyy', { locale: tr })}
                    </h2>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button onClick={prevMonth} className="p-0.5 hover:bg-white rounded-md transition-shadow shadow-sm hover:shadow text-gray-600">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={nextMonth} className="p-0.5 hover:bg-white rounded-md transition-shadow shadow-sm hover:shadow text-gray-600">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <button onClick={goToToday} className="text-xs font-medium text-purple-600 hover:text-purple-700">
                        Bugün
                    </button>
                </div>
                <Link href="/admin/appointments/new">
                    <Button size="sm" className="h-8 text-xs px-3">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Yeni
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 shrink-0">
                {weekDays.map((day) => (
                    <div key={day} className="py-1.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px border-b border-gray-100 flex-1 overflow-auto min-h-0">
                {days.map((day, dayIdx) => {
                    const dayShoots = shoots.filter(shoot => {
                        const shootDate = typeof shoot.date === 'string' ? parseISO(shoot.date) : new Date(shoot.date);
                        return isSameDay(shootDate, day);
                    });

                    // Fix: Ensure we are using the local date string correctly.
                    // To safeguard against midnight shifts, we can just format the day directly.
                    // The issue "25 becomes 24" suggests the day object might be slightly behind in UTC if it's 00:00 local GT+3.
                    // Actually, date-fns 'eachDayOfInterval' returns days at 00:00 local system time usually.
                    // If we format it as 'yyyy-MM-dd' it should be correct. 
                    // However, just to be super safe, let's add 12 hours before formatting to be in the middle of the day.
                    const safeDateString = format(new Date(day.setHours(12)), 'yyyy-MM-dd');

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[80px] bg-white p-1.5 relative group transition-colors flex flex-col ${!isSameMonth(day, monthStart) ? 'bg-gray-50/50 text-gray-400' : 'text-gray-900'
                                } ${isToday(day) ? 'bg-purple-50/30' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700'
                                    }`}>
                                    {format(day, dateFormat)}
                                </span>

                                <Link
                                    href={`/admin/appointments/new?date=${safeDateString}`}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-purple-50 rounded-full text-purple-600"
                                    title="Bu tarihe randevu ekle"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-0.5 overflow-y-auto max-h-[100px] scrollbar-hide">
                                {dayShoots.map(shoot => (
                                    <div
                                        key={shoot._id || shoot.id}
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent triggering parent clicks if any
                                            window.location.href = `/admin/appointments/${shoot._id || shoot.id}/edit`;
                                        }}
                                        className={`text-[10px] p-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap ${getShootColor(shoot.type)}`}
                                        title={getShootTitle(shoot)}
                                    >
                                        <span className="font-semibold">{format(new Date(shoot.date), 'HH:mm')}</span> {getShootTitle(shoot)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
