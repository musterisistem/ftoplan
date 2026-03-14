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

                    <div className="p-8 text-center pt-10">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-rose-100">
                            <Mail className="w-8 h-8" />
                        </div>

                        <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">E-Posta Doğrulaması</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Lütfen <span className="text-slate-800 font-bold">{userEmail}</span> adresinize gönderilen doğrulama linkine tıklayın.
                        </p>

                        {status === 'success' ? (
                            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl flex items-center gap-2.5 mb-6 border border-emerald-100 font-semibold text-xs text-left">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <p>Doğrulama maili tekrar gönderildi. Lütfen kutunuzu kontrol edin.</p>
                            </div>
                        ) : status === 'error' ? (
                            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl flex items-center gap-2.5 mb-6 border border-rose-100 font-semibold text-xs text-left">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.</p>
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleResend}
                                disabled={isLoading || status === 'success'}
                                className="w-full py-3 bg-[#ff4081] hover:bg-[#ff4081]/90 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Başarıyla Gönderildi
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4" />
                                        Tekrar Gönder
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 text-slate-400 hover:text-slate-600 font-bold rounded-xl transition-colors text-sm"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
