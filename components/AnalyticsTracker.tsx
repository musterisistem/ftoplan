'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAnalytics } from '@/hooks/useAnalytics';

function AnalyticsTrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const { trackView } = useAnalytics();

    useEffect(() => {
        // Delay slightly to let document.title update
        const timeout = setTimeout(trackView, 1000);

        return () => clearTimeout(timeout);
    }, [pathname, searchParams, session, trackView]);

    return null;
}

export default function AnalyticsTracker() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTrackerContent />
        </Suspense>
    );
}
