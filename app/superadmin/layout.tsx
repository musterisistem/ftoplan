'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    Presentation
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const menuItems = [
    { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
    { name: 'Fotoğrafçılar', href: '/superadmin/photographers', icon: Users },
    { name: 'Dashboard Slaytları', href: '/superadmin/dashboard-slides', icon: Presentation },
    { name: 'Toplu Email', href: '/superadmin/communications/email', icon: Mail },
    { name: 'Toplu SMS', href: '/superadmin/communications/sms', icon: MessageSquare },
    { name: 'Paketler', href: '/superadmin/packages', icon: Package },
    { name: 'Sistem Mailleri', href: '/superadmin/settings/mail-templates', icon: Mail },
    { name: 'Ayarlar', href: '/superadmin/settings', icon: Settings },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        if (session.user.role !== 'superadmin') {
            router.push('/admin/dashboard');
            return;
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!session || session.user.role !== 'superadmin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 rounded-lg text-white"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-purple-500/20 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <Crown className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Weey.NET</h1>
                            <p className="text-xs text-purple-300">Süper Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-purple-500/20 hover:text-white transition-all group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-purple-400" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">SY</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">{session.user.name || 'Sistem Yöneticisi'}</p>
                            <p className="text-xs text-gray-400">{session.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
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
