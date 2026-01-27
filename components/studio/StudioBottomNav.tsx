'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image as ImageIcon, User, Phone, Package, Grid } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

interface StudioBottomNavProps {
    slug: string;
    primaryColor?: string;
    theme?: string;
}

export default function StudioBottomNav({ slug, primaryColor = '#8b4d62', theme = 'warm' }: StudioBottomNavProps) {
    const pathname = usePathname();
    const { customer } = useCustomerAuth();

    const navItems = [
        { label: 'Ana Sayfa', href: `/studio/${slug}`, icon: Home },
        ...(customer
            ? [{ label: 'Panelim', href: `/studio/${slug}/selection`, icon: Grid }]
            : [{ label: 'Hakkımızda', href: `/studio/${slug}/about`, icon: User }]
        ),
        { label: 'Galeri', href: `/studio/${slug}/gallery`, icon: ImageIcon },
        { label: 'Paketler', href: `/studio/${slug}/packages`, icon: Package },
        { label: 'İletişim', href: `/studio/${slug}/contact`, icon: Phone },
    ];

    // Theme Logic
    const isPink = theme === 'light';

    // Container Style
    // Default: Dark Gradient
    // Light: Darker Pink Gradient (Requested update)
    const containerClass = isPink
        ? 'bg-gradient-to-r from-pink-600 to-rose-700 border border-pink-500/30 shadow-[0_8px_32px_rgba(190,24,93,0.4)]'
        : 'bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';

    // Item Styles
    const itemActiveBase = isPink
        ? 'bg-white text-rose-600 shadow-md'
        : 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.3)]';

    const itemInactiveBase = isPink
        ? 'text-pink-100 hover:text-white'
        : 'text-gray-400 hover:text-white';

    const textActive = isPink ? 'text-white' : 'text-white';
    const textInactive = isPink ? 'text-pink-100/70' : 'text-gray-400';

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden flex justify-center pb-safe-area">
            <div
                className={`w-full max-w-sm backdrop-blur-xl rounded-full px-6 py-4 transition-all duration-300 ${containerClass}`}
            >
                <div className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center group"
                            >
                                <div
                                    className={`p-2 rounded-full transition-all duration-300 
                                        ${isActive
                                            ? `${itemActiveBase} -translate-y-2`
                                            : itemInactiveBase
                                        }`}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                                <span className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${isActive ? textActive : textInactive}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
