import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useAnalytics = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const trackView = useCallback(async () => {
        try {
            // Extract slug from path if it's a studio site
            const pathParts = pathname.split('/');
            let targetUserSlug = null;

            if (pathParts[1] === 'studio' && pathParts[2]) {
                targetUserSlug = pathParts[2];
            }

            const role = session?.user?.role || 'guest';

            let visitorId = typeof window !== 'undefined' ? localStorage.getItem('fp_visitor_id') : null;
            if (!visitorId && typeof window !== 'undefined') {
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
            console.error('Analytics error:', error);
        }
    }, [pathname, searchParams, session]);

    return { trackView };
};
