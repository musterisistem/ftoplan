'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Home,
    ExternalLink,
    Globe,
    Calendar,
    Edit,
    FileText,
    Package,
    Info,
    Boxes,
    ImageIcon,
    Mail,
    Palette,
    Link2,
    LogIn,
    Layout,
    Settings,
    Bell,
    UserCog,
    UserX,
    Server,
    MessageSquare,
    FileCode,
    ChevronDown,
    ChevronRight,
    Crown,
    X,
    Menu,
    Users,
    User,
    LogOut
} from 'lucide-react';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const menuSections: MenuSection[] = [
    {
        title: 'PANEL',
        items: [
            { name: 'Panel Ana Sayfa', href: '/admin/dashboard', icon: Home },
            { name: 'Siteye Dön', href: '/', icon: ExternalLink },
        ]
    },
    {
        title: 'RANDEVU YÖNETİMİ',
        items: [
            { name: 'Randevu Ekle', href: '/admin/appointments/new', icon: Calendar },
            { name: 'Randevular', href: '/admin/appointments', icon: Edit },
            { name: 'Müşteriler', href: '/admin/customers', icon: Users },
            { name: 'Çekim Sözleşmeleri', href: '/admin/contracts', icon: FileText },
            { name: 'Çekim Paketleri', href: '/admin/packages', icon: Package },
        ]
    },
    {
        title: 'WEB SİTE AYARLARI',
        items: [
            { name: 'Ana Sayfa', href: '/admin/website/home', icon: Home },
            { name: 'Hakkımızda', href: '/admin/website/about', icon: Info },
            { name: 'Paketler', href: '/admin/website/packages', icon: Boxes },
            { name: 'Galeri', href: '/admin/website/gallery', icon: ImageIcon },
            { name: 'İletişim', href: '/admin/website/contact', icon: Mail },
        ]
    },
    {
        title: 'UYGULAMA AYARLARI',
        items: [
            { name: 'Genel Bilgiler', href: '/admin/settings/general', icon: User },
            { name: 'Tema & Görünüm', href: '/admin/settings/theme', icon: Palette },
            { name: 'İçerik Yönetimi', href: '/admin/settings/content', icon: FileText },
            { name: 'İletişim & Sosyal', href: '/admin/settings/contact', icon: Globe },
            { name: 'Galeri', href: '/admin/settings/gallery', icon: ImageIcon },
        ]
    },
    {
        title: 'GENEL AYARLAR',
        items: [
            { name: 'Panel Ayarları', href: '/admin/settings/panel', icon: Settings },
            { name: 'Bildirim Ayarları', href: '/admin/settings/notifications', icon: Bell },
            { name: 'Yönetici Tanımla', href: '/admin/settings/admins', icon: UserCog },
            { name: 'Engellenen Müşteriler', href: '/admin/settings/blocked', icon: UserX },
            { name: 'Mail Server', href: '/admin/settings/mail-server', icon: Server },
            { name: 'NETGSM Ayar', href: '/admin/settings/sms', icon: MessageSquare },
            { name: 'Mail Şablonları', href: '/admin/settings/mail-templates', icon: FileCode },
        ]
    }
];

export default function Sidebar() {
    const { data: session, update: updateSession } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [websiteSettingsOpen, setWebsiteSettingsOpen] = useState(false);
    const [isStorageHovered, setIsStorageHovered] = useState(false);

    // Session is managed by SessionProvider - no manual polling needed
    // Storage stats will update on page load

    // Calculate Storage Stats
    const usage = session?.user?.storageUsage || 0;
    const limit = session?.user?.storageLimit || 21474836480; // 20GB default
    const usageGB = (usage / (1024 * 1024 * 1024)).toFixed(1);
    const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(0);
    const usagePercent = limit > 0 ? Math.min(Math.round((usage / limit) * 100), 100) : 0;
    const freeGB = ((limit - usage) / (1024 * 1024 * 1024)).toFixed(1);

    // Calculate subscription days remaining
    const subscriptionExpiry = session?.user?.subscriptionExpiry ? new Date(session.user.subscriptionExpiry) : null;
    const now = new Date();
    const daysRemaining = subscriptionExpiry ? Math.max(0, Math.ceil((subscriptionExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
    const totalDays = 365;
    const usedDays = totalDays - daysRemaining;
    const subscriptionPercent = Math.min(Math.round((usedDays / totalDays) * 100), 100);
    const expiryDateFormatted = subscriptionExpiry ? subscriptionExpiry.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {session?.user?.studioName?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight">{session?.user?.studioName || 'FotoPlan'}</h1>
                        <p className="text-[10px] text-gray-400">Yönetim Paneli</p>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="md:hidden text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Menu Sections */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                {menuSections.map((section) => {
                    const isWebsiteSettings = section.title === 'WEB SİTE AYARLARI';

                    return (
                        <div key={section.title} className="mb-4">
                            {/* Section Header */}
                            {isWebsiteSettings ? (
                                // Collapsible header for WEB SİTE AYARLARI
                                <button
                                    onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
                                    className="w-full px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between hover:text-gray-300 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{section.title}</span>
                                        {/* Corporate Member Badge */}
                                        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
                                            <Crown className="w-2.5 h-2.5 text-purple-400" />
                                            <span className="text-[8px] font-bold text-purple-300 normal-case tracking-normal">Kurumsal Üye</span>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${websiteSettingsOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            ) : (
                                // Regular header for other sections
                                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>{section.title}</span>
                                </div>
                            )}

                            {/* Section Items */}
                            {(!isWebsiteSettings || websiteSettingsOpen) && (
                                <div className="mt-1 space-y-0.5">
                                    {section.items.map((item) => {
                                        // Special handling for appointments to prevent both being active
                                        let isActive;
                                        if (item.href === '/admin/appointments') {
                                            // Exact match only for appointments list
                                            isActive = pathname === item.href;
                                        } else {
                                            // For others, allow startsWith for child routes
                                            isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                        }

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                prefetch={true}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative group ${isActive
                                                    ? 'bg-[#6366F1] text-white font-medium'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{item.name}</span>

                                                {item.name === 'Randevu Ekle' && (
                                                    <div className="absolute right-3 flex h-2.5 w-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                                    </div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Upgrade Widget - Compact Bottom */}
            <div className="p-3 border-t border-white/10">
                <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>

                    {/* Main Card - Compact */}
                    <div className="relative bg-gradient-to-br from-[#2D3748]/90 to-[#1A202C]/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-2xl">

                        {/* Header - Compact */}
                        <div className="relative px-3 py-2 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className={`w-6 h-6 bg-gradient-to-br ${session?.user?.packageType === 'trial' ? 'from-gray-600 to-gray-700' : 'from-[#6366F1] to-[#8B5CF6]'} rounded-lg flex items-center justify-center`}>
                                            <Crown className="w-3 h-3 text-white" />
                                        </div>
                                        <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 ${session?.user?.packageType === 'trial' ? 'bg-orange-500' : 'bg-green-500'} rounded-full border border-[#1A202C] animate-pulse`}></div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-white">
                                            {session?.user?.packageType === 'trial' ? 'DENEME SÜRÜMÜ' : 'PRO ÜYELİK'}
                                        </h4>
                                        <p className="text-[8px] text-gray-400">
                                            {session?.user?.packageType === 'trial' ? 'Kısıtlı Süre' : 'Premium Üye'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-0.5 ${session?.user?.packageType === 'trial' ? 'bg-orange-500/20 border-orange-400/40' : 'bg-green-500/20 border-green-400/40'} border px-1.5 py-0.5 rounded-full`}>
                                    <div className={`w-1 h-1 ${session?.user?.packageType === 'trial' ? 'bg-orange-400' : 'bg-green-400'} rounded-full animate-pulse`}></div>
                                    <span className={`text-[8px] font-bold ${session?.user?.packageType === 'trial' ? 'text-orange-300' : 'text-green-300'}`}>
                                        {session?.user?.packageType === 'trial' ? `${daysRemaining} GÜN` : 'AKTİF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content - Horizontal Compact Layout */}
                        <div className="relative p-3 space-y-2">

                            {/* Days Counter & Progress - Horizontal */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{daysRemaining}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">gün kaldı</span>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[9px] text-gray-400 mb-0.5">
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{expiryDateFormatted}</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-white">Süre: %{100 - subscriptionPercent}</div>
                                </div>
                            </div>

                            {/* Compact Progress Bar */}
                            <div className="relative h-1.5 bg-black/30 rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500"
                                    style={{ width: `${100 - subscriptionPercent}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                </div>
                            </div>

                            {/* Storage - Compact Horizontal - Dynamic */}
                            <div
                                className="relative group cursor-help transition-all"
                                onMouseEnter={() => setIsStorageHovered(true)}
                                onMouseLeave={() => setIsStorageHovered(false)}
                            >
                                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-2 border border-purple-500/20 transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded flex items-center justify-center">
                                                <Server className="w-2.5 h-2.5 text-purple-400" />
                                            </div>
                                            <p className="text-[9px] text-gray-400 font-medium">Depolama Alanı</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-white">{usageGB} GB / {limitGB} GB</p>
                                    </div>

                                    <div className="relative h-1.5 bg-black/30 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-0 rounded-full transition-all duration-700 ${usagePercent > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                }`}
                                            style={{ width: `${usagePercent}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-1 text-[8px]">
                                        <span className={usagePercent > 90 ? 'text-red-400 font-medium' : 'text-purple-400 font-medium'}>%{usagePercent} Kullanımda</span>
                                        <span className="text-gray-500">{freeGB} GB Boş</span>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* Fixed Tooltip - Rendered outside overflow container */}
                {isStorageHovered && (
                    <div
                        className="fixed left-[285px] bottom-8 w-64 bg-[#1E293B] border border-purple-500/30 rounded-xl p-4 shadow-[0_0_40px_rgba(139,92,246,0.3)] z-[100] animate-in fade-in slide-in-from-left-2 duration-200 pointer-events-none"
                    >
                        <div className="absolute -left-2 bottom-8 w-4 h-4 bg-[#1E293B] border-l border-b border-purple-500/30 transform rotate-45"></div>

                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                            <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                <Server className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Depolama Detayları</h4>
                                <p className="text-[10px] text-purple-300">Canlı Kullanım İstatistikleri</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                <span className="text-[11px] text-gray-400">Anlık Kullanım</span>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-white">{(usage / (1024 * 1024)).toFixed(2)} MB</div>
                                    <div className="text-[9px] text-gray-500">{(usage / 1024).toFixed(0)} KB</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                    <span className="text-[10px] text-gray-400 block mb-0.5">Toplam Kota</span>
                                    <span className="text-xs font-bold text-white">{limitGB} GB</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg text-center">
                                    <span className="text-[10px] text-gray-400 block mb-0.5">Boş Alan</span>
                                    <span className="text-xs font-bold text-green-400">{freeGB} GB</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-2 rounded-lg">
                                <div className="flex justify-between text-[10px] mb-1.5">
                                    <span className="text-gray-400">Doluluk Oranı</span>
                                    <span className={usagePercent > 90 ? 'text-red-400 font-bold' : 'text-purple-400 font-bold'}>%{usagePercent}</span>
                                </div>
                                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${usagePercent > 90 ? 'bg-red-500' : 'bg-purple-500'}`}
                                        style={{ width: `${usagePercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout Button */}
                <div className="mt-4 px-3">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Çıkış Yap</span>
                    </button>
                </div>

                {/* Shimmer animation */}
                <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
        `}</style>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1E293B] text-white rounded-lg flex items-center justify-center"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-full w-[280px] bg-[#1E293B] text-white fixed left-0 top-0 z-50">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="md:hidden fixed left-0 top-0 h-full w-[280px] bg-[#1E293B] text-white z-50 flex flex-col">
                        <SidebarContent />
                    </div>
                </>
            )}
        </>
    );
}
