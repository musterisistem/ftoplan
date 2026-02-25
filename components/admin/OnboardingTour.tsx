'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function OnboardingTour() {
    const { data: session, update } = useSession();
    const [mounted, setMounted] = useState(false);
    const tourStarted = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Wait for mount and verify session/role before starting
        if (!mounted || !session?.user || session.user.role !== 'admin') return;

        // Extra client-side guard: check localStorage just in case NextAuth session hasn't synced yet
        const isCompletedLocally = localStorage.getItem(`onboarding_completed_${session.user.id}`) === 'true';

        // Ensure we only show if they haven't completed it anywhere and it hasn't started yet in this React lifecycle
        if (session.user.hasCompletedOnboarding === false && !isCompletedLocally && !tourStarted.current) {
            tourStarted.current = true; // Lock it instantly

            // Short delay to let the layout render completely
            const timer = setTimeout(() => {
                const driverObj = driver({
                    showProgress: true,
                    allowClose: false, // Force them to go through it or use the Close button
                    doneBtnText: 'Bitir & Başla',
                    nextBtnText: 'İleri ➔',
                    prevBtnText: '⬅ Geri',
                    overlayColor: 'rgba(15, 23, 42, 0.85)', // Darker, more premium overlay
                    popoverClass: 'driverjs-theme-premium', // Custom class for external CSS if needed
                    steps: [
                        {
                            popover: {
                                title: '<span style="font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.025em;">Weey.NET\'e Hoş Geldiniz</span>',
                                description: '<p style="margin-top: 12px; font-size: 15px; color: #64748b; line-height: 1.6;">Stüdyo yönetimini ve müşteri seçimlerini kolaylaştıran panelinize hoş geldiniz.<br><br><span style="color: #3b82f6; font-weight: 500;">Sistemi en verimli şekilde kullanabilmeniz için kısa bir tanıtım turu hazırladık.</span></p>',
                                align: 'center',
                            }
                        },
                        {
                            element: '#tour-sidebar-customers',
                            popover: {
                                title: '<span style="font-weight: 700; color: #334155;">Müşteri Yönetimi</span>',
                                description: 'Tüm müşterilerinizi, randevularınızı ve fotoğraf seçim galerilerini bu ekrandan detaylı olarak takip edebilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            element: '#tour-new-customer-btn',
                            popover: {
                                title: '<span style="font-weight: 700; color: #334155;">İlk Müşterinizi Ekleyin</span>',
                                description: 'Sistemi aktif kullanmaya başlamak için bu butona tıklayarak ilk müşterinizi, etkinlik tarihini ve paket detaylarını tanımlayabilirsiniz.',
                                side: 'bottom',
                                align: 'center'
                            }
                        },
                        {
                            element: '#tour-sidebar-packages',
                            popover: {
                                title: '<span style="font-weight: 700; color: #334155;">Çekim Paketleriniz</span>',
                                description: 'Müşterilerinize sunduğunuz fotoğraf çekim paketlerini, albüm detaylarını ve fiyatlandırmaları bu bölümden yönetebilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            element: '#tour-sidebar-settings',
                            popover: {
                                title: '<span style="font-weight: 700; color: #334155;">Stüdyo ve Sistem Ayarları</span>',
                                description: 'Logonuz, online sözleşme şablonlarınız, marka renkleriniz ve sitenizin temel görünüm ayarlarına buradan erişebilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            popover: {
                                title: '<span style="font-size: 20px; font-weight: 800; color: #10b981;">Tebrikler, Artık Hazırsınız</span>',
                                description: '<p style="margin-top: 12px; font-size: 15px; color: #64748b; line-height: 1.6;">Artık sağ üst köşedeki düğmeleri kullanarak <b>ilk kaydınızı oluşturabilir</b> ve stüdyonuzu dijitalde yönetmeye başlayabilirsiniz.</p>',
                                align: 'center',
                                onNextClick: () => {
                                    driverObj.destroy();
                                    completeOnboarding();
                                }
                            }
                        }
                    ],
                    onDestroyStarted: () => {
                        if (!driverObj.hasNextStep() || confirm("Turu atlamak istediğinize emin misiniz?")) {
                            driverObj.destroy();
                            completeOnboarding();
                        }
                    }
                });

                driverObj.drive();
            }, 1000); // 1s start delay

            return () => clearTimeout(timer);
        }
    }, [mounted, session]);

    const completeOnboarding = async () => {
        if (!session?.user?.id) return;

        // Ensure browser remembers this permanently even before API catches up
        localStorage.setItem(`onboarding_completed_${session.user.id}`, 'true');

        try {
            await fetch('/api/user/onboarding', { method: 'POST' });
            // Update session locally so it refetches DB and doesn't trigger again
            await update();
        } catch (error) {
            console.error('Failed to complete onboarding', error);
        }
    };

    return null; // This component has no UI, it only controls the driver
}
