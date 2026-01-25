'use client';

import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data type - will replace with real data type later
interface ShootPreview {
    id: string;
    coupleName: string;
    type: string;
    time: string;
    location: string;
}

export default function TodaysShoots() {
    // This will fetch from API later
    const shoots: ShootPreview[] = [
        // Empty state for now or sample data
        { id: '1', coupleName: 'Ahmet & Ayşe', type: 'Düğün Çekimi', time: '14:00', location: 'Fenerbahçe Parkı' },
        { id: '2', coupleName: 'Mehmet & Elif', type: 'Dış Çekim', time: '16:30', location: 'Atatürk Arboretumu' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Bugünün Çekimleri
                </h3>
                <Link href="/admin/calendar" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Tümünü Gör
                </Link>
            </div>
            <div className="divide-y divide-gray-50">
                {shoots.length > 0 ? (
                    shoots.map((shoot) => (
                        <div key={shoot.id} className="px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-1 bg-purple-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 mb-0.5">{shoot.type}</p>
                                        <h4 className="text-base font-bold text-gray-900">{shoot.coupleName}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
                                        <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {shoot.time}
                                    </div>
                                    <div className="flex items-center justify-end text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {shoot.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-10 text-center text-gray-500">
                        Bugün için planlanmış çekim bulunmuyor.
                    </div>
                )}
            </div>
            <div className="bg-gray-50 px-6 py-3">
                <Link href="/admin/shoots/new" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center justify-center">
                    Yeni Çekim Ekle <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
