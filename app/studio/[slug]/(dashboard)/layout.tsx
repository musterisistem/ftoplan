'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, Image, Calendar, LogOut, Heart, User, ChevronLeft } from 'lucide-react';

interface StudioInfo {
    studioName: string;
    primaryColor: string;
    logo: string;
}

export default function StudioDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const slug = params.slug as string;
    const [customerName, setCustomerName] = useState('');
    const [studioInfo, setStudioInfo] = useState<StudioInfo>({
        studioName: '',
        primaryColor: '#ec4899',
        logo: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push(`/studio/${slug}`);
            return;
        }

        if (session.user.role !== 'couple') {
            router.push(`/studio/${slug}`);
            return;
        }

        fetchData();
    }, [session, status]);

    const fetchData = async () => {
        try {
            // Fetch customer data
            if (session?.user?.customerId) {
                const customerRes = await fetch(`/api/customers/${session.user.customerId}`);
                if (customerRes.ok) {
                    const data = await customerRes.json();
                    setCustomerName(`${data.brideName}${data.groomName ? ' & ' + data.groomName : ''}`);
                }
            }

            // Fetch studio info
            const studioRes = await fetch(`/api/studio/${slug}`);
            if (studioRes.ok) {
                const data = await studioRes.json();
                setStudioInfo({
                    studioName: data.studioName || data.name || 'Stüdyo',
                    primaryColor: data.primaryColor || '#ec4899',
                    logo: data.logo || ''
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: studioInfo.primaryColor }}
            >
                <div className="text-center text-white">
                    <Heart className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== 'couple') {
        return null;
    }

    const navigation = [
        { name: 'Özet', href: `/studio/${slug}/dashboard`, icon: LayoutDashboard },
        { name: 'Fotoğraflar', href: `/studio/${slug}/galleries`, icon: Image },
        { name: 'Randevular', href: `/studio/${slug}/schedule`, icon: Calendar },
        { name: 'Profil', href: `/studio/${slug}/profile`, icon: User },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Top Header - Mobile App Style */}
            <header
                className="sticky top-0 z-40 text-white"
                style={{ backgroundColor: studioInfo.primaryColor }}
            >
                <div className="px-4 py-3 flex items-center justify-between">
                    <Link
                        href={`/studio/${slug}`}
                        className="flex items-center gap-2 text-white/80 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm">Geri</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {studioInfo.logo ? (
                            <img src={studioInfo.logo} alt="" className="h-7 w-auto" />
                        ) : (
                            <Heart className="w-6 h-6" />
                        )}
                        <span className="font-semibold text-sm">{studioInfo.studioName}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: `/studio/${slug}` })}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Customer Name Banner */}
                <div className="px-4 pb-4">
                    <p className="text-white/70 text-xs">Hoş geldiniz</p>
                    <h1 className="text-lg font-bold">{customerName}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-6 max-w-4xl mx-auto">
                {children}
            </main>

            {/* Bottom Navigation - Mobile App Style */}
            <nav
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="flex justify-around items-center py-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive(item.href)
                                    ? 'text-pink-600'
                                    : 'text-gray-400'
                                }`}
                        >
                            <item.icon
                                className="w-6 h-6"
                                style={isActive(item.href) ? { color: studioInfo.primaryColor } : {}}
                            />
                            <span
                                className="text-xs font-medium"
                                style={isActive(item.href) ? { color: studioInfo.primaryColor } : {}}
                            >
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Desktop Sidebar Navigation */}
            <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 pt-24">
                <nav className="px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.href)
                                    ? 'text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            style={isActive(item.href) ? { backgroundColor: studioInfo.primaryColor } : {}}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-4 right-4">
                    <button
                        onClick={() => signOut({ callbackUrl: `/studio/${slug}` })}
                        className="flex items-center gap-2 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>
        </div>
    );
}
