'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import CreativeLoader from '@/components/ui/CreativeLoader';
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
import { Loader2 } from 'lucide-react';

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
        title: 'ÖZET',
        items: [
            { name: 'Panel Ana Sayfa', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Siteye Dön', href: '/', icon: ExternalLink },
        ]
    },
    {
        title: 'STUDYO YÖNETİMİ',
        items: [
            { name: 'Randevu Ekle', href: '/admin/appointments/new', icon: Calendar, badge: 'Yeni İş' },
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
        title: 'SİSTEM & GÜVENLİK',
        items: [
            { name: 'Panel Ayarları', href: '/admin/settings/panel', icon: Settings },
            { name: 'Engellenenler', href: '/admin/settings/blocked', icon: UserX },
            { name: 'Mail Şablonları', href: '/admin/settings/mail-templates', icon: FileCode },
        ]
    },
    {
        title: 'WEB SİTESİ (KURUMSAL)',
        items: [
            { name: 'Ana Sayfa', href: '/admin/website/home', icon: Home },
            { name: 'Hakkımızda', href: '/admin/website/about', icon: Info },
            { name: 'Paketler', href: '/admin/website/packages', icon: Boxes },
            { name: 'Galeri', href: '/admin/website/gallery', icon: ImageIcon },
            { name: 'İletişim', href: '/admin/website/contact', icon: Mail },
        ]
    }
];

const PingDisplay = () => {
    const [ping, setPing] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            // Random ping between 5 and 20
            setPing(Math.floor(Math.random() * (20 - 5 + 1)) + 5);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span className="text-[11px] font-bold text-emerald-400 font-mono tracking-wider">{ping}ms</span>
        </>
    );
};

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [websiteSettingsOpen, setWebsiteSettingsOpen] = useState(false);
    const [isStorageHovered, setIsStorageHovered] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);

    // --- LOGIC ---
    const isTrial = session?.user?.packageType === 'trial';
    const isCorporate = session?.user?.packageType === 'kurumsal' || session?.user?.role === 'superadmin';

    // Calculate Storage Stats
    const usage = session?.user?.storageUsage || 0;
    const limit = session?.user?.storageLimit || 21474836480; // 20GB default
    const usageGB = (usage / (1024 * 1024 * 1024)).toFixed(1);
    const usageMB = (usage / (1024 * 1024)).toFixed(1);
    const limitGB = (limit / (1024 * 1024 * 1024)).toFixed(0);
    const usagePercent = limit > 0 ? Math.min(Math.round((usage / limit) * 100), 100) : 0;
    const freeGB = ((limit - usage) / (1024 * 1024 * 1024)).toFixed(1);

    const panelLogoUrl = session?.user?.image;

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('Çıkış yapılıyor...');

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setLogoutMessage('Çıkış yapılıyor...');

        await new Promise(r => setTimeout(r, 1500));
        setLogoutMessage('Güvenli çıkış yapıldı.');

        await new Promise(r => setTimeout(r, 1000));
        signOut({ callbackUrl: '/' });
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0B0F19] text-slate-400 font-sans tracking-wide relative overflow-hidden">
            <CreativeLoader
                isVisible={isLoggingOut}
                message={logoutMessage}
                subMessage={logoutMessage === 'Çıkış yapılıyor...' ? 'Oturumunuz güvenli bir şekilde kapatılıyor.' : 'Yönlendiriliyorsunuz...'}
            />
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#7A70BA]/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Top Brand / Profile Section */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 min-h-[85px] relative z-10">
                <div className="flex items-center gap-3 w-full">
                    {panelLogoUrl ? (
                        <div className="relative w-full h-10 flex items-center justify-start">
                            <img
                                src={panelLogoUrl}
                                alt="Studio Logo"
                                className="max-w-[170px] max-h-12 object-contain object-left drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(122,112,186,0.3)] bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                                    <div className="w-full h-full bg-gradient-to-br from-[#7A70BA] to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                                        {(session?.user?.name || session?.user?.studioName || 'K').charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden flex-1">
                                <h2 className="text-white font-bold text-sm leading-tight truncate tracking-wide">
                                    {session?.user?.name || session?.user?.studioName || 'Weey.NET'}
                                </h2>
                                <p className="text-[10px] text-[#7A70BA] mt-0.5 truncate uppercase tracking-[0.2em] font-semibold">Yönetim Paneli</p>
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="md:hidden ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8 custom-scrollbar relative z-10">
                {menuSections.map((section) => {
                    const isWebsiteSettings = section.title === 'WEB SİTESİ (KURUMSAL)';
                    const sectionSlug = section.title.toLowerCase();

                    return (
                        <div key={section.title} className="relative">
                            {/* Section Title */}
                            {isWebsiteSettings ? (
                                <button
                                    onClick={() => setWebsiteSettingsOpen(!websiteSettingsOpen)}
                                    className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3 px-2 hover:text-white transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{section.title}</span>
                                        <Crown className="w-3.5 h-3.5 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${websiteSettingsOpen ? 'rotate-180 text-white' : ''}`} />
                                </button>
                            ) : (
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-3 px-2 relative inline-flex items-center">
                                    {section.title}
                                </h3>
                            )}

                            {/* Section Items */}
                            <div className={`space-y-0.5 transition-all duration-300 overflow-hidden ${isWebsiteSettings && !websiteSettingsOpen ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 block'}`}>
                                {section.items.map((item) => {
                                    // Locking Logic
                                    let isLocked = false;
                                    if (isWebsiteSettings && !isCorporate) {
                                        isLocked = true;
                                    } else if (isTrial && (section.title === 'UYGULAMA AYARLARI')) {
                                        isLocked = true;
                                    }

                                    const isActive = !isLocked && (pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/')));

                                    const content = (
                                        <>
                                            <div className="flex items-center flex-1 gap-3 relative z-10 pl-1">
                                                <item.icon className={`w-[18px] h-[18px] transition-all duration-300 ${isActive ? 'text-white' : isLocked ? 'text-slate-700' : 'text-slate-400 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`} />
                                                <span className={`text-[13px] transition-colors duration-300 ${isActive ? 'font-bold text-white tracking-wide' : isLocked ? 'text-slate-600' : 'font-medium text-slate-400 group-hover:text-white tracking-wide'}`}>
                                                    {item.name}
                                                </span>
                                            </div>

                                            {/* Badges / Locked State */}
                                            <div className="flex items-center gap-2 z-10 pr-1">
                                                {isLocked && <Lock className="w-3.5 h-3.5 text-slate-600" />}

                                                {item.name === 'Randevu Ekle' && !isLocked && (
                                                    <div className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                                    </div>
                                                )}

                                                {item.badge && item.name !== 'Randevu Ekle' && !isLocked && (
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border backdrop-blur-sm transition-all ${isActive ? 'bg-[#7A70BA]/20 text-white border-[#7A70BA]/30 shadow-[0_0_10px_rgba(122,112,186,0.2)]' : 'bg-white/5 text-slate-400 border-white/5 group-hover:border-white/10 group-hover:text-white'}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Custom Creative Active Style */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[3px] bg-gradient-to-b from-[#7A70BA] to-violet-500 rounded-r-full shadow-[0_0_10px_rgba(122,112,186,0.8)] z-20"></div>
                                            )}
                                        </>
                                    );

                                    return (
                                        <div key={item.name} className="relative">
                                            {isLocked ? (
                                                <button
                                                    onClick={() => {
                                                        if (isWebsiteSettings) setShowCorporateModal(true);
                                                    }}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-left cursor-not-allowed hover:bg-white/5"
                                                >
                                                    {content}
                                                </button>
                                            ) : (
                                                <Link
                                                    id={item.name === 'Müşteriler' ? 'tour-sidebar-customers' : item.name === 'Çekim Paketleri' ? 'tour-sidebar-packages' : item.name === 'Panel Ayarları' ? 'tour-sidebar-settings' : undefined}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group relative text-left overflow-hidden ${isActive ? 'bg-gradient-to-r from-[#7A70BA]/10 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'hover:bg-white/5 hover:shadow-sm'}`}
                                                >
                                                    {content}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom Widget & Logout */}
            <div className="p-4 border-t border-white/5 bg-[#0B0F19]/80 backdrop-blur-md relative z-20">
                {/* Premium Subscription & Storage Widget */}
                <div
                    className="mb-3 relative group cursor-help transition-all duration-300"
                    onMouseEnter={() => setIsStorageHovered(true)}
                    onMouseLeave={() => setIsStorageHovered(false)}
                >
                    <div className="relative p-4 bg-white/5 border border-white/10 hover:border-[#7A70BA]/30 rounded-2xl leading-none flex flex-col gap-3 transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
                        {/* Glass Overlay effect */}
                        <div className="absolute inset-x-0 -top-10 h-[60px] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        {/* Header: Pro Badge & Days Left */}
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${session?.user?.packageType === 'kurumsal'
                                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                                        : session?.user?.packageType === 'trial'
                                            ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]'
                                            : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                    }`}></div>
                                <span className={`text-[10px] font-bold tracking-[0.15em] uppercase ${session?.user?.packageType === 'kurumsal'
                                        ? 'text-amber-400'
                                        : session?.user?.packageType === 'trial'
                                            ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]'
                                            : 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]'
                                    }`}>
                                    {session?.user?.packageType === 'kurumsal' ? 'KURUMSAL' : session?.user?.packageType === 'trial' ? 'DENEME' : 'STANDART'}
                                </span>
                            </div>
                            <div className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white shadow-inner">
                                {session?.user?.subscriptionExpiry ?
                                    Math.max(0, Math.ceil((new Date(session.user.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                                    : 0
                                } Gün
                            </div>
                        </div>

                        {/* Storage Section */}
                        <div className="space-y-1.5 relative z-10">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Depolama</span>
                                <span className="text-[10px] font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{usagePercent}%</span>
                            </div>

                            {/* Neon Progress Bar */}
                            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out relative ${usagePercent > 90 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-gradient-to-r from-[#7A70BA] to-cyan-400 shadow-[0_0_10px_rgba(122,112,186,0.6)]'}`}
                                    style={{ width: `${usagePercent}%` }}
                                >
                                    {/* Shimmer effect inside bar */}
                                    <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40"></div>
                                </div>
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                                <span>{usageGB} GB</span>
                                <span>{limitGB} GB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tooltip removed from here to prevent overflow clipping; moved to main return block */}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group border border-transparent hover:border-rose-500/20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform relative z-10" />
                    <span className="text-sm font-bold tracking-wide relative z-10">Güvenli Çıkış</span>
                </button>
            </div>

            {/* Corporate Requirement Modal */}
            {showCorporateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-[#0B0F19] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 max-w-sm w-full mx-4 border border-white/10 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px]"></div>

                        <div className="text-center relative z-10">
                            <div className="mx-auto w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                <Crown className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">Kurumsal Lisans Gerekli</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">
                                Web sitesi yönetimi ve özel alan adı atama özellikleri <span className="text-amber-400 font-bold drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]">Kurumsal Plan</span> kullanıcılarına özeldir.
                            </p>

                            <button
                                onClick={() => setShowCorporateModal(false)}
                                className="w-full py-2.5 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 border border-white/10 rounded-xl text-white font-bold text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            >
                                Kapat
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
                className="md:hidden fixed top-3 left-3 z-50 p-2 bg-[#0B0F19] border border-white/10 text-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-[260px] h-screen fixed left-0 top-0 z-40 border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed left-0 top-0 h-full w-[260px] z-50 shadow-2xl animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </div>
                </>
            )}

            {/* Storage Hover Popup (Moved out of SidebarContent to avoid overflow hidden clipping) */}
            {isStorageHovered && (
                <div className="hidden md:block fixed left-[270px] bottom-6 w-72 bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] z-[100] animate-in fade-in slide-in-from-left-2 duration-200 overflow-hidden pointer-events-none">
                    <div className="p-5 relative">
                        {/* Glows */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7A70BA]/20 blur-[50px] rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4 relative z-10">
                            <div className="p-2.5 bg-gradient-to-br from-[#7A70BA]/20 to-violet-600/20 border border-white/10 rounded-xl shadow-[0_0_15px_rgba(122,112,186,0.3)]">
                                <Server className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white tracking-wide">Depolama Analizi</h4>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5 tracking-wider uppercase">Gerçek Zamanlı Kullanım</p>
                            </div>
                        </div>

                        {/* Graphical Chart & Stats */}
                        <div className="flex items-center gap-5 relative z-10">
                            {/* Circular Progress */}
                            <div
                                className="w-[84px] h-[84px] rounded-full flex-shrink-0 relative shadow-[0_0_20px_rgba(122,112,186,0.2)]"
                                style={{ background: `conic-gradient(from 180deg, #7A70BA ${usagePercent}%, rgba(255,255,255,0.05) ${usagePercent}%)` }}
                            >
                                <div className="absolute inset-[4px] bg-[#0B0F19] rounded-full flex flex-col items-center justify-center border border-white/5">
                                    <span className="text-xl font-bold text-white leading-none drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{usagePercent}%</span>
                                    <span className="text-[8px] text-slate-400 uppercase tracking-[0.2em] mt-1 font-semibold">Dolu</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-3.5">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-[#7A70BA] shadow-[0_0_5px_rgba(122,112,186,0.8)]"></div>
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Kullanılan Alan</span>
                                    </div>
                                    <p className="text-sm font-bold text-white tracking-wide">{Number(usageMB).toLocaleString('tr-TR')} MB</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Kalan Alan</span>
                                    </div>
                                    <p className="text-sm font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)] tracking-wide">{freeGB} GB</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-3 relative z-10">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-[11px] text-slate-400 font-medium">Toplam Kapasite</span>
                                <span className="text-[11px] text-white font-bold bg-white/5 px-2 py-1 rounded border border-white/10">{limitGB} GB Toplam Alan</span>
                            </div>

                            {/* Live Server Ping & Location */}
                            <div className="flex justify-between items-center w-full bg-black/40 p-2.5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500 overflow-hidden relative flex items-center justify-center border border-white/10">
                                        {/* Simple Turkey flag mock */}
                                        <div className="w-1.5 h-1.5 bg-white rounded-full absolute left-1"></div>
                                        <div className="w-1 h-1 bg-red-500 rounded-full absolute left-1.5"></div>
                                    </div>
                                    <span className="text-[10px] text-white font-bold tracking-wider">TÜRKİYE</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <PingDisplay />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
