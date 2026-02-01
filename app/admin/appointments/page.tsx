'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    MapPin,
    Phone,
    User,
    FileText,
    Camera,
    Package as PackageIcon,
    DollarSign
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
    const { data: session } = useSession(); // Access session for preferences
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'calendar' | 'today' | 'tomorrow' | 'week'>('calendar');

    // Effect: Set initial view mode from session settings
    useEffect(() => {
        if (session?.user?.panelSettings?.defaultView) {
            const setting = session.user.panelSettings.defaultView;
            // Map settings ('month', 'week', 'day') to viewMode ('calendar', 'week', 'today')
            if (setting === 'month') setViewMode('calendar');
            else if (setting === 'week') setViewMode('week');
            else if (setting === 'day') setViewMode('today');
        }
    }, [session]);

    // Fetch Appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
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

    // Calendar logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const getAppointmentsForDate = (date: Date) => {
        return appointments.filter(appt => {
            const apptDate = appt.date ? parseISO(appt.date) : new Date();
            return isSameDay(apptDate, date);
        });
    };

    const getFilteredAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);

        switch (viewMode) {
            case 'today': return getAppointmentsForDate(today);
            case 'tomorrow': return appointments.filter(appt => isSameDay(parseISO(appt.date), tomorrow));
            case 'week': return appointments.filter(appt => { const d = parseISO(appt.date); return d >= today && d <= weekFromNow; });
            default: return appointments;
        }
    };

    const filteredAppointments = getFilteredAppointments();
    const selectedDayAppointments = selectedDay ? getAppointmentsForDate(selectedDay) : [];

    const previousMonth = () => { setCurrentDate(subMonths(currentDate, 1)); setSelectedDay(null); };
    const nextMonth = () => { setCurrentDate(addMonths(currentDate, 1)); setSelectedDay(null); };

    const calendarDays = useMemo(() => {
        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
        return days;
    }, [year, month, daysInMonth, startingDayOfWeek]);

    const monthName = format(currentDate, 'MMMM', { locale: tr });
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    const getCustomerName = (appt: Appointment) => {
        const bride = appt.customer?.brideName?.trim();
        const groom = appt.customer?.groomName?.trim();
        if (bride && groom) return `${bride} & ${groom}`;
        return bride || groom || 'İsimsiz Müşteri';
    };

    const getSafeDateString = (date: Date) => {
        const d = new Date(date);
        d.setHours(12);
        return format(d, 'yyyy-MM-dd');
    };

    return (
        <div className="flex flex-col h-full max-w-[1920px] mx-auto">
            {/* Clean Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Randevular</h2>
                    <p className="text-sm text-gray-500 font-medium">Çekim takvimi ve planlamalar</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                        {['calendar', 'today', 'week'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === mode ? 'bg-[#ff4081] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {mode === 'calendar' ? 'Takvim' : mode === 'today' ? 'Bugün' : 'Bu Hafta'}
                            </button>
                        ))}
                    </div>
                    <Link href="/admin/appointments/new" className="btn-primary px-4 py-2 text-sm font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Randevu Ekle
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {viewMode === 'calendar' ? (
                    <div className="clean-card bg-white flex flex-col flex-1 overflow-hidden h-full">
                        {/* Calendar Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100/50">
                            <div className="flex items-center gap-4">
                                <button onClick={previousMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-bold text-gray-800 min-w-[150px] text-center capitalize">
                                    {monthName} {year}
                                </h3>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {appointments.length} Kayıt
                            </div>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-gray-100/50">
                            {dayNames.map(day => (
                                <div key={day} className="py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 flex-1 overflow-auto">
                            {calendarDays.map((date, index) => {
                                if (!date) return <div key={index} className="bg-gray-50/30 border-b border-r border-gray-100/50 min-h-[120px]" />;

                                const dayAppointments = getAppointmentsForDate(date);
                                const isTodayDate = isToday(date);
                                const hasAppointments = dayAppointments.length > 0;

                                return (
                                    <div
                                        key={index}
                                        className={`border-b border-r border-gray-100/50 p-2 min-h-[120px] transition-colors relative group
                                            ${isTodayDate ? 'bg-[#ff4081]/5' : 'bg-white hover:bg-gray-50/50'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-md ${isTodayDate ? 'bg-[#ff4081] text-white' : 'text-gray-700'}`}>
                                                {date.getDate()}
                                            </span>
                                            <Link href={`/admin/appointments/new?date=${getSafeDateString(date)}`} className="opacity-0 group-hover:opacity-100 text-[#ff4081]">
                                                <Plus className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        <div className="space-y-1">
                                            {dayAppointments.slice(0, 3).map(appt => (
                                                <div
                                                    key={appt._id}
                                                    onClick={() => setSelectedAppointment(appt)}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold text-white cursor-pointer hover:brightness-110 truncate shadow-sm ${SHOOT_TYPE_COLORS[appt.type] || 'bg-gray-400'}`}
                                                >
                                                    {format(parseISO(appt.date), 'HH:mm')} {getCustomerName(appt)}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 3 && (
                                                <button onClick={() => setSelectedDay(date)} className="w-full text-[9px] font-bold text-[#ff4081] text-left px-1 mt-1">
                                                    +{dayAppointments.length - 3} daha...
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Simple List View
                    <div className="clean-card bg-white p-6 h-full overflow-auto">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg border-b border-gray-100 pb-2">
                            {viewMode === 'today' ? 'Bugünün Çekimleri' : 'Bu Haftanın Çekimleri'}
                        </h3>
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">Kayıtlı randevu bulunmuyor</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredAppointments.map(appt => (
                                    <div key={appt._id} onClick={() => setSelectedAppointment(appt)} className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-[#ff4081]/30 hover:shadow-md transition-all cursor-pointer bg-white group">
                                        <div className={`w-12 h-12 rounded-full ${SHOOT_TYPE_COLORS[appt.type]} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                                            {format(parseISO(appt.date), 'HH:mm')}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h4 className="font-bold text-gray-800 group-hover:text-[#ff4081] transition-colors">{getCustomerName(appt)}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="font-medium text-[#ff4081]">{SHOOT_TYPE_LABELS[appt.type]}</span>
                                                {appt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {appt.location}</span>}
                                            </div>
                                        </div>
                                        <div className="text-gray-300 group-hover:text-[#ff4081]">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals remain mostly same but slightly cleaner */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-2 ${SHOOT_TYPE_COLORS[selectedAppointment.type]}`}>
                                        {SHOOT_TYPE_LABELS[selectedAppointment.type]}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{getCustomerName(selectedAppointment)}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {format(parseISO(selectedAppointment.date), 'dd MMMM, HH:mm', { locale: tr })}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Simple Info Rows */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase">Telefon</label>
                                    <p className="font-medium text-gray-800">{selectedAppointment.customer?.phone || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase">Lokasyon</label>
                                    <p className="font-medium text-gray-800">{selectedAppointment.location || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase">Paket</label>
                                    <p className="font-medium text-gray-800">{selectedAppointment.packageName || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase">Kalan Ödeme</label>
                                    <p className="font-bold text-orange-500">
                                        {((selectedAppointment.agreedPrice || 0) - (selectedAppointment.deposit || 0)).toLocaleString()} ₺
                                    </p>
                                </div>
                            </div>
                            {selectedAppointment.notes && (
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Notlar</label>
                                    <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3">
                            <Link href={`/admin/appointments/${selectedAppointment._id}/edit`} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:border-gray-300 text-sm">
                                Düzenle
                            </Link>
                            <button onClick={() => setSelectedAppointment(null)} className="px-4 py-2 bg-[#1e1e2d] text-white font-medium rounded-xl hover:opacity-90 text-sm">
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
