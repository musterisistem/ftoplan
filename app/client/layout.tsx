'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClientSidebar from '@/components/client/ClientSidebar';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        // Allow access to login page without authentication
        if (pathname === '/client/login') {
            return;
        }

        if (status === 'loading') return;

        if (!session) {
            router.push('/client/login');
            return;
        }

        // Only allow customers (couple) role
        if (session.user.role !== 'couple') {
            router.push('/login');
            return;
        }

        // Fetch customer name
        if (session.user.customerId) {
            fetchCustomerName();
        }
    }, [session, status, router, pathname]);

    const fetchCustomerName = async () => {
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}`);
            if (res.ok) {
                const data = await res.json();
                setCustomerName(`${data.brideName}${data.groomName ? ' & ' + data.groomName : ''}`);
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    };

    // Show login page without layout
    if (pathname === '/client/login') {
        return <>{children}</>;
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!session || session.user.role !== 'couple') {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <ClientSidebar customerName={customerName} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Client Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-end px-8 z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Hoş geldiniz,</span>
                        <span className="font-semibold text-gray-900">{customerName || 'Müşteri'}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-sm font-bold">
                            {customerName ? customerName.charAt(0).toUpperCase() : 'M'}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
