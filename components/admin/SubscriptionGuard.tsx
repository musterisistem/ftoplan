'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import CreativeLoader from '@/components/ui/CreativeLoader';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeen = sessionStorage.getItem('hasSeenAdminLoader');
            if (!hasSeen) {
                setShowLoader(true);
                sessionStorage.setItem('hasSeenAdminLoader', 'true');
            }
        }
    }, []);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }

        if (session?.user) {
            // Superadmins should be in their own panel
            if (session.user.role === 'superadmin') {
                router.replace('/superadmin/dashboard');
                return;
            }

            // Customers bypass this check
            if (session.user.role === 'couple') {
                setIsChecking(false);
                return;
            }

            // Photographers need active subscription
            if (session.user.role === 'admin') {
                const expiryStr = session.user.subscriptionExpiry;
                const expiry = expiryStr ? new Date(expiryStr) : new Date(0);
                const now = new Date();

                if (expiry <= now) {
                    // Redirect to packages if expired
                    if (!pathname.startsWith('/packages')) {
                        router.replace('/packages?expired=true');
                        return;
                    }
                }
            }
        }

        setIsChecking(false);
    }, [session, status, router, pathname]);

    if (isChecking) {
        if (showLoader) {
            return (
                <CreativeLoader
                    message="Hesabınız Doğrulanıyor"
                    subMessage="Üyelik durumu ve yetkiler kontrol ediliyor..."
                />
            );
        }
        return <div className="min-h-screen bg-[#F5F6F9]" />;
    }

    return <>{children}</>;
}
