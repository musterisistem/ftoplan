'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';

const navLinks = [
    { href: '/ozellikler', label: 'Özellikler' },
    { href: '/neden-biz', label: 'Neden Biz?' },
    { href: '/paketler', label: 'Paketler' },
    { href: '/iletisim', label: 'İletişim' },
];

interface PublicHeaderProps {
    variant?: 'light' | 'transparent';
}

export default function PublicHeader({ variant = 'transparent' }: PublicHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isSolid = scrolled || variant === 'light';

    // Determine the dashboard URL based on role
    const getDashboardUrl = () => {
        if (!session?.user) return '/login';
        if (session.user.role === 'superadmin') return '/superadmin/dashboard';
        if (session.user.role === 'couple') return '/musteri';
        return '/admin/dashboard';
    };

    const isLoggedIn = !!session?.user;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
                ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm pt-0'
                : 'bg-transparent border-transparent pt-6'
                }`}>
                <div className="max-w-7xl mx-auto px-6 xl:px-8 flex items-center justify-between" style={{ height: isSolid ? '80px' : '100px' }}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center group shrink-0">
                        <img
                            src="/logoweey.png"
                            alt="Logo"
                            style={{ height: isSolid ? '60px' : '80px' }}
                            className="w-auto object-contain group-hover:scale-105 transition-transform"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${pathname === link.href
                                    ? 'bg-[#f7eefa] text-[#4a2260]'
                                    : isSolid
                                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {isLoggedIn ? (
                            <Link
                                href={getDashboardUrl()}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#5d2b72] to-[#5d2b72] text-white shadow-lg shadow-[#7a3a94]/25 hover:from-[#4a2260] hover:to-[#4a2260] transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" /> Panele Git
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all ${isSolid
                                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                                        }`}
                                >
                                    Giriş Yap
                                </Link>
                                <Link href="/packages" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#5d2b72] to-[#5d2b72] text-white shadow-lg shadow-[#7a3a94]/25 hover:from-[#4a2260] hover:to-[#4a2260] transition-all">
                                    Ücretsiz Başla <ArrowRight className="w-4 h-4" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Menü"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-6 pt-4 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${pathname === link.href ? 'bg-[#f7eefa] text-[#4a2260]' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 grid grid-cols-2 gap-3">
                            {isLoggedIn ? (
                                <Link
                                    href={getDashboardUrl()}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 col-span-2 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#5d2b72] to-[#5d2b72] text-white text-center flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Panele Git
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="py-3 rounded-xl text-[14px] font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 text-center transition-all">
                                        Giriş Yap
                                    </Link>
                                    <Link href="/packages" onClick={() => setMobileOpen(false)} className="py-3 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#5d2b72] to-[#5d2b72] text-white text-center">
                                        Kayıt Ol
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
