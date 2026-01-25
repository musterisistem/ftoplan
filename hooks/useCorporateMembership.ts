'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CorporateMembershipStatus {
    isCorporateMember: boolean;
    corporateMembershipExpiry: Date | null;
    isExpired: boolean;
    loading: boolean;
    error: string | null;
}

export function useCorporateMembership(): CorporateMembershipStatus {
    const { data: session, status } = useSession();
    const [status2, setStatus] = useState<CorporateMembershipStatus>({
        isCorporateMember: false,
        corporateMembershipExpiry: null,
        isExpired: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        async function checkMembership() {
            // Wait for session to load
            if (status === 'loading') {
                return;
            }

            // If no session, not a corporate member
            if (!session) {
                setStatus({
                    isCorporateMember: false,
                    corporateMembershipExpiry: null,
                    isExpired: false,
                    loading: false,
                    error: null,
                });
                return;
            }

            try {
                const response = await fetch('/api/corporate-membership');

                if (!response.ok) {
                    // If API fails, assume not corporate member (fail-safe)
                    console.error('Corporate membership API failed:', await response.text());
                    setStatus({
                        isCorporateMember: false,
                        corporateMembershipExpiry: null,
                        isExpired: false,
                        loading: false,
                        error: 'API error',
                    });
                    return;
                }

                const data = await response.json();

                let isExpired = false;
                if (data.corporateMembershipExpiry) {
                    const expiryDate = new Date(data.corporateMembershipExpiry);
                    isExpired = expiryDate < new Date();
                }

                setStatus({
                    isCorporateMember: data.isCorporateMember && !isExpired,
                    corporateMembershipExpiry: data.corporateMembershipExpiry,
                    isExpired,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error('Error checking corporate membership:', error);
                setStatus({
                    isCorporateMember: false,
                    corporateMembershipExpiry: null,
                    isExpired: false,
                    loading: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        checkMembership();
    }, [session, status]);

    return status2;
}
