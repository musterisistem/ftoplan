'use client';

import { SessionProvider } from 'next-auth/react';
import { AlertProvider } from '@/context/AlertContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            refetchOnWindowFocus={false}
            refetchInterval={0}
            refetchWhenOffline={false}
        >
            <AlertProvider>
                {children}
            </AlertProvider>
        </SessionProvider>
    );
}
