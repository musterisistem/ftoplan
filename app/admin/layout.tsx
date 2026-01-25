'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-[280px]">
                <Header />
                <main className="flex-1 overflow-y-auto h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
