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
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div
                className={`${styles.bg} backdrop-blur-xl border-t ${styles.border} shadow-[0_-4px_20px_rgba(0,0,0,0.08)]`}
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
            >
                <div className="flex justify-around items-center px-2 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center w-16 py-2 group transition-all duration-300"
                            >
                                {isActive && (
                                    <div
                                        className="absolute -top-2 w-10 h-1 rounded-full transition-all duration-300"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                )}

                                <div
                                    className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                                    style={isActive ? { backgroundColor: `${primaryColor}15` } : {}}
                                >
                                    <Icon
                                        className="w-5 h-5 transition-colors duration-300"
                                        style={{ color: isActive ? primaryColor : '#9ca3af' }}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>

                                <span
                                    className="text-[10px] font-medium mt-1 transition-colors duration-300"
                                    style={{ color: isActive ? primaryColor : '#9ca3af' }}
                                >
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
