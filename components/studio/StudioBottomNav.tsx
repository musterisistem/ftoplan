'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image as ImageIcon, User, Phone, Package, Grid } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface StudioBottomNavProps {
    slug: string;
    primaryColor?: string;
    theme?: string;
}

export default function StudioBottomNav({ slug, primaryColor = '#8b4d62', theme = 'warm' }: StudioBottomNavProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isCustomer = session?.user?.role === 'couple';

    const navItems = [
        { label: 'Ana Sayfa', href: `/studio/${slug}`, icon: Home },
        ...(isCustomer
            ? [{ label: 'Panelim', href: `/studio/${slug}/selection`, icon: Grid }]
            : [{ label: 'Hakkımızda', href: `/studio/${slug}/about`, icon: User }]
        ),
        { label: 'Galeri', href: `/studio/${slug}/gallery`, icon: ImageIcon },
        { label: 'Paketler', href: `/studio/${slug}/packages`, icon: Package },
        { label: 'İletişim', href: `/studio/${slug}/contact`, icon: Phone },
    ];

    // Theme-specific styles
    const getThemeStyles = () => {
        switch (theme) {
            case 'playful':
                return {
                    bg: 'bg-white/95',
                    border: 'border-gray-100',
                };
            case 'bold':
                return {
                    bg: 'bg-white/95',
                    border: 'border-gray-100',
                };
            case 'warm':
            default:
                return {
                    bg: 'bg-white/95',
                    border: 'border-gray-100',
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden flex justify-center pb-safe-area">
            <div
                className="w-full max-w-sm bg-gradient-to-r from-[#111] to-[#1a1a1a] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-6 py-4"
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
                                    className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white text-black -translate-y-2 shadow-[0_4px_12px_rgba(255,255,255,0.3)]' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
