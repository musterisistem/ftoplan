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
            <div className="min-h-screen bg-[#F5F6F9] flex text-[#2F2F3B] selection:bg-[#7A70BA]/20 selection:text-[#7A70BA]">
                <AutoCleanupScheduler />
                <OnboardingTour />
                <Sidebar />
                <div className="flex-1 flex flex-col md:ml-[260px] transition-all duration-300">
                    <Header />
                    <main className="flex-1 overflow-y-auto h-full p-6 md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SubscriptionGuard>
    );
}
