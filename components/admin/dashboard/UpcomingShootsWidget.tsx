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
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight w-full text-left mb-6">Yaklaşan Çekimler</h3>
                <div className="py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40 text-gray-500" />
                    <p className="text-sm font-semibold">Yaklaşan çekim yok</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Yaklaşan Çekimler</h3>
                <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-semibold shadow-sm border border-gray-200">{shoots.length} randevu</span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1 pb-1">
                {shoots.slice(0, 5).map((shoot) => {
                    const shootDate = new Date(shoot.date);
                    const isToday = shootDate.toDateString() === new Date().toDateString();

                    return (
                        <Link
                            key={shoot.id}
                            href={`/admin/appointments`}
                            className="block group"
                        >
                            <div className="py-3 px-4 md:px-5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Date */}
                                    <div className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                                        {shootDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                                    </div>

                                    {/* Time */}
                                    <div className="text-sm font-bold text-gray-800 whitespace-nowrap">
                                        {shoot.time || '--:--'}
                                    </div>

                                    {isToday && (
                                        <span className="text-[10px] bg-[#7A70BA] text-white px-2 py-0.5 rounded-md font-bold shadow-sm hidden sm:inline-block">
                                            Bugün
                                        </span>
                                    )}

                                    {/* Names */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-950 transition-colors">
                                            {shoot.brideName} & {shoot.groomName}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="text-xs font-medium text-gray-500 truncate max-w-[140px] text-right hidden sm:block">
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
