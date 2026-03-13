'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AutoCleanupScheduler from '@/components/admin/AutoCleanupScheduler';
import SubscriptionGuard from '@/components/admin/SubscriptionGuard';
import OnboardingTour from '@/components/admin/OnboardingTour';
import EmailVerificationGate from '@/components/admin/EmailVerificationGate';
import PendingTransferGate from '@/components/admin/PendingTransferGate';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We will sync the mobile menu state with the Sidebar in the future if needed, 
    // but Sidebar already handles its own internal mobileMenuOpen state. 
    // For now, we will fire a custom event that Sidebar can listen to, OR just click the existing mobile menu button programmatically.
    const handleMobileMenuClick = () => {
        const btn = document.querySelector('button.md\\:hidden.fixed.top-3') as HTMLButtonElement | null;
        if (btn) btn.click();
    };
    return (
        <SubscriptionGuard>
            <div className="min-h-screen bg-[#F5F6F9] flex flex-col md:flex-row text-[#2F2F3B] selection:bg-[#7A70BA]/20 selection:text-[#7A70BA] w-full overflow-x-hidden">
                <AutoCleanupScheduler />
                <OnboardingTour />
                <Sidebar />
                <div className="flex-1 flex flex-col md:ml-[260px] transition-all duration-300 relative w-full overflow-x-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-80px)] md:h-full p-4 pb-28 md:p-8 md:pb-8">
                        <EmailVerificationGate>
                            <PendingTransferGate>
                                {children}
                            </PendingTransferGate>
                        </EmailVerificationGate>
                    </main>
                    <MobileBottomNav onMenuClick={handleMobileMenuClick} />
                </div>
            </div>
        </SubscriptionGuard>
    );
}
