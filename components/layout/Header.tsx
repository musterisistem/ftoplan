'use client';

import { Bell, Search, Globe, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="h-20 bg-[#F3F6FD] flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Search Bar - Transparent on Dashboard usually, or White Card */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#ff4081] transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff4081]/20 shadow-sm transition-shadow"
                        placeholder="Arama yap..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6 ml-4">

                {/* Language / Help */}
                <button className="text-gray-500 hover:text-[#ff4081] transition-colors font-medium text-sm flex items-center gap-1">
                    Help
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button className="p-2 text-gray-500 hover:text-[#ff4081] transition-colors relative">
                        <span className="sr-only">Bildirimler</span>
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-[#ff4081] ring-2 ring-[#F3F6FD]" />
                    </button>
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4081] text-[10px] font-bold text-white shadow-sm border border-white">
                        2
                    </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800">{session?.user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500">{session?.user?.studioName || 'Studio'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#ff4081] font-bold">
                        {session?.user?.name?.charAt(0) || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
