'use client';

import { useState, useEffect } from 'react';
import { X, User, ArrowRight, Heart, Menu, LogOut, Camera } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface StudioHeaderProps {
    photographer: any;
    primaryColor?: string;
    theme?: 'warm' | 'playful' | 'bold' | 'light';
}

export default function StudioHeader({ photographer, primaryColor = '#8b4d62', theme = 'warm' }: StudioHeaderProps) {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // LOGO SELECTION LOGIC
    // Theme 'warm' = Dark mode essentially (defaults to dark theme appearance) -> needs Light/White logo (siteLogoDark)
    // Theme 'playful'/'light' = Light mode essentially -> needs Dark/Black logo (siteLogoLight)
    // Theme 'bold' = Dark mode -> needs Light/White logo (siteLogoDark)

    // Default fallback: photographer.logo

    let activeLogo = photographer.logo;

    if (theme === 'warm' || theme === 'bold') {
        // Dark Themes -> Prefer siteLogoDark (White Logo)
        if (photographer.siteLogoDark) {
            activeLogo = photographer.siteLogoDark;
        }
    } else if (theme === 'playful' || theme === 'light') {
        // Light Theme -> Prefer siteLogoLight (Black Logo)
        if (photographer.siteLogoLight) {
            activeLogo = photographer.siteLogoLight;
        }
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
            } else {
                const sessionRes = await fetch('/api/auth/session');
                const sessionData = await sessionRes.json();

                if (sessionData?.user?.role === 'couple') {
                    setShowLogin(false);
                    router.push(`/studio/${photographer.slug}/selection`);
                } else {
                    setError('Bu giriş sadece müşteriler içindir.');
                }
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { label: 'Ana Sayfa', href: `/studio/${photographer.slug}` },
        { label: 'Hakkımızda', href: `/studio/${photographer.slug}/about` },
        { label: 'Galeri', href: `/studio/${photographer.slug}/gallery` },
        { label: 'Paketler', href: `/studio/${photographer.slug}/packages` },
        { label: 'İletişim', href: `/studio/${photographer.slug}/contact` },
    ];

    const isCustomer = session?.user?.role === 'couple';

    // Theme-specific styles
    const getThemeStyles = () => {
        switch (theme) {
            case 'playful':
            case 'light':
                return {
                    headerClass: scrolled
                        ? 'bg-white/95 backdrop-blur-xl shadow-sm'
                        : 'bg-[#E8F4FC]/90 backdrop-blur-md',
                    headerStyle: {},
                    textClass: 'text-gray-800',
                    loginClass: 'bg-gray-900 text-white hover:bg-gray-800',
                    loginStyle: {},
                    modalAccent: '#f97316'
                };
            case 'bold':
                return {
                    headerClass: scrolled
                        ? 'bg-white/95 backdrop-blur-xl shadow-sm'
                        : 'backdrop-blur-md',
                    headerStyle: scrolled ? {} : { backgroundColor: `${primaryColor}e6` },
                    textClass: scrolled ? 'text-gray-800' : 'text-white',
                    loginClass: 'bg-white text-gray-900 hover:bg-gray-100',
                    loginStyle: {},
                    modalAccent: primaryColor
                };
            case 'warm':
            default:
                return {
                    headerClass: scrolled
                        ? 'bg-white/95 backdrop-blur-xl shadow-sm'
                        : 'bg-white/80 backdrop-blur-md',
                    headerStyle: {},
                    textClass: 'text-gray-800',
                    loginClass: 'text-white hover:opacity-90',
                    loginStyle: { backgroundColor: primaryColor },
                    modalAccent: primaryColor
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 ${styles.headerClass}`}
                style={styles.headerStyle}
            >
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Left: Menu Button (Mobile) */}
                    <div className="flex items-center min-w-[100px] lg:min-w-0">
                        <button
                            onClick={() => setShowMenu(true)}
                            className={`p-2 transition-colors lg:hidden ${styles.textClass}`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Desktop Nav - Left */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {menuItems.slice(0, 3).map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors ${pathname === item.href
                                        ? styles.textClass
                                        : `${styles.textClass} opacity-70 hover:opacity-100`
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Center: Logo - Visible on all screens, centered on desktop */}
                    <Link href={`/studio/${photographer.slug}`} className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        {activeLogo ? (
                            <img src={activeLogo} alt="" className="h-8 sm:h-10 w-auto" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Camera className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.textClass}`} />
                                <span className={`font-bold text-sm sm:text-lg ${styles.textClass} hidden sm:inline`} style={{ fontFamily: theme === 'warm' ? 'Georgia, serif' : 'inherit' }}>
                                    {photographer.studioName}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Nav - Right */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {menuItems.slice(3).map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? styles.textClass
                                    : `${styles.textClass} opacity-70 hover:opacity-100`
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Login/Panel Button */}
                    <div className="flex items-center gap-2">
                        {isCustomer ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/studio/${photographer.slug}/selection`}
                                    className={`hidden sm:flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all ${styles.loginClass}`}
                                    style={styles.loginStyle}
                                >
                                    Panelim
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: `/studio/${photographer.slug}` })}
                                    className={`p-2 text-gray-400 hover:text-red-500 transition-colors`}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowLogin(true)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${styles.loginClass}`}
                                style={styles.loginStyle}
                            >
                                <User className="w-4 h-4" />
                                <span>Müşteri Girişi</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            {showMenu && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowMenu(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                {/* Logo in menu - use same logic or main logo? Using activeLogo for consistency */}
                                <Link href={`/studio/${photographer.slug}`} onClick={() => setShowMenu(false)} className="flex items-center gap-2">
                                    {activeLogo ? (
                                        <img src={activeLogo} alt="" className="h-10 w-auto" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Camera className="w-6 h-6" style={{ color: primaryColor }} />
                                            <span className="font-bold text-lg text-gray-900">{photographer.studioName}</span>
                                        </div>
                                    )}
                                </Link>
                                <button onClick={() => setShowMenu(false)} className="p-2 text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {isCustomer && (
                                    <Link
                                        href={`/studio/${photographer.slug}/selection`}
                                        onClick={() => setShowMenu(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${pathname === `/studio/${photographer.slug}/selection`
                                            ? 'text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        style={pathname === `/studio/${photographer.slug}/selection` ? { backgroundColor: primaryColor } : {}}
                                    >
                                        Panelim
                                    </Link>
                                )}
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setShowMenu(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${pathname === item.href
                                            ? 'text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        style={pathname === item.href ? { backgroundColor: primaryColor } : {}}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            {!isCustomer && (
                                <button
                                    onClick={() => { setShowMenu(false); setShowLogin(true); }}
                                    className="w-full mt-6 py-4 rounded-xl font-semibold text-white"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Müşteri Girişi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        <div className="h-2 w-full" style={{ backgroundColor: styles.modalAccent }} />
                        <div className="p-8">
                            <button
                                onClick={() => setShowLogin(false)}
                                className="absolute right-8 top-10 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: `${styles.modalAccent}15` }}
                                >
                                    <Heart className="w-8 h-8" style={{ color: styles.modalAccent }} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Müşteri Girişi</h2>
                                <p className="text-sm text-gray-500 mt-2">Özel albümünüze erişin</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-none"
                                    placeholder="Kullanıcı Adı"
                                    required
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-none"
                                    placeholder="Şifre"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ backgroundColor: styles.modalAccent }}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Giriş Yap <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
                @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
            ` }} />
        </>
    );
}
