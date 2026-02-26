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
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#080c18]/90 backdrop-blur-md"
                    >
                        {/* Background Light Elements - Brand Colors */}
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5d2b72]/10 blur-[120px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7a3a94]/10 blur-[120px] rounded-full pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            className="relative bg-white/95 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] max-w-lg w-full text-center border border-white/20"
                        >
                            {/* Brand Accent Bar */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#5d2b72] via-[#7a3a94] to-[#5d2b72] rounded-b-full shadow-[0_4px_12px_rgba(93,43,114,0.2)]" />

                            {/* Header Icon Section */}
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-gradient-to-tr from-[#f7eefa] to-white border border-[#f7eefa] rounded-3xl flex items-center justify-center mx-auto shadow-sm relative z-10"
                                >
                                    <Mail className="w-12 h-12 text-[#5d2b72]" />
                                </motion.div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#5d2b72]/5 blur-2xl rounded-full" />
                            </div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl font-bold text-[#1a0b2e] mb-3 tracking-tight"
                            >
                                E-Postanızı Doğrulayın
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-slate-500 text-lg mb-4 font-medium"
                            >
                                Panelinizin kilidini açmak için tek bir adım kaldı.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f7eefa]/30 border border-[#f7eefa] rounded-full text-[#5d2b72] font-bold text-sm mb-10 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#7a3a94] animate-pulse" />
                                {session?.user?.email}
                            </motion.div>

                            {/* Info Steps */}
                            <div className="grid grid-cols-1 gap-4 text-left mb-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-5 p-5 bg-[#f7eefa]/20 hover:bg-[#f7eefa]/40 transition-colors border border-[#f7eefa]/50 rounded-3xl group"
                                >
                                    <div className="w-12 h-12 shrink-0 bg-white border border-[#f7eefa] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <ExternalLink className="w-5 h-5 text-[#5d2b72]" />
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-bold text-[#1a0b2e] mb-0.5">Mailinizi Kontrol Edin</p>
                                        <p className="text-slate-500 text-[13px] leading-relaxed">Gelen kutusunda veya spam klasöründe doğrulama linkini bulun.</p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Notifications & Error messages */}
                            <AnimatePresence mode="wait">
                                {sent && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-[24px] mb-6 text-emerald-700 text-[14px] font-bold shadow-sm"
                                    >
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span>Yeni doğrulama maili gönderildi!</span>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-[28px] mb-8 text-left group"
                                    >
                                        <div className="w-10 h-10 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 group-hover:rotate-12 transition-transform">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <p className="text-[13px] text-rose-800 font-bold leading-[1.6]">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={checkVerification}
                                    disabled={checking}
                                    className="group w-full h-16 rounded-[24px] bg-[#5d2b72] hover:bg-[#4a2260] text-white font-bold text-lg shadow-[0_12px_24px_-8px_rgba(93,43,114,0.5)] hover:shadow-[0_20px_32px_-8px_rgba(93,43,114,0.6)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {checking ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Doğruladım, Panele Gir</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    onClick={resendVerification}
                                    disabled={sending || sent}
                                    className="w-full h-14 rounded-[20px] bg-white border border-slate-100 text-slate-500 font-bold text-[14px] hover:border-[#f7eefa] hover:text-[#5d2b72] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Yeniden Gönder
                                        </>
                                    )}
                                </button>

                                <p className="text-[11px] text-slate-300 font-medium tracking-wide pt-4">© 2026 FOTOPLAN OS · BÜM TEKNOLOJİ GÜVENCESİYLE</p>
                            </div>
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
