'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw, Loader2, ShieldCheck, Sparkles, AlertTriangle, ArrowRight, ExternalLink, Inbox, Info, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyRequiredPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [checking, setChecking] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-poll every 5 seconds
    useEffect(() => {
        if (status !== 'authenticated' || session?.user?.isEmailVerified === true) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                if (data?.user?.isEmailVerified === true) {
                    clearInterval(interval);
                    await update();
                    setShowSuccess(true);
                    setTimeout(() => window.location.href = '/admin/dashboard', 2000);
                }
            } catch { /* ignore */ }
        }, 5000);

        return () => clearInterval(interval);
    }, [status, session, update, router]);

    const resendEmail = async () => {
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

    const checkNow = async () => {
        setChecking(true);
        setError(null);
        try {
            // Add a small delay for the loading effect
            await new Promise(resolve => setTimeout(resolve, 800));

            const res = await fetch('/api/auth/session');
            const data = await res.json();

            if (data?.user?.isEmailVerified === true) {
                await update();
                setShowSuccess(true);
                setTimeout(() => window.location.href = '/admin/dashboard', 2000);
            } else {
                setError('İncelememize göre mail adresiniz henüz doğrulanmamış. Lütfen mail kutunuzu kontrol edip hesabınızı doğrulayın.');
            }
        } catch (err) {
            setError('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setChecking(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
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

                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Harika!</h1>
                    <p className="text-emerald-400 font-bold text-lg mb-8">E-posta adresiniz doğrulandı.</p>
                    <div className="flex items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                        <span className="font-medium">Panele yönlendiriliyorsunuz...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080c18] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Design Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5d2b72]/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7a3a94]/10 blur-[150px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/95 backdrop-blur-2xl rounded-[48px] p-8 md:p-16 shadow-[0_40px_160px_-16px_rgba(0,0,0,0.6)] max-w-2xl w-full border border-white/20"
            >
                {/* Branding Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-[#5d2b72] via-[#7a3a94] to-[#5d2b72] rounded-b-full" />

                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Left Column: Icon & Title */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 bg-[#f7eefa]/30 border border-[#f7eefa]/50 rounded-[32px] flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-sm"
                        >
                            <Mail className="w-12 h-12 text-[#5d2b72]" />
                        </motion.div>

                        <h1 className="text-4xl font-black text-[#1a0b2e] mb-4 tracking-tight leading-tight">
                            E-Posta <br />
                            <span className="text-[#5d2b72]">Doğrulaması?</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                            Güvenliğiniz için hesabınızı doğrulamanız gerekiyor. Paneliniz hazır, sadece bir tık uzaktasınız.
                        </p>

                        <div className="flex items-center gap-3 px-6 py-4 bg-[#f7eefa]/20 border border-[#f7eefa]/50 rounded-3xl text-[#5d2b72] font-bold text-sm shadow-sm inline-flex">
                            <span className="w-2 h-2 rounded-full bg-[#7a3a94] animate-pulse" />
                            {session?.user?.email}
                        </div>
                    </div>

                    {/* Right Column: Instructions & Actions */}
                    <div className="w-full md:w-1/2 space-y-6">
                        {/* Summary Box */}
                        <div className="p-7 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[36px] space-y-5 shadow-sm">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 shrink-0 bg-white border border-[#f7eefa]/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Inbox className="w-6 h-6 text-[#5d2b72]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Gelen Kutusu</p>
                                    <p className="text-[12px] text-slate-500 leading-snug">Gelen kutusuna ve spam klasörüne bakın.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 shrink-0 bg-white border border-[#f7eefa]/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-[#5d2b72]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Güvenli Erişim</p>
                                    <p className="text-[12px] text-slate-500 leading-snug">Bu adım hesabınızın güvenliği için zorunludur.</p>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <AnimatePresence mode="wait">
                            {sent && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-[24px] text-emerald-700 text-[14px] font-bold shadow-sm"
                                >
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span>Mail yeniden gönderildi!</span>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-[28px] text-left group"
                                >
                                    <div className="w-10 h-10 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 group-hover:rotate-12 transition-transform">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <p className="text-[13px] text-rose-800 font-bold leading-relaxed">
                                        {error}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Buttons */}
                        <div className="space-y-3 pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={checkNow}
                                disabled={checking}
                                className="group w-full h-16 rounded-[24px] bg-[#5d2b72] hover:bg-[#4a2260] text-white font-bold text-lg shadow-[0_12px_24px_-8px_rgba(93,43,114,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
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
                                onClick={resendEmail}
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

                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="w-full h-12 rounded-[20px] text-slate-400 font-bold text-xs hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Farklı Hesaba Geç
                            </button>

                            <Link
                                href="/"
                                className="w-full h-12 rounded-[20px] text-slate-400 font-bold text-xs hover:text-[#5d2b72] transition-colors flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" /> Ana Sayfaya Dön
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] text-slate-300 font-black tracking-[0.2em] uppercase">
                        © 2026 FOTOPLAN OS · BÜM TEKNOLOJİ GÜVENCESİYLE
                    </p>
                </div>
            </motion.div>

            {/* Auto-check indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white/40 text-[11px] font-bold tracking-wide">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7a3a94] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5d2b72]" />
                </span>
                OTOMATİK KONTROL AKTİF
            </div>
        </div>
    );
}
