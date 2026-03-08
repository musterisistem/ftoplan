'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import CustomerLoginModal from './CustomerLoginModal';

interface StudioTopNavProps {
    studioName: string;
    logo?: string;
    theme?: string;
    slug: string;
}

export default function StudioTopNav({ studioName, logo, theme = 'warm', slug }: StudioTopNavProps) {
    const { customer, isLoading, logout, verifySession } = useCustomerAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: 'Ana Sayfa', href: `/studio/${slug}` },
        ...(customer
            ? [{ label: 'Panelim', href: `/studio/${slug}/selection` }]
            : [{ label: 'Hakkımızda', href: `/studio/${slug}/about` }]
        ),
        { label: 'Galeri', href: `/studio/${slug}/gallery` },
        { label: 'Paketler', href: `/studio/${slug}/packages` },
        { label: 'İletişim', href: `/studio/${slug}/contact` },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Auto-verify session on mount if we are on a protected page or generally to sync UI
        // We only do this once to avoid infinite loops, but it ensures the TopNav knows the state
        // even after a full page hard-reload (window.location.href)
        if (!customer) {
            verifySession();
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const isLightTheme = theme === 'playful' || theme === 'bold' || theme === 'light';
    const isPinkTheme = theme === 'light';

    const headerBgClass = isPinkTheme
        ? 'bg-[#1a1a1a]/90 backdrop-blur-md shadow-lg border-b border-white/5'
        : (scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent py-6');

    const textColorClass = isPinkTheme ? 'text-white' : 'text-white';

    const headerPy = (isPinkTheme || scrolled) ? 'py-3' : 'py-6';

    const buttonBaseClass = "group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 backdrop-blur-sm";

    const loginBtnClass = isPinkTheme
        ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20 border-none hover:shadow-pink-500/40"
        : (scrolled
            ? "bg-white/10 hover:bg-white text-white hover:text-black border border-white/20"
            : (isLightTheme && !scrolled
                ? "bg-black/5 hover:bg-black text-black hover:text-white border border-black/10"
                : "bg-white/10 hover:bg-white text-white hover:text-black border border-white/20"));

    const logoutBtnClass = "bg-red-600/10 hover:bg-red-600 text-white hover:text-white border border-red-500/50";

    const logoHeightClass = (scrolled || isPinkTheme) ? 'h-6' : 'h-8 md:h-9';

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 md:px-12 flex items-center justify-between ${headerBgClass} ${headerPy}`}
            >
                <div className="flex-shrink-0">
                    {logo ? (
                        <img
                            src={logo}
                            alt={studioName}
                            className={`w-auto object-contain transition-all duration-300 drop-shadow-md ${logoHeightClass}`}
                        />
                    ) : (
                        <h2 className={`font-bold tracking-tighter uppercase transition-none ${textColorClass} ${scrolled ? 'text-lg' : 'text-xl'}`}>
                            {studioName}
                        </h2>
                    )}
                </div>

                {/* Desktop Menu - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group
                                    ${isActive ? textColorClass : (isPinkTheme ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white')}
                                `}
                            >
                                {item.label}
                                {/* Active indicator */}
                                <span className={`absolute -bottom-2 left-0 h-[2px] transition-all duration-300
                                    ${isActive ? 'w-full bg-current opacity-100' : 'w-0 bg-current group-hover:w-full opacity-50'}
                                `} />
                            </Link>
                        );
                    })}
                </div>

                {customer ? (
                    <button
                        onClick={handleLogout}
                        className={`${buttonBaseClass} ${logoutBtnClass}`}
                    >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Çıkış Yap</span>
                        <span className="text-xs font-bold tracking-widest uppercase md:hidden">Çıkış</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className={`${buttonBaseClass} ${loginBtnClass}`}
                    >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Giriş Yap</span>
                        <span className="text-xs font-bold tracking-widest uppercase md:hidden">Giriş</span>
                    </button>
                )}
            </nav>

            <CustomerLoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                logo={logo}
                studioName={studioName}
                slug={slug}
                theme={theme}
            />
        </>
    );
}
