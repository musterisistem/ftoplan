'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Heart, CheckCircle } from 'lucide-react';

interface Appointment {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    notes: string;
    status: string;
}

export default function StudioSchedulePage() {
    const { data: session } = useSession();
    const params = useParams();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.customerId) {
            fetchAppointments();
        }
    }, [session]);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}/appointments`);
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Randevularınız</h1>
                <p className="text-sm text-gray-500">Çekim takviminiz</p>
            </div>

            {appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment._id}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                                    <span className="text-lg font-bold">
                                        {new Date(appointment.date).getDate()}
                                    </span>
                                    <span className="text-xs">
                                        {new Date(appointment.date).toLocaleDateString('tr-TR', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {appointment.title || appointment.type}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formatDate(appointment.date)}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                                        {appointment.time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {appointment.time}
                                            </span>
                                        )}
                                        {appointment.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {appointment.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {appointment.status === 'completed' && (
                                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Henüz Randevu Yok</h3>
                    <p className="text-gray-500 text-sm">Çekim randevularınız burada görünecektir.</p>
                </div>
            )}
        </div>
    );
}
