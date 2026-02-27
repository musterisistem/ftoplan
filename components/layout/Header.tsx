'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Globe, Menu, Zap, ChevronDown, MessageCircle, LogOut, Settings, Image as ImageIcon, LayoutTemplate, MonitorSmartphone, Contact2, FileText, Users, Camera, Loader2, X, Clock, Lock } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import UpgradeModal from '@/components/admin/UpgradeModal';

export default function Header() {
    const { data: session } = useSession();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const router = useRouter();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi Günler' : 'İyi Akşamlar';
    const dateStr = currentTime.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const timeStr = currentTime.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return <Users className="w-5 h-5 text-blue-500" />;
            case 'Camera': return <Camera className="w-5 h-5 text-indigo-500" />;
            case 'LayoutTemplate': return <LayoutTemplate className="w-5 h-5 text-pink-500" />;
            default: return <Search className="w-5 h-5 text-gray-400" />;
        }
    };

    const handleResultClick = (url: string) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        router.push(url);
    };

    return (
        <>
            <header className="h-20 bg-[#F3F6FD] flex items-center justify-between px-8 sticky top-0 z-30 shadow-md">
                {/* Left Side: Search Bar & Greeting */}
                <div className="flex-1 flex items-center gap-6 max-w-3xl">
                    <div className="relative group w-full max-w-md" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#ff4081] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            className="block w-full pl-10 pr-10 py-2.5 border-none rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff4081]/20 shadow-sm transition-shadow"
                            placeholder="Müşteri adı, telefon, tarih veya menü ara..."
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {/* Search Dropdown */}
                        {isSearchOpen && (searchQuery.length >= 2) && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 flex flex-col">
                                {isSearching ? (
                                    <div className="flex items-center justify-center py-6 text-gray-500 gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#ff4081]" />
                                        <span>Aranıyor...</span>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Arama Sonuçları</div>
                                        {searchResults.map((res: any, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleResultClick(res.url)}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
                                                    {getIcon(res.icon)}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-gray-900 truncate">{res.title}</span>
                                                    <span className="text-xs text-gray-500 truncate">{res.subtitle}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-300 mb-2" />
                                        <span className="text-sm">Sonuç bulunamadı</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Greeting & Date */}
                    <div className="hidden xl:block whitespace-nowrap">
                        <span className="text-[17px] font-extrabold tracking-tight text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">{greeting}!</span>
                        <span className="text-sm font-medium text-slate-500 ml-2">Bugün, {dateStr}</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-4">

                    {/* Upgrade Button (Only for Trial Users) */}
                    {session?.user?.packageType === 'trial' && (
                        <button
                            onClick={() => setUpgradeModalOpen(true)}
                            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                        >
                            <Zap className="w-4 h-4" />
                            <span>Paketi Yükselt</span>
                        </button>
                    )}

                    {/* Active & Time Widgets */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl shadow-sm border border-emerald-100">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-xs font-bold text-emerald-700">Aktif</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-xs font-bold text-slate-700">{timeStr}</span>
                        </div>
                    </div>

                    {/* Help / Support WhatsApp Link */}
                    <a
                        href="https://wa.me/905517071494"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-green-500 transition-colors font-semibold text-sm flex items-center gap-1.5"
                    >
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        Destek
                    </a>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="p-2 text-gray-500 hover:text-[#ff4081] transition-colors relative"
                        >
                            <span className="sr-only">Bildirimler</span>
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <>
                                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-[#ff4081] ring-2 ring-[#F3F6FD]" />
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4081] text-[10px] font-bold text-white shadow-sm border border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                </>
                            )}
                        </button>
                        <NotificationDropdown
                            notifications={notifications}
                            onMarkAsRead={markAsRead}
                            onMarkAllAsRead={markAllAsRead}
                            onClose={() => setNotificationOpen(false)}
                            isOpen={notificationOpen}
                        />
                    </div>

                    {/* User Profile */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-800">Merhaba: {session?.user?.studioName || session?.user?.name || 'Studio'}</p>
                                <p className="text-xs text-gray-500">{session?.user?.packageType === 'kurumsal' ? 'Kurumsal Paket' : session?.user?.packageType === 'standart' ? 'Standart Paket' : session?.user?.role === 'superadmin' ? 'Super Admin' : 'Deneme Paketi'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-[#7B3FF2] font-bold">
                                {session?.user?.studioName?.charAt(0) || session?.user?.name?.charAt(0) || 'A'}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Profile Dropdown */}
                        {profileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                                        <p className="text-[15px] font-bold text-gray-900 leading-tight">{session?.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{session?.user?.email}</p>
                                    </div>

                                    <div className="px-2 space-y-1">
                                        {[
                                            { href: "/admin/settings/general", label: "Genel Ayarlar", icon: Settings },
                                            { href: "/admin/settings/contact", label: "İletişim Bilgileri", icon: Contact2 },
                                            { href: "/admin/settings/gallery", label: "Galeri Ayarları", icon: ImageIcon },
                                            { href: "/admin/settings/theme", label: "Tema Ayarları", icon: LayoutTemplate },
                                            { href: "/admin/settings/content", label: "İçerik Yönetimi", icon: FileText },
                                            { href: "/admin/settings/panel", label: "Panel Bilgileri", icon: MonitorSmartphone },
                                        ].map((item) => {
                                            const isLocked = session?.user?.packageType === 'trial' && item.href !== '/admin/settings/panel';

                                            if (isLocked) {
                                                return (
                                                    <button
                                                        key={item.href}
                                                        onClick={() => {
                                                            setProfileOpen(false);
                                                            setUpgradeModalOpen(true);
                                                        }}
                                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-slate-400 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="w-[18px] h-[18px] text-slate-300" />
                                                            {item.label}
                                                        </div>
                                                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                    </button>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors"
                                                >
                                                    <item.icon className="w-[18px] h-[18px]" /> {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-gray-50 mt-2 pt-2 px-2">
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/login' })}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors"
                                        >
                                            <LogOut className="w-[18px] h-[18px]" /> Çıkış Yap
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <UpgradeModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
        </>
    );
}
