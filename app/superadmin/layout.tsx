'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Package,
    Settings,
    LogOut,
    Menu,
    X,
    Crown,
    Server,
    TrendingUp,
    Mail,
    MessageSquare,
    Presentation,
    Globe,
    Star,
    Ticket,
    Banknote,
    Building2
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const menuGroups = [
    {
        title: 'Genel Bakış',
        icon: LayoutDashboard,
        items: [
            { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Üye Yönetimi',
        icon: Users,
        items: [
            { name: 'Fotoğrafçılar', href: '/superadmin/photographers', icon: Users },
            { name: 'Müşteri Havuzu', href: '/superadmin/customers', icon: Users },
        ]
    },
    {
        title: 'Satış & Finans',
        icon: Banknote,
        items: [
            { name: 'Ödemeler', href: '/superadmin/payments', icon: Banknote },
            { name: 'Paket Yönetimi', href: '/superadmin/packages', icon: Package },
            { name: 'Banka Hesapları', href: '/superadmin/settings/bank-accounts', icon: Building2 },
            { name: 'Kupon Yönetimi', href: '/superadmin/coupons', icon: Ticket },
        ]
    },
    {
        title: 'İçerik Editörü',
        icon: Presentation,
        items: [
            { name: 'Dashboard Slaytları', href: '/superadmin/dashboard-slides', icon: Presentation },
            { name: 'Referanslar', href: '/superadmin/references', icon: Star },
        ]
    },
    {
        title: 'Pazarlama & İletişim',
        icon: Mail,
        items: [
            { name: 'Mail Editörü', href: '/superadmin/mail-editor', icon: Mail },
            { name: 'Toplu Email', href: '/superadmin/communications/email', icon: Mail },
            { name: 'Toplu SMS', href: '/superadmin/communications/sms', icon: MessageSquare },
        ]
    },
    {
        title: 'Sistem Ayarları',
        icon: Settings,
        items: [
            { name: 'Site Ayarları', href: '/superadmin/settings', icon: Settings },
            { name: 'İletişim Yönetimi', href: '/superadmin/settings/contact', icon: Globe },
        ]
    }
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    const isLoginPage = pathname === '/superadmin/login';

    // Auto-expand group containing active link
    useEffect(() => {
        const activeGroup = menuGroups.find(group => 
            group.items.some(item => pathname.startsWith(item.href))
        );
        if (activeGroup && !expandedGroups.includes(activeGroup.title)) {
            setExpandedGroups(prev => [...prev, activeGroup.title]);
        }
    }, [pathname]);

    useEffect(() => {
        if (status === 'loading' || isLoginPage) return;

        if (!session) {
            router.push('/login');
            return;
        }

        if (session.user.role !== 'superadmin') {
            router.push('/admin/dashboard');
            return;
        }
    }, [session, status, router, isLoginPage]);

    const toggleGroup = (title: string) => {
        setExpandedGroups(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title) 
                : [...prev, title]
        );
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (isLoginPage) return <>{children}</>;

    if (!session || session.user.role !== 'superadmin') return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 rounded-lg text-white shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-950/90 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">Weey.NET</h1>
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Süper Panel</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation - Scrollable Area */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] superadmin-scrollbar">
                    {menuGroups.map((group) => {
                        const isExpanded = expandedGroups.includes(group.title);
                        const hasActiveItem = group.items.some(item => pathname === item.href);

                        return (
                            <div key={group.title} className="space-y-1">
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${isExpanded ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <group.icon className={`w-4 h-4 ${hasActiveItem || isExpanded ? 'text-purple-400' : ''}`} />
                                        <span className="text-sm font-medium">{group.title}</span>
                                    </div>
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>

                                {isExpanded && (
                                    <div className="pl-9 space-y-1 mt-1">
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`block px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-purple-600 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* User Info & Sign Out - Fixed Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-950/50 backdrop-blur-md border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/5">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                            {session.user.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{session.user.name || 'Sistem Admini'}</p>
                            <p className="text-[10px] text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>GÜVENLİ ÇIKIŞ</span>
                    </button>
                </div>
            </aside>


            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
