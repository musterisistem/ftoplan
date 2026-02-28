'use client';

import { useState, Suspense } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Mail, Lock, Eye, EyeOff, Loader2,
    ArrowRight, CheckCircle, AlertCircle, Camera, ImageIcon, Star
} from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import CreativeLoader from '@/components/ui/CreativeLoader';

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
                setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
                setLoading(false);
            } else {
                // Check role and redirect accordingly
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();
                if (session?.user?.role === 'superadmin') {
                    await signOut({ redirect: false });
                    setError('Süper Admin girişi bu sayfadan yapılamaz. Lütfen süper admin girişini kullanın.');
                    setLoading(false);
                } else if (session?.user?.role === 'couple') {
                    router.push('/musteri');
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
        <div className="min-h-screen bg-[#f8faff] font-sans antialiased flex flex-col">
            <CreativeLoader
                isVisible={loading && !error}
                message="Paneliniz Hazırlanıyor"
                subMessage="Bilgileriniz yükleniyor, lütfen bekleyin..."
            />

            <PublicHeader />

            <main className="flex-1 flex items-center justify-center py-24 px-4 pt-36">
                {/* Background blobs */}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[80px]" />
                </div>

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Info Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:flex flex-col"
                    >
                        <div className="mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-6 shadow-sm">
                                <Camera className="w-3.5 h-3.5" /> Profesyonel Fotoğrafçı Platformu
                            </span>
                            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-5">
                                Stüdyonuzu<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-indigo-600">
                                    Dijitale Taşıyın
                                </span>
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Müşteri yönetimi, randevu takibi, online fotoğraf seçimi
                                ve daha fazlası — tek platformda.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="space-y-4 mb-10">
                            {[
                                { icon: <ImageIcon className="w-5 h-5 text-purple-600" />, title: "Online Fotoğraf Seçimi", desc: "Müşterileriniz kendi panelinden albüm seçimi yapabilir" },
                                { icon: <Star className="w-5 h-5 text-amber-500" />, title: "Randevu & Takvim", desc: "Tüm çekimlerinizi tek ekrandan yönetin" },
                                { icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, title: "Otomatik Bildirimler", desc: "Müşterilerinize otomatik hatırlatmalar gönderin" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                            <div className="flex -space-x-2">
                                {['A', 'B', 'C'].map(l => (
                                    <div key={l} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5d2b72] to-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">{l}</div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-600 font-medium">
                                <span className="font-black text-slate-900">500+</span> fotoğrafçı güveniyor
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT: Login Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-12">

                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Giriş Yap</h1>
                                <p className="text-slate-400 font-medium text-sm">Stüdyo panelinize hoş geldiniz.</p>
                            </div>

                            {/* Notifications */}
                            {(registered || verified) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold flex gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 shrink-0" />
                                    <span>{registered ? 'Kayıt başarılı! E-postanızı kontrol edin.' : 'E-posta doğrulandı! Giriş yapabilirsiniz.'}</span>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold flex gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block">E-Posta Adresi</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#5d2b72]">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-5 py-4 bg-[#f8faff] border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
                                            placeholder="ornek@studyo.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block">Şifre</label>
                                        <Link href="/forgot-password" className="text-xs font-bold text-slate-400 hover:text-[#5d2b72] transition-colors">Şifremi Unuttum</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#5d2b72]">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-14 py-4 bg-[#f8faff] border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-[#5d2b72] to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-2 h-14"
                                >
                                    {loading && !error
                                        ? <Loader2 className="w-5 h-5 animate-spin" />
                                        : <><span>Giriş Yap</span> <ArrowRight className="w-5 h-5" /></>
                                    }
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-400 font-medium mb-3">Henüz hesabınız yok mu?</p>
                                <Link
                                    href="/packages"
                                    className="inline-flex items-center gap-2 group px-6 py-3 bg-[#f8faff] border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-purple-200 hover:text-[#5d2b72] transition-all text-sm"
                                >
                                    Ücretsiz Hesap Oluştur
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
                <Loader2 className="w-10 h-10 animate-spin text-[#5d2b72]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
