'use client';

import Image from 'next/image';
import { Bell, Search, MapPin, HelpCircle, Globe } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">

            {/* Left - Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900">
                    <Search className="w-5 h-5" />
                </button>

                <h1 className="text-lg font-bold text-gray-900 ml-2">
                    Merhaba, Hoş geldin! 👋
                </h1>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-4">
                <button className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    TR
                </button>

                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900">
                    <MapPin className="w-5 h-5" />
                </button>

                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 ml-2">
                    <div className="w-8 h-8 rounded-full border border-gray-200 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        A
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none">Admin</p>
                        <p className="text-[10px] text-gray-400">admin@fotopanel.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
