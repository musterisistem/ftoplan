'use client';

import { useState } from 'react';
import { Bell, Search, Globe, Menu, Zap, ChevronDown, MessageCircle, LogOut, Settings, Image as ImageIcon, LayoutTemplate, MonitorSmartphone, Contact2, FileText } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import UpgradeModal from '@/components/admin/UpgradeModal';

export default function Header() {
    const { data: session } = useSession();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <>
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
                                        <Link href="/admin/settings/general" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <Settings className="w-[18px] h-[18px]" /> Genel Ayarlar
                                        </Link>
                                        <Link href="/admin/settings/contact" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <Contact2 className="w-[18px] h-[18px]" /> İletişim Bilgileri
                                        </Link>
                                        <Link href="/admin/settings/gallery" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <ImageIcon className="w-[18px] h-[18px]" /> Galeri Ayarları
                                        </Link>
                                        <Link href="/admin/settings/theme" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <LayoutTemplate className="w-[18px] h-[18px]" /> Tema Ayarları
                                        </Link>
                                        <Link href="/admin/settings/content" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <FileText className="w-[18px] h-[18px]" /> İçerik Yönetimi
                                        </Link>
                                        <Link href="/admin/settings/panel" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 hover:text-[#7B3FF2] transition-colors">
                                            <MonitorSmartphone className="w-[18px] h-[18px]" /> Panel Bilgileri
                                        </Link>
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
