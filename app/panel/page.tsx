'use client';

import { useState, Suspense, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    Mail, Lock, Eye, EyeOff, Loader2,
    ArrowRight, AlertCircle, Sparkles
} from 'lucide-react';
import Image from 'next/image';

// Lazy load heavy components
const ForgotPasswordModal = dynamic(() => import('@/components/ForgotPasswordModal'), {
    ssr: false,
    loading: () => null
});

// Detect mobile for disabling animations
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function PanelLoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) {
                setError('E-posta veya şifre hatalı.');
                setLoading(false);
            } else {
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();
                const role = session?.user?.role;
                if (role === 'superadmin') {
                    setError('Süper Admin bu sayfadan giriş yapamaz.');
                    setLoading(false);
                } else if (role === 'couple') {
                    setError('Bu sayfa yalnızca fotoğrafçı paneli içindir.');
                    setLoading(false);
                } else {
                    router.push('/admin/dashboard');
                }
            }
        } catch {
            setError('Sistem hatası oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 md:bg-[#08050f] flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">

            {/* Background glow - only on desktop */}
            <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-[#5d2b72] rounded-full blur-[130px] opacity-20 pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 right-0 w-[240px] h-[240px] bg-indigo-700 rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm">

                {/* Logo - no animation on mobile */}
                <div className="flex flex-col items-center mb-9">
                    <div className="mb-4 md:drop-shadow-[0_0_24px_rgba(160,90,200,0.35)]">
                        <Image
                            src="/logoweey.png"
                            alt="Weey.Net Logo"
                            width={130}
                            height={48}
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-[11px] font-bold text-[#9b72b8] uppercase tracking-[0.18em]">
                        Fotoğrafçı Paneli
                    </span>
                </div>

                {/* Card - no animation on mobile */}
                <div className="bg-white md:bg-white/[0.05] border border-gray-100 md:border-white/10 backdrop-blur-2xl rounded-[28px] p-7 shadow-lg md:shadow-2xl md:shadow-black/40 shadow-slate-200/50">
                    <h2 className="text-[22px] font-black text-slate-800 md:text-white mb-1 tracking-tight">Hoş Geldiniz</h2>
                    <p className="text-slate-500 text-sm mb-7">Stüdyo hesabınızla giriş yapın.</p>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[13px] font-semibold flex gap-2.5 items-center">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] block">
                                E-Posta
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-600 group-focus-within:text-[#c084fc] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-[14px] bg-white md:bg-white/5 border border-gray-200 md:border-white/10 rounded-2xl text-slate-900 md:text-white placeholder:text-slate-400 md:placeholder:text-slate-600 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#5d2b72]/60 focus:border-[#7a3a94] transition-all"
                                    placeholder="ornek@studyo.com"
                                    autoComplete="email"
                                    inputMode="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                                    Şifre
                                </label>
                                <Link href="/forgot-password" className="text-[11px] font-bold text-slate-500 hover:text-[#c084fc] transition-colors">
                                    Şifremi Unuttum
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-600 group-focus-within:text-[#c084fc] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-[14px] bg-white md:bg-white/5 border border-gray-200 md:border-white/10 rounded-2xl text-slate-900 md:text-white placeholder:text-slate-400 md:placeholder:text-slate-600 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#5d2b72]/60 focus:border-[#7a3a94] transition-all"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-[15px] bg-gradient-to-r from-[#5d2b72] to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-purple-900/30 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-[15px] mt-1"
                        >
                            {loading && !error
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <><span>Panele Gir</span><ArrowRight className="w-5 h-5" /></>
                            }
                        </button>

                        {/* Forgot Password Link */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                            >
                                Şifremi Unuttum
                            </button>
                        </div>
                    </form>

                    {/* Bottom */}
                    <div className="mt-7 pt-5 border-t border-gray-100 md:border-white/[0.07] flex items-center justify-between">
                        <p className="text-xs text-slate-600">Hesap yok mu?</p>
                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c084fc] hover:text-white transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Paket Al
                        </Link>
                    </div>
                </div>

                {/* Back to home */}
                <p className="text-center mt-6">
                    <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                        ← Ana Sayfaya Dön
                    </Link>
                </p>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <ForgotPasswordModal
                    onClose={() => setShowForgotPassword(false)}
                    onSuccess={() => {
                        setShowForgotPassword(false);
                        setError('');
                    }}
                />
            )}
        </div>
    );
}

export default function PanelLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 md:bg-[#08050f]">
                <Loader2 className="w-9 h-9 animate-spin text-[#5d2b72]" />
            </div>
        }>
            <PanelLoginContent />
        </Suspense>
    );
}
