'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AutoCleanupScheduler from '@/components/admin/AutoCleanupScheduler';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F3F6FD] flex font-sans text-gray-800">
            <AutoCleanupScheduler />
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-[260px] transition-all duration-300">
                <Header />
                <main className="flex-1 overflow-y-auto h-full p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
