'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AutoCleanupScheduler from '@/components/admin/AutoCleanupScheduler';
import SubscriptionGuard from '@/components/admin/SubscriptionGuard';
import OnboardingTour from '@/components/admin/OnboardingTour';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SubscriptionGuard>
            <div className="min-h-screen bg-[#F3F6FD] flex text-gray-800">
                <AutoCleanupScheduler />
                <OnboardingTour />
                <Sidebar />
                <div className="flex-1 flex flex-col md:ml-[260px] transition-all duration-300">
                    <Header />
                    <main className="flex-1 overflow-y-auto h-full p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SubscriptionGuard>
    );
}
