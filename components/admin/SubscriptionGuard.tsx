'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }

        if (session?.user) {
            // Superadmins and customers bypass this check
            if (session.user.role === 'superadmin' || session.user.role === 'couple') {
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
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F3F6FD]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Üyelik kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
