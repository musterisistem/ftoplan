'use client';

import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import CustomerLoginModal from './CustomerLoginModal';

interface StudioTopNavProps {
    studioName: string;
    logo?: string;
}

export default function StudioTopNav({ studioName, logo }: StudioTopNavProps) {
    const { status } = useSession(); // Check authentication status
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        // Sign out and redirect to current page (or home)
        signOut({ callbackUrl: window.location.href });
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 md:px-12 py-4 flex items-center justify-between ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
                    }`}
            >
                {/* Logo Area */}
                <div className="flex-shrink-0">
                    {logo ? (
                        <img
                            src={logo}
                            alt={studioName}
                            className={`w-auto object-contain transition-all duration-300 drop-shadow-md ${scrolled ? 'h-6' : 'h-8 md:h-9'}`}
                        />
                    ) : (
                        <h2 className={`font-bold tracking-tighter uppercase transition-none text-white ${scrolled ? 'text-lg' : 'text-xl'}`}>
                            {studioName}
                        </h2>
                    )}
                </div>

                {/* Login/Logout Button */}
                {status === 'authenticated' ? (
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-red-600/10 hover:bg-red-600 text-white hover:text-white border border-red-500/50 rounded-full transition-all duration-300 backdrop-blur-sm"
                    >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold tracking-widest uppercase hidden md:inline">Çıkış Yap</span>
                        <span className="text-xs font-bold tracking-widest uppercase md:hidden">Çıkış</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-white border border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
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
            />
        </>
    );
}
