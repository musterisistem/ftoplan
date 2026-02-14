'use client';

import { useEffect } from 'react';

export default function AutoCleanupScheduler() {
    useEffect(() => {
        const runCleanup = async () => {
            try {
                // Check if we already ran today
                const lastRun = localStorage.getItem('weeyNet_lastCleanup');
                const today = new Date().toDateString();

                if (lastRun !== today) {
                    console.log('Running daily auto-cleanup check...');

                    // Call the API
                    // We don't await result to avoid blocking or errors affecting UI
                    fetch('/api/cron/cleanup')
                        .then(res => res.json())
                        .then(data => {
                            console.log('Auto-cleanup result:', data);
                            // Only update flag if successful or at least attempted without network error
                            localStorage.setItem('weeyNet_lastCleanup', today);
                        })
                        .catch(err => console.error('Auto-cleanup failed:', err));
                }
            } catch (error) {
                console.error('Scheduler error:', error);
            }
        };

        // Delay execution by 10 seconds to allow app to load first
        const timer = setTimeout(runCleanup, 10000);

        return () => clearTimeout(timer);
    }, []);

    return null; // Invisible component
}
