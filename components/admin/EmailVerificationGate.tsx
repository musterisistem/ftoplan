'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw, Loader2, ShieldCheck, Sparkles, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailVerificationGate({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Poll for verification every 5 seconds while gate is shown
    useEffect(() => {
        if (!session?.user || session.user.isActive !== false || verified) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                if (data?.user?.isActive === true) {
                    clearInterval(interval);
                    await update();
                    setShowSuccess(true);
                    // After 2.5 seconds success screen, dismiss
                    setTimeout(() => {
                        setVerified(true);
                        setShowSuccess(false);
                    }, 2500);
                }
            } catch { /* ignore */ }
        }, 5000);

        return () => clearInterval(interval);
    }, [session, update, verified]);

    const resendVerification = async () => {
        setSending(true);
        setError(null);
        try {
            await fetch('/api/auth/resend-verification', { method: 'POST' });
            setSent(true);
            setTimeout(() => setSent(false), 5000);
        } finally {
            setSending(false);
        }
    };

    const checkVerification = async () => {
        setChecking(true);
        setError(null);
        try {
            // Add a small delay for the loading effect
            await new Promise(resolve => setTimeout(resolve, 800));

            const res = await fetch('/api/auth/session');
            const data = await res.json();

            if (data?.user?.isActive === true) {
                await update();
                setShowSuccess(true);
                setTimeout(() => {
                    setVerified(true);
                    setShowSuccess(false);
                }, 2500);
            } else {
                setError('İncelememize göre mail adresiniz henüz doğrulanmamış. Lütfen mail kutunuzu kontrol edip hesabınızı doğrulayın.');
            }
        } catch (err) {
            setError('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setChecking(false);
        }
    };

    // Show gate if user is authenticated but not active (not verified) and not yet verified locally
    const showGate = status === 'authenticated' && session?.user?.isActive === false && !verified && !showSuccess;

    return (
        <>
            {/* Children — hidden behind overlay when gate is visible */}
            <div className={showGate || showSuccess ? 'pointer-events-none select-none opacity-0 blur-xl transition-all duration-700' : 'transition-all duration-500 opacity-100'}>
                {children}
            </div>

            {/* ── Email Verification Gate ── */}
            <AnimatePresence>
                {showGate && (
                    <motion.div
                        key="gate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
                        >
                            {/* Simple Top Accent */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5d2b72] to-[#7a3a94]" />

                            <div className="mb-6">
                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-[#5d2b72]" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">E-Posta Doğrulama</h2>
                                <p className="text-slate-500 text-sm">
                                    Panelinizi kullanmaya başlamak için lütfen e-postanızı doğrulayın.
                                </p>
                            </div>

                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-medium text-xs mb-8 inline-block">
                                {session?.user?.email}
                            </div>

                            {/* Status Messages */}
                            <AnimatePresence mode="wait">
                                {sent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-emerald-600 text-xs font-bold mb-4 flex items-center justify-center gap-1.5"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Doğrulama maili tekrar gönderildi.
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-rose-500 text-xs font-bold mb-4 leading-relaxed px-4"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-3">
                                <button
                                    onClick={checkVerification}
                                    disabled={checking}
                                    className="w-full py-4 bg-[#5d2b72] hover:bg-[#4a2260] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Doğruladım, Devam Et'}
                                </button>

                                <button
                                    onClick={resendVerification}
                                    disabled={sending || sent}
                                    className="w-full py-3 bg-white border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><RefreshCw className="w-3.5 h-3.5" /> Tekrar Gönder</>}
                                </button>
                            </div>

                            <p className="mt-8 text-[10px] text-slate-300 font-medium italic">FOTOPLAN Digital Solutions</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Success Screen (Full Dark Overlay) ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1a0b2e]"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-emerald-500/30 rounded-full"
                                />
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                                    className="absolute inset-[10%] bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                                >
                                    <CheckCircle className="w-16 h-16 text-white" />
                                </motion.div>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold text-white mb-4"
                            >
                                Hoş Geldiniz!
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-emerald-400 font-bold text-lg"
                            >
                                Hesabınız başarıyla doğrulandı.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
