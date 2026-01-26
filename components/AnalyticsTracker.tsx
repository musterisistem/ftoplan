'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const initialized = useRef(false);

    useEffect(() => {
        // Debounce or ensure we don't track double renders in dev
        // In strict mode, useEffect runs twice.

        const trackView = async () => {
            try {
                // Extract slug from path if it's a studio site
                // Path format: /studio/[slug]/...
                const pathParts = pathname.split('/');
                let targetUserSlug = null;

                if (pathParts[1] === 'studio' && pathParts[2]) {
                    targetUserSlug = pathParts[2];
                }

                // Prepare Data
                const role = session?.user?.role || 'guest';

                // Simple visitor ID (stored in localStorage)
                let visitorId = localStorage.getItem('fp_visitor_id');
                if (!visitorId) {
                    visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                    localStorage.setItem('fp_visitor_id', visitorId);
                }

                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
                        title: document.title,
                        role,
                        visitorId,
                        targetUserSlug
                    })
                });
            } catch (error) {
                // Silent fail
            }
        };

        // Delay slightly to let document.title update
        const timeout = setTimeout(trackView, 1000);

        return () => clearTimeout(timeout);
    }, [pathname, searchParams, session]);

    return null;
}
