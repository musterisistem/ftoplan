'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Mail, Lock, Eye, EyeOff, Loader2,
    ArrowRight, CheckCircle, AlertCircle,
    Facebook, Twitter, Instagram
} from 'lucide-react';

/* ─── Components ──────────────────────────────── */

function Nav() {
    return (
        <nav className="fixed top-0 inset-x-0 z-[100] px-6 py-6 bg-white/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logoweey.png" alt="Weey Logo" className="h-8" />
                    <span className="font-bold text-lg text-slate-900">Weey.NET</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Home</Link>
                    <Link href="/register" className="text-sm font-bold text-[#B066FE]">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
}

function LoginContent() {
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const verified = searchParams.get('verified');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) {
                setError('E-posta veya şifre hatalı.');
            } else {
                router.push('/admin/dashboard');
            }
        } catch {
            setError('Sistem hatası.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans antialiased">
            <Nav />

            <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] bg-purple-100/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-blue-50/20 rounded-full blur-[80px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 flex items-center justify-center">
                <div className="w-full max-w-[480px] bg-white p-12 rounded-[50px] shadow-2xl border border-white/50 relative overflow-hidden">
                    <div className="mb-12">
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Welcome Back</span>
                        <h1 className="text-4xl font-bold mb-3 tracking-tight">Login to Weey</h1>
                        <p className="text-slate-500 font-medium">Access your studio management suite.</p>
                    </div>

                    {/* Notifications */}
                    {(registered || verified) && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold flex gap-3">
                            <CheckCircle className="w-5 h-5 shrink-0" />
                            <span>{registered ? 'Registration successful! Check your email.' : 'Email verified! You can now login.'}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold flex gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                            <input
                                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-400 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#B066FE] focus:bg-white transition-all shadow-sm"
                                placeholder="name@studio.com"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2 ml-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-400 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#B066FE] focus:bg-white transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Login <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-400 font-medium mb-4">Don't have an account?</p>
                        <Link href="/register" className="inline-flex items-center gap-2 font-bold text-slate-900 hover:text-[#B066FE] transition-colors">
                            Create Account <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="py-20 text-center border-t border-slate-100">
                <div className="flex justify-center gap-6 mb-8 text-slate-300">
                    <Facebook className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                    <Twitter className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                    <Instagram className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                </div>
                <img src="/logoweey.png" alt="Logo" className="h-5 mx-auto mb-4 opacity-20" />
                <p className="text-slate-400 text-xs font-bold">© 2026 Weey Digital Suite</p>
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-[#B066FE]" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
