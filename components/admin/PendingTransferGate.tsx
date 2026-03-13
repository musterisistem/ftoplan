'use client';
import { useSession } from 'next-auth/react';
import { Clock, AlertCircle } from 'lucide-react';

// Wraps admin children and shows a locked overlay if the user has a pending bank transfer
export default function PendingTransferGate({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === 'loading') return <>{children}</>;

    const paymentStatus = (session?.user as any)?.paymentStatus;

    if (paymentStatus === 'pending_transfer') {
        return (
            <div className="relative min-h-screen">
                {/* Blurred panel content behind the overlay */}
                <div className="pointer-events-none select-none blur-[3px] opacity-30">
                    {children}
                </div>

                {/* Lock Overlay */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Ödeme Onayı Bekleniyor
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Havale ile ödeme seçeneğini seçtiğiniz için panelinizin aktivasyonu
                            yetkili tarafından onaylanmasını beklemektedir.
                        </p>
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left mb-6">
                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                Havale tutarını sipariş numaranızı belirterek gönderdiyseniz, ödemeniz
                                en geç <strong>1 iş günü</strong> içinde onaylanarak paneliniz aktif edilecektir.
                                Onay sonrası bu ekran otomatik olarak kaldırılacaktır.
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            Sorun yaşarsanız destek ekibimizle iletişime geçin.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
