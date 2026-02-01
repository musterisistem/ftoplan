'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface Shoot {
    id: string;
    brideName: string;
    groomName: string;
    date: Date;
    time: string;
    location: string;
    type: string;
}

interface UpcomingShootsWidgetProps {
    shoots: Shoot[];
}

export function UpcomingShootsWidget({ shoots }: UpcomingShootsWidgetProps) {
    if (!shoots || shoots.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Yaklaşan Çekimler</h3>
                <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Yaklaşan çekim yok</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Yaklaşan Çekimler</h3>
                <span className="text-xs text-gray-400">{shoots.length} randevu</span>
            </div>

            <div className="space-y-1 max-h-[320px] overflow-y-auto">
                {shoots.slice(0, 5).map((shoot) => {
                    const shootDate = new Date(shoot.date);
                    const isToday = shootDate.toDateString() === new Date().toDateString();

                    return (
                        <Link
                            key={shoot.id}
                            href={`/admin/appointments`}
                            className="block group"
                        >
                            <div className="py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-4">
                                    {/* Date */}
                                    <div className="text-xs text-gray-500 whitespace-nowrap min-w-[65px]">
                                        {shootDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                                    </div>

                                    {/* Time */}
                                    <div className="text-sm font-semibold text-blue-600 whitespace-nowrap min-w-[50px]">
                                        {shoot.time || '--:--'}
                                    </div>

                                    {isToday && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                            Bugün
                                        </span>
                                    )}

                                    {/* Names */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {shoot.brideName} & {shoot.groomName}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="text-xs text-gray-500 truncate max-w-[140px] text-right">
                                        {shoot.location}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}
