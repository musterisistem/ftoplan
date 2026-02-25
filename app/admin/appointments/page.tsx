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
        <div className="flex flex-col h-full max-w-[1920px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4 py-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">Randevular</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Stüdyo çekim takvimi ve planlamalar</p>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                    <div className="flex bg-slate-100/80 p-1 rounded-xl w-full sm:w-auto shadow-inner">
                        {['calendar', 'today', 'week'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${viewMode === mode ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                            >
                                {mode === 'calendar' ? 'Takvim' : mode === 'today' ? 'Bugün' : 'Bu Hafta'}
                            </button>
                        ))}
                    </div>
                    <Link href="/admin/appointments/new" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" />
                        Randevu Ekle
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-[500px]">
                {viewMode === 'calendar' ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col flex-1 overflow-hidden h-full">
                        {/* Calendar Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <button onClick={previousMonth} className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-bold text-slate-800 min-w-[150px] text-center capitalize">
                                    {monthName} {year}
                                </h3>
                                <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-200 shadow-sm">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                                {appointments.length} Kayıt
                            </div>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
                            {dayNames.map(day => (
                                <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 flex-1 overflow-auto bg-slate-100/50 gap-px">
                            {calendarDays.map((date, index) => {
                                if (!date) return <div key={index} className="bg-slate-50/50 min-h-[120px]" />;

                                const dayAppointments = getAppointmentsForDate(date);
                                const isTodayDate = isToday(date);

                                return (
                                    <div
                                        key={index}
                                        className={`p-2 min-h-[120px] transition-colors relative group bg-white
                                            ${isTodayDate ? 'ring-2 ring-inset ring-indigo-500 z-10' : 'hover:bg-slate-50/80'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' : 'text-slate-700'}`}>
                                                {date.getDate()}
                                            </span>
                                            <Link href={`/admin/appointments/new?date=${getSafeDateString(date)}`} className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 p-1 bg-indigo-50 rounded-md transition-all">
                                                <Plus className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>

                                        <div className="space-y-1.5 mt-1">
                                            {dayAppointments.slice(0, 3).map(appt => (
                                                <div
                                                    key={appt._id}
                                                    onClick={() => setSelectedAppointment(appt)}
                                                    className={`px-2 py-1.5 rounded-md text-[10px] font-semibold text-white cursor-pointer hover:brightness-110 truncate shadow-sm transition-all ${SHOOT_TYPE_COLORS[appt.type] || 'bg-slate-500'}`}
                                                >
                                                    {format(parseISO(appt.date), 'HH:mm')} {getCustomerName(appt)}
                                                </div>
                                            ))}
                                            {dayAppointments.length > 3 && (
                                                <button onClick={() => setSelectedDay(date)} className="w-full text-xs font-semibold text-indigo-600 text-left px-1 mt-1 hover:text-indigo-700 hover:underline">
                                                    +{dayAppointments.length - 3} kayıt...
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
                    <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-200/60 shadow-sm p-6 md:p-8 h-full overflow-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-200/60 pb-5">
                            <h3 className="font-extrabold text-zinc-900 text-xl tracking-tight">
                                {viewMode === 'today' ? 'Bugünün Çekimleri' : 'Bu Haftanın Çekimleri'}
                            </h3>
                            <span className="px-3.5 py-1.5 bg-white text-zinc-700 rounded-full text-xs font-bold shadow-sm ring-1 ring-zinc-200">
                                {filteredAppointments.length} Randevu
                            </span>
                        </div>

                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-zinc-200 border-dashed">
                                <CalendarIcon className="w-14 h-14 mx-auto mb-4 text-zinc-300" />
                                <p className="font-bold text-zinc-900 mb-1 text-lg">Kayıtlı randevu bulunmuyor</p>
                                <p className="text-sm font-medium text-zinc-500">Seçili dönem için planlanmış bir çekim yok.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAppointments.map(appt => (
                                    <div key={appt._id} onClick={() => setSelectedAppointment(appt)} className="flex items-center p-3 md:p-4 rounded-full border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-300 cursor-pointer group">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${SHOOT_TYPE_COLORS[appt.type]} flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-zinc-50 ml-1`}>
                                            {format(parseISO(appt.date), 'HH:mm')}
                                        </div>
                                        <div className="ml-4 flex-1 min-w-0">
                                            <h4 className="font-bold text-zinc-900 text-base md:text-lg truncate group-hover:text-zinc-950 transition-colors">{getCustomerName(appt)}</h4>
                                            <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1 md:mt-1.5">
                                                <span className="font-bold text-[10px] md:text-xs text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{SHOOT_TYPE_LABELS[appt.type]}</span>
                                                {appt.location && <span className="flex items-center gap-1.5 truncate text-xs font-medium"><MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" /> <span className="truncate">{appt.location}</span></span>}
                                            </div>
                                        </div>
                                        <div className="text-zinc-400 group-hover:text-zinc-700 bg-zinc-50 group-hover:bg-zinc-100 p-2.5 md:p-3 rounded-full transition-colors mr-1 md:mr-2">
                                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold text-white mb-3 shadow-sm ${SHOOT_TYPE_COLORS[selectedAppointment.type]}`}>
                                        {SHOOT_TYPE_LABELS[selectedAppointment.type]}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{getCustomerName(selectedAppointment)}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5 font-medium">
                                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                                        {format(parseISO(selectedAppointment.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedAppointment(null)} className="p-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-sm">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Telefon</label>
                                    <p className="font-medium text-slate-900">{selectedAppointment.customer?.phone || '-'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Lokasyon</label>
                                    <p className="font-medium text-slate-900">{selectedAppointment.location || '-'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Paket</label>
                                    <p className="font-medium text-slate-900">{selectedAppointment.packageName || '-'}</p>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <label className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block mb-1">Kalan Ödeme</label>
                                    <p className="font-bold text-indigo-600 text-lg">
                                        {((selectedAppointment.agreedPrice || 0) - (selectedAppointment.deposit || 0)).toLocaleString()} ₺
                                    </p>
                                </div>
                            </div>
                            {selectedAppointment.notes && (
                                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <label className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-1">Müşteri Notları</label>
                                    <p className="text-sm text-amber-900 leading-relaxed font-medium">{selectedAppointment.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <Link href={`/admin/appointments/${selectedAppointment._id}/edit`} className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all shadow-sm text-sm">
                                Düzenle
                            </Link>
                            <button onClick={() => setSelectedAppointment(null)} className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md text-sm">
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
