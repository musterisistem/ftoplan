'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image, Wallet, Calendar, LogOut, Heart } from 'lucide-react';
import { signOut } from 'next-auth/react';

// Client specific navigation
const navigation = [
    { name: 'Özet', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Takvimim', href: '/client/schedule', icon: Calendar },
    { name: 'Galerilerim', href: '/client/galleries', icon: Image },
    { name: 'Ödemeler', href: '/client/payments', icon: Wallet },
];

interface ClientSidebarProps {
    customerName?: string;
}

export default function ClientSidebar({ customerName }: ClientSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 px-6 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-pink-500/20">
                            <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Weey.NET
                        </span>
                    </div>

                    {/* Customer Name */}
                    {customerName && (
                        <div className="px-6 mb-6">
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-3 border border-pink-100">
                                <p className="text-xs text-pink-600 font-medium mb-1">Müşteri</p>
                                <p className="text-sm font-bold text-gray-800 truncate">{customerName}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="mt-2 flex-1 px-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-pink-50 text-pink-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="flex-shrink-0 flex border-t border-gray-100 p-4">
                    <button
                        onClick={() => signOut({ callbackUrl: '/client/login' })}
                        className="flex-shrink-0 w-full group block px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <div className="flex items-center text-gray-500 group-hover:text-red-600">
                            <LogOut size={18} className="mr-2" />
                            <span className="text-sm font-medium">Çıkış Yap</span>
                        </div>
                    </button>
                </div>
            </div>
        </div >
    );
}
