'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { CheckCircle, RefreshCw, Loader2, AlertTriangle, ArrowRight, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UpgradeSuccessFlow from '@/components/admin/UpgradeSuccessFlow';

export default function VerifyPhonePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const [verifying, setVerifying] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);

    // Redirect if already verified, otherwise send initial SMS
    useEffect(() => {
        if (status === 'authenticated') {
            if ((session?.user as any)?.isPhoneVerified === true) {
                router.push('/admin/dashboard');
            } else if (!sent && countdown === 0) {
                // Auto-send first SMS when page loads
                resendSMS();
            }
        }
    }, [status, session, router]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) inputs.current[index + 1]?.focus();
        if (value && index === 5 && newCode.every(v => v !== '')) {
            verifyCode(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            inputs.current[5]?.focus();
            setTimeout(() => verifyCode(pasted), 50);
        }
    };

    const verifyCode = async (fullCode?: string) => {
        const otpCode = fullCode || code.join('');
        if (otpCode.length !== 6) {
            setError('Lütfen 6 haneli doğrulama kodunu eksiksiz girin.');
            return;
        }
        setVerifying(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/verify-phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: otpCode })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                await update();
                setShowSetup(true);
            } else {
                setError(data.error || 'Doğrulama kodu hatalı veya süresi dolmuş.');
                setCode(['', '', '', '', '', '']);
                inputs.current[0]?.focus();
            }
        } catch {
            setError('Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        } finally {
            setVerifying(false);
        }
    };

    const resendSMS = async () => {
        setSending(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/resend-phone-verification', { method: 'POST' });
            const data = await res.json();
            if (res.ok && data.success) {
                setSent(true);
                setCountdown(60);
                setCode(['', '', '', '', '', '']);
                inputs.current[0]?.focus();
                setTimeout(() => setSent(false), 5000);
            } else {
                setError(data.error || 'SMS gönderimi başarısız oldu.');
            }
        } catch {
            setError('SMS gönderilemedi. Bağlantı hatası.');
        } finally {
            setSending(false);
        }
    };

    if (showSetup) {
        return (
            <div className="min-h-screen">
                <UpgradeSuccessFlow
                    packageName="Paketiniz"
                    onComplete={() => { window.location.href = '/admin/dashboard'; }}
                    isModal={false}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080c18] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#5d2b72]/8 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7a3a94]/6 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
                {/* Top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#5d2b72] to-purple-500 rounded-b-full" />

                {/* Icon */}
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2">
                    <MessageSquare className="w-7 h-7 text-[#5d2b72]" />
                </div>

                <h1 className="text-xl font-black text-slate-900 mb-1 tracking-tight">
                    SMS Doğrulama
                </h1>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Hesabınıza kayıtlı <strong className="text-slate-700">{(session?.user as any)?.phone || 'telefon numaranıza'}</strong> gönderilen <strong className="text-slate-700">6 haneli kodu</strong> girin.
                </p>

                {/* OTP Inputs */}
                <div className="flex gap-2 justify-center mb-5" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-11 h-14 text-center text-xl font-black rounded-xl border-2 outline-none transition-all
                                ${digit
                                    ? 'border-[#5d2b72] bg-purple-50 text-[#5d2b72]'
                                    : 'border-slate-200 bg-slate-50 text-slate-900'}
                                focus:border-[#5d2b72] focus:ring-2 focus:ring-purple-100
                                ${error ? 'border-red-300 bg-red-50' : ''}`}
                        />
                    ))}
                </div>

                {/* Notifications */}
                <AnimatePresence mode="wait">
                    {sent && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-semibold mb-4"
                        >
                            <CheckCircle className="w-4 h-4 shrink-0" /> Yeni kod SMS ile gönderildi!
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold mb-4"
                        >
                            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Verify Button */}
                <button
                    onClick={() => verifyCode()}
                    disabled={verifying || code.join('').length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                    {verifying
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Doğrulanıyor...</>
                        : <>Kodu Doğrula <ArrowRight className="w-4 h-4" /></>}
                </button>

                {/* Resend */}
                <button
                    onClick={resendSMS}
                    disabled={sending || countdown > 0}
                    className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sending
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Gönderiliyor...</>
                        : countdown > 0
                            ? `Yeniden gönder (${countdown}s)`
                            : <><RefreshCw className="w-3.5 h-3.5" /> Yeniden Kod İste</>}
                </button>

                {/* Sign out */}
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="mt-4 text-slate-400 text-xs font-semibold hover:text-rose-500 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                    <LogOut className="w-3.5 h-3.5" /> Farklı Hesaba Geç
                </button>
            </motion.div>
        </div>
    );
}
