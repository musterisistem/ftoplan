'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface VerifyEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export default function VerifyEmailModal({ isOpen, onClose, userEmail }: VerifyEmailModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleResend = async () => {
        setIsLoading(true);
        setStatus('idle');
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                toast.success('Doğrulama e-postası başarıyla gönderildi.');
            } else {
                setStatus('error');
                toast.error(data.error || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatus('error');
            toast.error('Bağlantı hatası.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 text-center pt-12">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-rose-50 border border-rose-100">
                            <Mail className="w-10 h-10" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">E-Posta Doğrulaması</h2>
                        <p className="text-slate-500 text-[15px] leading-relaxed mb-6 font-medium">
                            Hesabınızın güvenliği ve yönetim panelini kesintisiz kullanabilmeniz için <span className="text-slate-800 font-bold">{userEmail}</span> adresini doğrulamanız gerekmektedir.
                        </p>

                        {status === 'success' ? (
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 mb-6 border border-emerald-100 font-medium text-sm text-left">
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <p>Doğrulama bağlantısı e-posta adresinize gönderildi. Lütfen gelen (veya spam) kutunuzu kontrol edin.</p>
                            </div>
                        ) : status === 'error' ? (
                            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-3 mb-6 border border-rose-100 font-medium text-sm text-left">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>Mail gönderilirken bir hata oluştu. Lütfen biraz sonra tekrar deneyin.</p>
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleResend}
                                disabled={isLoading || status === 'success'}
                                className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(225,29,72,0.25)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Gönderildi
                                    </>
                                ) : (
                                    <>
                                        Doğrulama Mailini Gönder
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-slate-500 hover:text-slate-800 font-bold rounded-xl transition-colors text-[15px]"
                            >
                                Daha Sonra Hatırlat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
