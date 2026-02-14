'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Home,
    Calendar,
    Edit,
    FileText,
    Package,
    Info,
    Boxes,
    ImageIcon,
    Mail,
    Palette,
    Settings,
    Bell,
    UserCog,
    UserX,
    Server,
    MessageSquare,
    FileCode,
    ChevronDown,
    ChevronRight,
    X,
    Menu,
    Users,
    User,
    LogOut,
    Lock,
    LayoutDashboard,
    ExternalLink,
    Crown,
    Globe,
    ShieldAlert
} from 'lucide-react';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const menuSections: MenuSection[] = [
    {
        title: 'PANEL',
        items: [
            { name: 'Panel Ana Sayfa', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Siteye Dön', href: '/', icon: ExternalLink },
        ]
    },
    {
        title: 'RANDEVU YÖNETİMİ',
        items: [
            { name: 'Randevu Ekle', href: '/admin/appointments/new', icon: Calendar, badge: 'New' },
            { name: 'Randevular', href: '/admin/appointments', icon: Edit },
            { name: 'Müşteriler', href: '/admin/customers', icon: Users },
            { name: 'Çekim Sözleşmeleri', href: '/admin/contracts', icon: FileText },
            { name: 'Çekim Paketleri', href: '/admin/packages', icon: Package },
        ]
    },
    {
        title: 'UYGULAMA AYARLARI',
        items: [
            { name: 'Genel Bilgiler', href: '/admin/settings/general', icon: User },
            { name: 'Tema & Görünüm', href: '/admin/settings/theme', icon: Palette },
            { name: 'İçerik Yönetimi', href: '/admin/settings/content', icon: FileText },
            { name: 'İletişim & Sosyal', href: '/admin/settings/contact', icon: Globe },
            { name: 'Galeri Ayarları', href: '/admin/settings/gallery', icon: ImageIcon },
        ]
    },
    {
        title: 'GENEL AYARLAR',
        items: [
            { name: 'Panel Ayarları', href: '/admin/settings/panel', icon: Settings },
            { name: 'Engellenenler', href: '/admin/settings/blocked', icon: UserX },
            { name: 'Mail Şablonları', href: '/admin/settings/mail-templates', icon: FileCode },
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
    }
];

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [websiteSettingsOpen, setWebsiteSettingsOpen] = useState(false);
    const [isStorageHovered, setIsStorageHovered] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);

    // --- LOGIC ---
    const isTrial = session?.user?.packageType === 'trial';
    // Only 'corporate' package users (or superadmins potentially) can access website settings
    const isCorporate = session?.user?.packageType === 'corporate';

    // Calculate Storage Stats
    const usage = session?.user?.storageUsage || 0;
    const limit = session?.user?.storageLimit || 21474836480; // 20GB default
    const usageGB = (usage / (1024 * 1024 * 1024)).toFixed(1);
    const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(0);
    const usagePercent = limit > 0 ? Math.min(Math.round((usage / limit) * 100), 100) : 0;
    const freeGB = ((limit - usage) / (1024 * 1024 * 1024)).toFixed(1);

    // LOGO LOGIC
    // We prioritize using 'panelLogo' (which we map to image in session if we updated auth, or we rely on 'logo' as fallback)
    // Actually, in auth.ts we mapped `image: user.logo`. 
    // We should probably rely on `session.user.image` still, BUT ensure `auth.ts` maps `panelLogo` to `image` instead?
    // OR we can't easily change auth.ts dynamically. 
    // Wait, the API now saves `panelLogo`. 
    // However, existing `auth.ts` maps `user.logo` to `session.user.image`.
    // The previous instruction was to separate them.
    // If I want `session.user.image` to be the PANEL Logo, I should update `auth.ts` to map `panelLogo` to `image`.
    // Let's implement this Sidebar change first assuming session.user.image WILL be the correct panel logo after I update Auth.
    // Logic: If session.user.image exists, show it. Else fallback.
    const panelLogoUrl = session?.user?.image;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#1e1e2d] text-[#9899ac]">

            {/* Top Brand / Profile Section */}
            <div className="p-6 flex items-center gap-4 mb-2 border-b border-[#30304d] min-h-[89px]">
                {panelLogoUrl ? (
                    // LOGO MODE: Show only logo
                    <div className="relative w-full h-10 flex items-center justify-start">
                        <img
                            src={panelLogoUrl}
                            alt="Studio Logo"
                            className="max-w-[180px] max-h-12 object-contain object-left"
                        />
                    </div>
                ) : (
                    // TEXT MODE: Show Initials + Photographer Name
                    <>
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 bg-white/5 flex items-center justify-center">
                                {/* Initials of Name or StudioName */}
                                <div className="w-full h-full bg-gradient-to-br from-[#ff4081] to-[#673ab7] flex items-center justify-center text-white font-semibold text-lg">
                                    {(session?.user?.name || session?.user?.studioName || 'K').charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-white font-semibold text-sm leading-tight tracking-wide truncate">
                                {session?.user?.name || session?.user?.studioName || 'Weey.NET'}
                            </h2>
                            <p className="text-[10px] text-[#6e6e85] mt-0.5 truncate">Yönetim Paneli</p>
                        </div>
                    </>
                )}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="md:hidden ml-auto text-gray-400"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
                {menuSections.map((section) => {
                    const isWebsiteSettings = section.title === 'WEB SİTE AYARLARI';

                    return (
                        <div key={section.title}>
                            {/* Section Title Logic */}
                            {isWebsiteSettings ? (
                                <button
                                    onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
                                    className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#555570] mb-3 pl-3 hover:text-white transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{section.title}</span>
                                        <Crown className="w-3 h-3 text-[#ff4081]" />
                                    </div>
                                    <ChevronDown className={`w-3 h-3 transition-transform ${websiteSettingsOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#555570] mb-3 pl-3">
                                    {section.title}
                                </h3>
                            )}

                            {/* Section Items */}
                            {(!isWebsiteSettings || websiteSettingsOpen) && (
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        // Locking Logic
                                        let isLocked = false;
                                        if (isWebsiteSettings && !isCorporate) {
                                            isLocked = true;
                                        } else if (isTrial && (section.title === 'UYGULAMA AYARLARI')) {
                                            isLocked = true;
                                        }

                                        const isActive = !isLocked && (pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/')));

                                        return (
                                            <button
                                                key={item.name}
                                                onClick={() => {
                                                    if (isLocked) {
                                                        if (isWebsiteSettings) setShowCorporateModal(true);
                                                        return;
                                                    }
                                                    // Normal navigation via Link or router push would be better but button works if we wrap Link
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-left ${isActive
                                                    ? 'bg-[#2b2b3c] text-[#ff4081]'
                                                    : isLocked
                                                        ? 'text-[#4a4a5e] cursor-not-allowed hover:bg-[#2b2b3c]/50'
                                                        : 'hover:bg-[#2b2b3c] hover:text-white'
                                                    }`}
                                            >
                                                {/* Only wrap content in Link if NOT locked */}
                                                {!isLocked ? (
                                                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center flex-1 gap-3">
                                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#ff4081]' : isLocked ? 'text-[#4a4a5e]' : 'text-[#7d7d91] group-hover:text-white'}`} />
                                                        <span className={`text-sm ${isActive ? 'font-medium text-white' : 'font-normal'}`}>
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center flex-1 gap-3">
                                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#ff4081]' : isLocked ? 'text-[#4a4a5e]' : 'text-[#7d7d91] group-hover:text-white'}`} />
                                                        <span className={`text-sm ${isActive ? 'font-medium text-white' : 'font-normal'}`}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Badge or Lock Icon */}
                                                <div className="flex items-center gap-2">
                                                    {isLocked && <Lock className="w-3 h-3" />}

                                                    {/* Special Green Blinking Dot for Randevu Ekle */}
                                                    {item.name === 'Randevu Ekle' && !isLocked && (
                                                        <div className="relative flex h-2.5 w-2.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                                        </div>
                                                    )}

                                                    {/* Standard Badge for others */}
                                                    {item.badge && item.name !== 'Randevu Ekle' && !isLocked && (
                                                        <span className="bg-[#ff4081] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Left Active Indicator */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ff4081] rounded-r-full shadow-[0_0_10px_rgba(255,64,129,0.5)]"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Widget & Logout */}
            <div className="p-4 border-t border-[#30304d] bg-[#1a1a29] relative z-20">

                {/* Premium Subscription & Storage Widget */}
                <div
                    className="mb-4 relative group cursor-help"
                    onMouseEnter={() => setIsStorageHovered(true)}
                    onMouseLeave={() => setIsStorageHovered(false)}
                >
                    {/* Animated Glow Background */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff4081] to-[#673ab7] rounded-2xl opacity-50 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                    <div className="relative px-4 py-4 bg-[#1e1e2d] ring-1 ring-white/10 rounded-xl leading-none flex items-top justify-start space-x-6">
                        <div className="space-y-4 w-full">

                            {/* Header: Pro Badge & Days Left */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-3 w-3">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${session?.user?.packageType === 'corporate' ? 'bg-purple-400' : 'bg-green-400'}`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${session?.user?.packageType === 'corporate' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                                    </div>
                                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wider">
                                        {session?.user?.packageType === 'corporate' ? 'KURUMSAL' : 'STANDART'}
                                    </span>
                                </div>
                                <div className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#ff4081]/10 text-[#ff4081] border border-[#ff4081]/20">
                                    {session?.user?.subscriptionExpiry ?
                                        Math.max(0, Math.ceil((new Date(session.user.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                                        : 0
                                    } Gün
                                </div>
                            </div>

                            {/* Storage Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Depolama</span>
                                    <span className="text-xs font-bold text-white">{usagePercent}%</span>
                                </div>

                                {/* Animated Progress Bar */}
                                <div className="h-2 bg-[#0f0f1a] rounded-full overflow-hidden p-[1px] shadow-inner">
                                    <div className="relative h-full w-full rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,64,129,0.5)] ${usagePercent > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-[#673ab7] via-[#ff4081] to-[#ff9100]'}`}
                                            style={{ width: `${usagePercent}%` }}
                                        >
                                            {/* Shimmer overlay */}
                                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-[9px] text-[#555570] font-medium">
                                    <span>Kullanılan: {usageGB} GB</span>
                                    <span>Limit: {limitGB} GB</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Fixed Tooltip */}
                {isStorageHovered && (
                    <div
                        className="fixed left-[270px] bottom-8 w-72 bg-[#1e1e2d] border border-[#ff4081]/40 rounded-2xl p-0 shadow-[0_0_50px_rgba(255,64,129,0.25)] z-[100] animate-in fade-in slide-in-from-left-4 duration-300 overflow-hidden"
                    >
                        {/* Header Gradient */}
                        <div className="h-1 bg-gradient-to-r from-[#ff4081] via-[#673ab7] to-[#ff4081] animate-gradient-x"></div>

                        <div className="p-5 relative">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#ff4081] rounded-full blur-[50px] opacity-10 pointer-events-none"></div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-[#2b2b3c] to-[#1e1e2d] rounded-xl border border-white/5 shadow-lg">
                                    <Server className="w-6 h-6 text-[#ff4081]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-0.5">Depolama Analizi</h4>
                                    <p className="text-[10px] text-[#9899ac] leading-tight">Canlı sunucu istatistikleri ve doluluk oranı detayları.</p>
                                </div>
                            </div>

                            {/* ... stats content same as before ... */}
                            <div className="space-y-3">
                                <div className="bg-[#2b2b3c]/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="text-[10px] text-[#9899ac]">Anlık Veri</div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-white font-mono">{(usage / (1024 * 1024)).toFixed(2)} MB</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#2b2b3c]/50 p-3 rounded-xl border border-white/5 text-center">
                                        <span className="text-[9px] font-bold text-[#9899ac] uppercase block mb-1">Toplam</span>
                                        <span className="text-sm font-bold text-white">{limitGB} GB</span>
                                    </div>
                                    <div className="bg-[#2b2b3c]/50 p-3 rounded-xl border border-white/5 text-center">
                                        <span className="text-[9px] font-bold text-[#9899ac] uppercase block mb-1">Boş</span>
                                        <span className="text-sm font-bold text-green-400">{freeGB} GB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a29] px-5 py-2 flex items-center justify-between text-[10px] text-[#555570]">
                            <span>Sunucu: <span className="text-green-500">Online</span></span>
                            <span>Ping: 24ms</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[#9899ac] hover:bg-[#ff4081]/10 hover:text-[#ff4081] border border-[#30304d] hover:border-[#ff4081]/30 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Güvenli Çıkış</span>
                </button>
            </div>

            {/* Corporate Requirement Modal */}
            {showCorporateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e1e2d] rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-[#ff4081]/20 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        {/* Background Effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff4081] rounded-full blur-[80px] opacity-20"></div>

                        <div className="text-center relative z-10">
                            <div className="mx-auto w-16 h-16 bg-[#ff4081]/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-[#ff4081]/30">
                                <Crown className="w-8 h-8 text-[#ff4081]" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Kurumsal Üyelik Gerekli</h3>
                            <p className="text-sm text-[#9899ac] mb-6 leading-relaxed">
                                Web sitesi yönetimi ve özel alan adı tanımlama özellikleri sadece
                                <span className="text-white font-bold"> Kurumsal (Corporate)</span> üyelere özeldir.
                            </p>

                            <div className="bg-[#2b2b3c] rounded-xl p-4 mb-6 border border-white/5 text-left">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-orange-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Yönetici İzni Gerekli</h4>
                                        <p className="text-[10px] text-[#9899ac] mt-1">
                                            Bu özelliği sadece Süper Admin aktif edebilir. Lütfen yönetim ile iletişime geçin.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCorporateModal(false)}
                                className="w-full py-3 bg-gradient-to-r from-[#ff4081] to-[#673ab7] rounded-xl text-white font-bold shadow-lg shadow-[#ff4081]/25 hover:opacity-90 transition-all"
                            >
                                Anlaşıldı, Teşekkürler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e1e2d] text-white rounded-lg shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[260px] h-screen fixed left-0 top-0 shadow-2xl z-40">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed left-0 top-0 h-full w-[260px] z-50 shadow-2xl animate-slide-in">
                        <SidebarContent />
                    </div>
                </>
            )}
        </>
    );
}
