'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Users, Camera, Calendar as CalendarIcon, Clock, MoreHorizontal, Filter } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Toplam Gelir"
                        value="₺52,000"
                        change="+8.33%"
                        isPositive={true}
                        period="geçen haftadan"
                    />
                    <StatCard
                        title="Dönüşüm Oranı"
                        value="3.5%"
                        change="+16.67%"
                        isPositive={true}
                        period="geçen haftadan"
                    />
                    <StatCard
                        title="Aktif Çekimler"
                        value="12"
                        change="-4.35%"
                        isPositive={false}
                        period="geçen haftadan"
                    />
                    <StatCard
                        title="Yeni Müşteri"
                        value="650"
                        change="+12%"
                        isPositive={true}
                        period="geçen haftadan"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Çekim Gelirleri</h3>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                                <option>Bu Hafta</option>
                                <option>Bu Ay</option>
                            </select>
                        </div>

                        <div className="h-48 relative flex items-end">
                            {/* Revenue Line Chart Simulation */}
                            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,35 L15,28 L30,32 L45,18 L60,22 L75,12 L90,15 L100,8 L100,40 L0,40 Z" fill="url(#revenueGradient)" />
                                <path d="M0,35 L15,28 L30,32 L45,18 L60,22 L75,12 L90,15 L100,8" fill="none" stroke="#6366F1" strokeWidth="0.8" />

                                {/* Highlight Circle */}
                                <circle cx="45" cy="18" r="1.5" fill="#6366F1" stroke="white" strokeWidth="0.5" />
                            </svg>

                            {/* Tooltip */}
                            <div className="absolute top-[20%] left-[38%] bg-white shadow-lg rounded-lg p-2 border border-gray-100">
                                <div className="text-[10px] text-gray-500 mb-0.5">Mart</div>
                                <div className="text-sm font-bold text-gray-900">₺27,295,790</div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 text-[10px] text-gray-400">
                            <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
                        </div>
                    </div>

                    {/* Product Stats - Bar Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Çekim Türleri</h3>
                            <button className="text-xs flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5">
                                <Filter className="w-3 h-3" /> Filtrele
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 mb-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#6366F1] rounded-full"></div>
                                <span className="text-gray-600">Düğün</span>
                                <span className="font-bold">321</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#EC4899] rounded-full"></div>
                                <span className="text-gray-600">Nişan</span>
                                <span className="font-bold">222</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                                <span className="text-gray-600">Dış</span>
                                <span className="font-bold">56</span>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="h-40 flex items-end justify-between gap-3">
                            {[
                                { blue: 80, pink: 50, green: 20 },
                                { blue: 60, pink: 70, green: 30 },
                                { blue: 90, pink: 40, green: 25 },
                                { blue: 70, pink: 60, green: 35 },
                                { blue: 85, pink: 55, green: 28 },
                                { blue: 75, pink: 65, green: 32 },
                                { blue: 95, pink: 45, green: 22 },
                            ].map((bars, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                    <div className="w-full bg-[#6366F1] rounded-t-md" style={{ height: `${bars.blue}%` }}></div>
                                    <div className="w-full bg-[#EC4899] rounded-t-md" style={{ height: `${bars.pink}%` }}></div>
                                    <div className="w-full bg-[#10B981] rounded-t-md" style={{ height: `${bars.green}%` }}></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-3 text-[10px] text-gray-400">
                            <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Mini Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MiniCard title="Proje Dashboard" assignee="News Task Assign" time="4 hrs ago" avatars={[20, 21]} />
                    <MiniCard title="Figma Design" assignee="News Task Assign" time="4 hrs ago" avatars={[22, 23]} />
                    <MiniCard title="UX Research" assignee="News Task Assign" time="4 hrs ago" avatars={[24, 25]} />
                    <MiniCard title="Admin Template" assignee="News Task Assign" time="4 hrs ago" avatars={[26, 27]} />
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Messages Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Mesajlar</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-2xl font-bold">23,457</span>
                                    <span className="text-xs font-bold text-green-600">+15%</span>
                                </div>
                            </div>
                            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                                <option>Günlük</option>
                            </select>
                        </div>

                        <div className="flex gap-4 mb-4 text-xs">
                            {[
                                { label: 'Alındı', value: '6,345', color: 'bg-blue-500' },
                                { label: 'Giden', value: '4,760', color: 'bg-purple-500' },
                                { label: 'Kaçırılan', value: '1,441', color: 'bg-yellow-500' }
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                                    <span className="text-gray-600">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-32">
                            <svg viewBox="0 0 100 40" className="w-full h-full">
                                <path d="M0,30 Q25,15 50,25 T100,20" fill="none" stroke="#3B82F6" strokeWidth="0.6" />
                                <path d="M0,25 Q25,10 50,20 T100,15" fill="none" stroke="#A855F7" strokeWidth="0.6" />
                                <path d="M0,35 Q25,25 50,32 T100,28" fill="none" stroke="#EAB308" strokeWidth="0.6" />
                            </svg>
                        </div>
                    </div>

                    {/* Project Overview - Donut */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">Proje Durumu</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-2xl font-bold">23,457</span>
                                    <span className="text-xs font-bold text-red-600">-1.5%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Donut Chart */}
                            <div className="w-32 h-32 rounded-full border-[16px] border-blue-500 border-r-pink-500 border-b-yellow-500 border-l-purple-500 relative flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-lg font-bold">26</div>
                                    <div className="text-[9px] text-gray-400">Proje</div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 space-y-3">
                                {[
                                    { name: 'Product Design', count: '26', color: 'bg-pink-500' },
                                    { name: 'UI/UX Design', count: '26', color: 'bg-yellow-500' },
                                    { name: 'Web Development', count: '26', color: 'bg-blue-500' }
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center`}>
                                                <div className="w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900">{item.count} Total Project</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Sidebar - Team Members & Activity */}
            <div className="w-80 bg-white border-l border-gray-100 p-6 overflow-y-auto hidden xl:block">

                {/* Team Members */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Ekip Üyeleri</h3>
                        <select className="text-xs border-none bg-transparent">
                            <option>Son</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        {[
                            { name: 'John Matthews', role: 'UX Designer', time: '2 min ago', initial: 'JM', color: 'from-blue-400 to-blue-600' },
                            { name: 'Sophia Adams', role: 'Product Manager', time: '2 min ago', initial: 'SA', color: 'from-purple-400 to-purple-600' },
                            { name: 'Lily Thompson', role: 'Frontend Developer', time: '2 min ago', initial: 'LT', color: 'from-pink-400 to-pink-600' },
                            { name: 'Emily Rivera', role: 'UI Designer', time: '4 min ago', initial: 'ER', color: 'from-green-400 to-green-600' },
                            { name: 'Ava Ramirez', role: 'Backend Developer', time: '2 min ago', initial: 'AR', color: 'from-indigo-400 to-indigo-600' },
                        ].map((member) => (
                            <div key={member.name} className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold`}>
                                    {member.initial}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-900">{member.name}</h4>
                                    <p className="text-[10px] text-gray-500">{member.role}</p>
                                </div>
                                <div className="text-[9px] text-gray-400">{member.time}</div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 text-xs font-medium text-[#6366F1] flex items-center justify-center gap-1 hover:underline">
                        Detayları Gör <span>→</span>
                    </button>
                </div>

                {/* Top Conversations */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">En Çok Konuşulan</h3>
                        <select className="text-xs border-none bg-transparent">
                            <option>Günlük</option>
                        </select>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Mesajlar</span>
                            <span className="text-sm font-bold">321</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Aramalar</span>
                            <span className="text-sm font-bold">222</span>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-32 flex items-end justify-between gap-2">
                        {[40, 60, 45, 80, 55, 90, 65, 50, 70, 35].map((h, i) => (
                            <div key={i} className={`flex-1 rounded-t-md ${i === 6 ? 'bg-[#6366F1]' : 'bg-gray-200'}`} style={{ height: `${h}%` }}></div>
                        ))}
                    </div>

                    {/* Avatar Row */}
                    <div className="flex -space-x-2 mt-4">
                        {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => {
                            const colors = ['from-red-400 to-red-600', 'from-yellow-400 to-yellow-600', 'from-green-400 to-green-600', 'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600'];
                            return (
                                <div
                                    key={letter}
                                    className={`w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-[10px] font-bold`}
                                >
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

const StatCard = React.memo(function StatCard({ title, value, change, isPositive, period }: any) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-500">{title}</h3>
                <button className="text-gray-300 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
            <div className="flex items-center gap-1 text-xs">
                {isPositive ? (
                    <span className="text-green-600 font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {change}
                    </span>
                ) : (
                    <span className="text-red-600 font-bold flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" /> {change}
                    </span>
                )}
                <span className="text-gray-400">{period}</span>
            </div>
        </div>
    );
});

const MiniCard = React.memo(function MiniCard({ title, assignee, time, avatars }: any) {
    const colors = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-pink-400 to-pink-600', 'from-green-400 to-green-600'];

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <button className="text-gray-300 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">{assignee}</p>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {avatars.map((img: number, idx: number) => (
                        <div
                            key={img}
                            className={`w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                            {String.fromCharCode(65 + idx)}
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {time}
                </div>
            </div>
        </div>
    );
});
