'use client';

import { Calendar as CalendarIcon, MapPin, Clock, Camera } from 'lucide-react';

const schedule = [
    {
        id: 1,
        title: 'Düğün Çekimi',
        date: '2026-06-15',
        time: '14:00',
        location: 'Fenerbahçe Parkı',
        description: 'Dış mekan gelin-damat çekimi. Ortalama 2-3 saat sürecektir.',
        status: 'upcoming'
    },
    {
        id: 2,
        title: 'Nişan Çekimi',
        date: '2026-03-20',
        time: '15:30',
        location: 'Atatürk Arboretumu',
        description: 'Tamamlandı.',
        status: 'completed'
    }
];

export default function ClientSchedulePage() {
    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Çekim Takvimim</h1>
                <p className="mt-1 text-sm text-gray-500">Planlanmış çekimlerinizin detayları.</p>
            </div>

            <div className="relative border-l-2 border-purple-200 ml-4 space-y-12">
                {schedule.map((item) => (
                    <div key={item.id} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${item.status === 'completed' ? 'bg-gray-300 border-gray-300' : 'bg-purple-600 border-white shadow-md'
                            }`}></div>

                        <div className={`bg-white rounded-2xl p-6 border ${item.status === 'upcoming'
                                ? 'border-purple-200 shadow-md ring-1 ring-purple-100'
                                : 'border-gray-100 opacity-75'
                            }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Camera className={`w-5 h-5 ${item.status === 'upcoming' ? 'text-purple-600' : 'text-gray-400'}`} />
                                    {item.title}
                                </h3>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'upcoming'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                    {item.status === 'upcoming' ? 'Planlandı' : 'Tamamlandı'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <CalendarIcon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{item.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 col-span-1 sm:col-span-2">
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">{item.location}</span>
                                </div>
                            </div>

                            {item.description && (
                                <p className="text-sm text-gray-500 border-t border-gray-100 pt-4 mt-2">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
