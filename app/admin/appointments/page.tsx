'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    MapPin,
    Clock,
    DollarSign,
    Package as PackageIcon,
    Phone,
    ArrowRight,
    Camera,
    User,
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { format, isSameDay, isToday, parseISO, addMonths, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Appointment {
    _id: string;
    customer: {
        brideName?: string;
        groomName?: string;
        phone?: string;
    };
    type: 'wedding' | 'engagement' | 'saveTheDate' | 'personal';
    date: string; // ISO string
    location?: string;
    city?: string;
    agreedPrice?: number;
    deposit?: number;
    notes?: string;
    packageName?: string;
    contractId?: string;
}

const SHOOT_TYPE_COLORS: Record<string, string> = {
    wedding: 'bg-pink-500',
    engagement: 'bg-purple-500',
    saveTheDate: 'bg-blue-500',
    personal: 'bg-green-500'
};

const SHOOT_TYPE_LABELS: Record<string, string> = {
    wedding: 'Düğün',
    engagement: 'Nişan',
    saveTheDate: 'Save The Date',
    personal: 'Kişisel/Model'
};

export default function AppointmentsCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'calendar' | 'today' | 'tomorrow' | 'week'>('calendar');

    // Fetch Appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // cache: 'no-store' for instant updates
                const res = await fetch('/api/shoots', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // Calendar calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday(0) to Monday(0) start? 
    // Standard JS: Sunday is 0. 
    // If we want Monday start:
    // 0(Sun) -> 6, 1(Mon) -> 0.
    // Formula: (day + 6) % 7

    // Get appointments for a specific date
    const getAppointmentsForDate = (date: Date) => {
        return appointments.filter(appt => {
            const apptDate = appt.date ? parseISO(appt.date) : new Date();
            return isSameDay(apptDate, date);
        });
    };

    // Filter appointments based on view mode
    const getFilteredAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        switch (viewMode) {
            case 'today':
                return getAppointmentsForDate(today);
            case 'tomorrow':
                return appointments.filter(appt => {
                    const d = parseISO(appt.date);
                    return isSameDay(d, tomorrow);
                });
            case 'week':
                return appointments.filter(appt => {
                    const d = parseISO(appt.date);
                    return d >= today && d <= weekFromNow;
                });
            default:
                return appointments;
        }
    };

    const filteredAppointments = getFilteredAppointments();
    const selectedDayAppointments = selectedDay ? getAppointmentsForDate(selectedDay) : [];

    // Navigate months
    const previousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
        setSelectedDay(null);
    };

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const days: (Date | null)[] = [];
        // Add empty cells
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        // Add days
        for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
        return days;
    }, [year, month, daysInMonth, startingDayOfWeek]);

    const monthName = format(currentDate, 'MMMM', { locale: tr });
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']; // Monday Start

    // Helpers
    const getCustomerName = (appt: Appointment) => {
        const bride = appt.customer?.brideName?.trim();
        const groom = appt.customer?.groomName?.trim();
        if (bride && groom) return `${bride} & ${groom}`;
        return bride || groom || 'İsimsiz Müşteri';
    };

    // Safe date for URL (noon to avoid timezone issues)
    const getSafeDateString = (date: Date) => {
        const d = new Date(date);
        d.setHours(12);
        return format(d, 'yyyy-MM-dd');
    };

    return (
        <div className="p-4 lg:p-6 max-w-[1920px] mx-auto h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Randevular</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Çekim takviminizi yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['calendar', 'today', 'week'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === mode ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {mode === 'calendar' ? 'Takvim' : mode === 'today' ? 'Bugün' : 'Bu Hafta'}
                            </button>
                        ))}
                    </div>
                    <Link
                        href="/admin/appointments/new"
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Randevu Ekle
                    </Link>
                </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-indigo-50 rounded-xl text-gray-600 hover:text-indigo-600 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-lg font-bold text-gray-900 capitalize min-w-[160px] text-center">
                                {monthName} {year}
                            </h3>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-indigo-50 rounded-xl text-gray-600 hover:text-indigo-600 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="font-bold text-gray-900">{appointments.length}</span> randevu
                            </div>
                            <Link
                                href="/admin/appointments/new"
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Yeni Randevu
                            </Link>
                        </div>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                        {dayNames.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-0 flex-1 overflow-auto bg-gray-50">
                        {calendarDays.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="bg-white/50 border-r border-b border-gray-200" />;
                            }

                            const dayAppointments = getAppointmentsForDate(date);
                            const hasAppointments = dayAppointments.length > 0;
                            const isTodayDate = isToday(date);

                            return (
                                <div
                                    key={index}
                                    className={`border-r border-b border-gray-200 p-2 relative group flex flex-col min-h-[110px] transition-all ${isTodayDate
                                        ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50/40'
                                        : hasAppointments
                                            ? 'bg-gray-50 hover:bg-gray-100'
                                            : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Day Number */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isTodayDate ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
                                            {date.getDate()}
                                        </span>
                                        <Link
                                            href={`/admin/appointments/new?date=${getSafeDateString(date)}`}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-all"
                                            title="Randevu Ekle"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Appointments - Mini Cards */}
                                    <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
                                        {dayAppointments.slice(0, 3).map((appt) => (
                                            <div
                                                key={appt._id}
                                                onClick={() => setSelectedAppointment(appt)}
                                                className={`text-[10px] px-2 py-1.5 rounded-lg cursor-pointer text-white shadow-sm transition-all hover:shadow-md hover:opacity-90 ${SHOOT_TYPE_COLORS[appt.type] || 'bg-gray-500'}`}
                                                title={`${format(parseISO(appt.date), 'HH:mm')} - ${getCustomerName(appt)}`}
                                            >
                                                <div className="font-bold text-white/90 mb-0.5">{format(parseISO(appt.date), 'HH:mm')}</div>
                                                <div className="font-medium truncate leading-tight">{getCustomerName(appt)}</div>
                                            </div>
                                        ))}
                                        {dayAppointments.length > 3 && (
                                            <button
                                                className="w-full text-[10px] text-indigo-600 font-semibold text-center bg-indigo-50 rounded-lg py-1 hover:bg-indigo-100 transition"
                                                onClick={() => setSelectedDay(date)}
                                            >
                                                +{dayAppointments.length - 3} daha
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                // Compact Calendar View for Today/Week
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
                    {/* Compact Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {viewMode === 'today' ? format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr }) : 'Bu Hafta'}
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="font-bold text-gray-900">{filteredAppointments.length}</span> randevu
                                </div>
                                <Link
                                    href="/admin/appointments/new"
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Yeni Randevu
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Compact Grid */}
                    <div className={`grid ${viewMode === 'today' ? 'grid-cols-1' : 'grid-cols-7'} gap-4 p-6 flex-1 overflow-auto`}>
                        {(() => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            let daysToShow: Date[] = [];

                            if (viewMode === 'today') {
                                daysToShow = [today];
                            } else if (viewMode === 'week') {
                                for (let i = 0; i < 7; i++) {
                                    const day = new Date(today);
                                    day.setDate(today.getDate() + i);
                                    daysToShow.push(day);
                                }
                            }

                            return daysToShow.map((date, idx) => {
                                const dayAppointments = getAppointmentsForDate(date);
                                const isTodayDate = isToday(date);

                                return (
                                    <div
                                        key={idx}
                                        className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${viewMode === 'today' ? 'max-w-3xl mx-auto w-full' : ''} ${isTodayDate ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                                    >
                                        {/* Day Header */}
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                            <div>
                                                <div className={`text-2xl font-bold ${isTodayDate ? 'text-indigo-600' : 'text-gray-900'}`}>
                                                    {format(date, 'd')}
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium uppercase">
                                                    {format(date, 'EEEE', { locale: tr })}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/appointments/new?date=${getSafeDateString(date)}`}
                                                className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-600 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </Link>
                                        </div>

                                        {/* Appointments */}
                                        {dayAppointments.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">Randevu yok</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {dayAppointments.map((appt) => (
                                                    <div
                                                        key={appt._id}
                                                        onClick={() => setSelectedAppointment(appt)}
                                                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-indigo-300"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-1 h-full ${SHOOT_TYPE_COLORS[appt.type]} rounded-full self-stretch`} />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                                                        {format(parseISO(appt.date), 'HH:mm')}
                                                                    </span>
                                                                    <span className={`text-xs font-bold text-white ${SHOOT_TYPE_COLORS[appt.type]} px-2 py-1 rounded-lg`}>
                                                                        {SHOOT_TYPE_LABELS[appt.type]}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-sm font-bold text-gray-900 mb-2">{getCustomerName(appt)}</h4>
                                                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone className="w-3.5 h-3.5" />
                                                                        {appt.customer?.phone || '-'}
                                                                    </div>
                                                                    {appt.location && (
                                                                        <div className="flex items-center gap-1">
                                                                            <MapPin className="w-3.5 h-3.5" />
                                                                            {appt.location}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}

            {/* Day List Modal */}
            {selectedDay && selectedDayAppointments.length > 0 && !selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {format(selectedDay, 'd MMMM yyyy', { locale: tr })}
                                </h3>
                                <p className="text-xs text-gray-500">{selectedDayAppointments.length} randevu</p>
                            </div>
                            <button onClick={() => setSelectedDay(null)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto">
                            {selectedDayAppointments.map((appt) => (
                                <div
                                    key={appt._id}
                                    onClick={() => setSelectedAppointment(appt)}
                                    className="bg-white rounded-lg border border-gray-200 p-3 hover:border-indigo-300 transition shadow-sm cursor-pointer hover:shadow-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{getCustomerName(appt)}</h4>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${SHOOT_TYPE_COLORS[appt.type]}`} />
                                                <span className="text-[10px] text-gray-500 uppercase font-semibold">{SHOOT_TYPE_LABELS[appt.type]}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                            {format(parseISO(appt.date), 'HH:mm')}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {appt.customer?.phone || '-'}</div>
                                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {appt.location || '-'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <Link
                                href={`/admin/appointments/new?date=${getSafeDateString(selectedDay)}`}
                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Yeni Ekle
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {getCustomerName(selectedAppointment)}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${SHOOT_TYPE_COLORS[selectedAppointment.type]}`}>
                                            {SHOOT_TYPE_LABELS[selectedAppointment.type]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        {format(parseISO(selectedAppointment.date), 'dd MMMM yyyy, EEEE', { locale: tr })}
                                        <span className="font-bold text-indigo-600">• {format(parseISO(selectedAppointment.date), 'HH:mm')}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setSelectedAppointment(null); setSelectedDay(null); }}
                                    className="p-1.5 hover:bg-white rounded-lg text-gray-500 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Müşteri Bilgileri */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Müşteri Bilgileri
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Gelin Adı</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedAppointment.customer?.brideName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Damat Adı</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedAppointment.customer?.groomName || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">İletişim</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Phone className="w-3.5 h-3.5 text-indigo-500" />
                                            <span className="font-medium">{selectedAppointment.customer?.phone || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Çekim Detayları */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    Çekim Detayları
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-500 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Lokasyon</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedAppointment.location || 'Belirtilmemiş'}</p>
                                            {selectedAppointment.city && (
                                                <p className="text-xs text-gray-600 mt-0.5">{selectedAppointment.city}</p>
                                            )}
                                        </div>
                                    </div>
                                    {selectedAppointment.packageName && (
                                        <div className="flex items-start gap-2">
                                            <PackageIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Paket</p>
                                                <p className="text-sm font-semibold text-gray-900">{selectedAppointment.packageName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Ödeme Bilgileri */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Ödeme Bilgileri
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-600">Anlaşma Ücreti</p>
                                        <p className="text-base font-bold text-gray-900">{(selectedAppointment.agreedPrice || 0).toLocaleString()} ₺</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Kapora</p>
                                        <p className="text-base font-bold text-green-700">{(selectedAppointment.deposit || 0).toLocaleString()} ₺</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Kalan</p>
                                        <p className="text-base font-bold text-orange-600">{((selectedAppointment.agreedPrice || 0) - (selectedAppointment.deposit || 0)).toLocaleString()} ₺</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sözleşme Bilgisi */}
                            {selectedAppointment.contractId && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Sözleşme
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        {(() => {
                                            const CONTRACTS = [
                                                { id: '1', name: 'Dış Çekim Sözleşmesi (Standart)' },
                                                { id: '2', name: 'Video Çekim Sözleşmesi v2' },
                                                { id: '3', name: 'Düğün Hikayesi Sözleşmesi' },
                                            ];
                                            const contract = CONTRACTS.find(c => c.id === selectedAppointment.contractId);
                                            return contract?.name || `Sözleşme ID: ${selectedAppointment.contractId}`;
                                        })()}
                                    </p>
                                </div>
                            )}

                            {/* Notlar */}
                            {selectedAppointment.notes && (
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Notlar
                                    </h4>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedAppointment.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                            >
                                Kapat
                            </button>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/appointments/${selectedAppointment._id}/edit`}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                                >
                                    Düzenle
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
