'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Plus, Menu } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            label: 'Özet',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
            match: '/admin/dashboard'
        },
        {
            label: 'Takvim',
            icon: Calendar,
            href: '/admin/appointments',
            match: '/admin/appointments'
        },
        // We'll put a placeholder for the '+' button in the middle
        {
            label: 'Ekle',
            icon: Plus,
            href: '#',
            match: 'none',
            isFab: true
        },
        {
            label: 'Müşteriler',
            icon: Users,
            href: '/admin/customers',
            match: '/admin/customers'
        },
        {
            label: 'Menü',
            icon: Menu,
            href: '#',
            match: 'none',
            isMenu: true
        }
    ];

    const handlePlusClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Quick Add Menu Popup (Overlay) */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed bottom-[85px] left-1/2 -translate-x-1/2 z-[46] animate-in slide-in-from-bottom-5 fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl flex flex-col gap-1 p-2 border border-slate-100 min-w-[200px]">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    router.push('/admin/appointments/new');
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Randevu Ekle</p>
                                    <p className="text-[10px] text-slate-500">Yeni bir çekim planla</p>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    router.push('/admin/customers');
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Müşteri Ekle</p>
                                    <p className="text-[10px] text-slate-500">Yeni müşteri kaydı</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="md:hidden fixed bottom-0 left-0 right-0 min-h-[72px] h-auto bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] px-2 pb-4 pt-1 flex items-center justify-around">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.match || (item.match !== '/admin/dashboard' && pathname.startsWith(item.match) && !item.isFab && !item.isMenu);

                    if (item.isFab) {
                        return (
                            <div key={index} className="relative -top-5 flex flex-col items-center">
                                <button
                                    onClick={handlePlusClick}
                                    className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg shadow-[#7B3FF2]/30 transition-transform active:scale-95 z-20 ${isMenuOpen ? 'bg-slate-800 rotate-45' : 'bg-gradient-to-r from-[#7B3FF2] to-[#5a2ab3]'
                                        }`}
                                >
                                    <item.icon className="w-6 h-6 text-white" />
                                </button>
                                <span className="text-[10px] font-semibold text-slate-500 mt-1">Ekle</span>
                            </div>
                        );
                    }

                    if (item.isMenu) {
                        return (
                            <button
                                key={index}
                                onClick={onMenuClick}
                                className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform"
                            >
                                <item.icon className="w-6 h-6 text-slate-400" />
                                <span className="text-[10px] font-semibold text-slate-500">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href}
                            prefetch={true}
                            className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-all relative"
                        >
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-[#7B3FF2] rounded-b-full"></div>
                            )}
                            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'text-[#7B3FF2] bg-[#7B3FF2]/10' : 'text-slate-400'}`}>
                                <item.icon className={`w-6 h-6 ${isActive && item.label === 'Takvim' ? 'fill-current opacity-20 relative top-[1px]' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-semibold ${isActive ? 'text-[#7B3FF2]' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
