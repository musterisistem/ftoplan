'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function OnboardingTour() {
    const { data: session, update } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Wait for mount and verify session/role before starting
        if (!mounted || !session?.user || session.user.role !== 'admin') return;

        // Ensure we only show if they haven't completed it
        if (session.user.hasCompletedOnboarding === false) {

            // Short delay to let the layout render completely
            const timer = setTimeout(() => {
                const driverObj = driver({
                    showProgress: true,
                    allowClose: false, // Force them to go through it or use the Close button
                    doneBtnText: 'Bitir & Başla',
                    closeBtnText: 'Turu Geç',
                    nextBtnText: 'İleri ➔',
                    prevBtnText: '⬅ Geri',
                    overlayColor: 'rgba(0, 0, 0, 0.75)',
                    steps: [
                        {
                            popover: {
                                title: '<span style="font-size: 20px; font-weight: bold;">Weey.NET\'e Hoş Geldiniz! 🎉</span>',
                                description: '<p style="margin-top: 10px; font-size: 15px; color: #4B5563;">Stüdyo yönetimini ve müşteri seçimlerini kolaylaştıran panelinize hoş geldiniz.<br><br><b>Şimdi size sistemin en önemli kısımlarını kısaca tanıtacağım.</b></p>',
                                align: 'center',
                            }
                        },
                        {
                            element: '#tour-sidebar-customers',
                            popover: {
                                title: '👥 Müşteri Yönetimi',
                                description: 'Tüm müşterilerinizi, oluşturduğunuz randevuları ve seçim galerilerini buradan takip edebilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            element: '#tour-new-customer-btn',
                            popover: {
                                title: '✨ İlk Müşterinizi Ekleyin',
                                description: 'Sistemi kullanmaya başlamak için bu en parlak butona tıklayıp ilk müşterinizi, etkinlik tarihini ve paketini tanımlayın.',
                                side: 'bottom',
                                align: 'center'
                            }
                        },
                        {
                            element: '#tour-sidebar-packages',
                            popover: {
                                title: '📦 Çekim Paketleriniz',
                                description: 'Müşterilerinize sunduğunuz "Dış Çekim", "Düğün Hikayesi" gibi tüm hizmet paketlerinizi ve fiyatlarını buradan yönetebilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            element: '#tour-sidebar-settings',
                            popover: {
                                title: '⚙️ Stüdyo ve Panel Ayarları',
                                description: 'Stüdyo logonuz, sözleşme şablonlarınız, marka renkleriniz ve sitenizin tüm temel görünüm ayarları için bu alanı kullanabilirsiniz.',
                                side: 'right',
                                align: 'start'
                            }
                        },
                        {
                            popover: {
                                title: '<span style="font-size: 18px; font-weight: bold; color: #10B981;">Harika! Artık Hazırsınız. 🚀</span>',
                                description: '<p style="margin-top: 10px; font-size: 14px;">Şimdi sağ üst köşedeki veya sayfanın ortasındaki butonları kullanarak <b>ilk müşterinizi ekleyin</b> ve sistemin tadını çıkarın.</p>',
                                align: 'center',
                                onNextClick: () => {
                                    driverObj.destroy();
                                    completeOnboarding();
                                }
                            }
                        }
                    ],
                    onDestroyStarted: () => {
                        // If they click 'Skip' or 'Close'
                        if (driverObj.hasNextStep() || driverObj.isFirstStep()) {
                            driverObj.destroy();
                            completeOnboarding();
                        } else {
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
        try {
            await fetch('/api/user/onboarding', { method: 'POST' });
            // Update session locally so it doesn't trigger again
            await update({ hasCompletedOnboarding: true });
        } catch (error) {
            console.error('Failed to complete onboarding', error);
        }
    };

    return null; // This component has no UI, it only controls the driver
}
