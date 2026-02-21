'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Camera, Calendar, Image as ImageIcon, CreditCard, ArrowRight, Lock, User, Globe } from 'lucide-react';

function LoginContent() {
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const verified = searchParams.get('verified');
    const redirectParam = searchParams.get('redirect');
    const errorParam = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Giriş başarısız. Lütfen e-posta veya şifrenizi kontrol edin.');
            } else {
                // Fetch session to determine role-based redirect
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                if (session?.user?.role === 'superadmin') {
                    router.push('/superadmin/dashboard');
                } else if (session?.user?.role === 'admin') {
                    if (redirectParam) {
                        router.push(redirectParam);
                    } else {
                        router.push('/admin/dashboard');
                    }
                } else if (session?.user?.role === 'couple') {
                    router.push('/client/dashboard');
                } else {
                    router.push('/admin/dashboard'); // Default fallback
                }
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Visual & Info */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop")' }}
                />

                <div className="relative z-20 flex flex-col justify-between p-12 xl:p-20 w-full text-white">
                    <div>
                        <div className="flex items-center gap-4 mb-16">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                <Camera className="w-7 h-7 text-purple-300" />
                            </div>
                            <span className="text-3xl font-extrabold tracking-tight">Weey.NET</span>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6">
                            Fotoğraf Stüdyonuzu<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                Tek Yerden Yönetin
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 mb-12 max-w-lg leading-relaxed mix-blend-plus-lighter">
                            Müşteri ilişkileri, randevu takibi, fotoğraf teslimi ve sanal pos ile ödeme alma süreçlerinizi baştan uca profesyonelleştirin.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <Calendar className="w-6 h-6 text-purple-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">Akıllı Randevu</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Ajandanızı dijitalleştirin, çakışmaları ve unutulmaları önleyin.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <ImageIcon className="w-6 h-6 text-pink-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Müşteri Galerisi</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Kolay toplu fotoğraf seçimi ve dijital yüksek hızlı teslimat.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <CreditCard className="w-6 h-6 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Online Tahsilat</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Müşterilerden kapora alın, bakiyeleri sanal pos ile güvenle tahsil edin.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <Globe className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Premium Web Sayfası</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Kurumsal markanıza özel portfolyo ve prestijli vitrin.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 mt-12 font-medium">
                        © 2026 Weey.NET Fotoğrafçı Çözümleri
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Mobile Background with subtle gradient */}
                <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-gray-50 to-gray-200 z-0" />

                <div className="relative z-10 w-full max-w-[26rem] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-50">
                    <div className="text-center mb-8">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#7B3FF2] to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                                <Camera className="w-8 h-8" />
                            </div>
                        </div>
                        <h2 className="text-[28px] sm:text-[32px] font-black text-slate-900 tracking-tight lg:mb-2 mb-3">Tekrar Merhaba! 👋</h2>
                        <p className="text-gray-500 text-sm font-medium">İşletmenizi yönetmek için panele giriş yapın.</p>
                    </div>

                    {registered && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm flex items-start gap-3 shadow-sm">
                            <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-blue-900">Kayıt Başarılı!</p>
                                <p className="mt-1 opacity-90 leading-relaxed">
                                    Hesabınızı oluşturduk. Sisteme giriş yapabilmek için lütfen mailinize gönderdiğimiz doğrulama linkine tıklayın.
                                </p>
                            </div>
                        </div>
                    )}

                    {verified && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-800 text-sm flex items-start gap-3 shadow-sm">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-green-900">E-posta Doğrulandı!</p>
                                <p className="mt-1 opacity-90 leading-relaxed">Hesabınız başarıyla aktif edildi. Şimdi güvenle giriş yapabilirsiniz.</p>
                            </div>
                        </div>
                    )}

                    {errorParam === 'invalid_token' && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 text-sm flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900">Geçersiz Link!</p>
                                <p className="mt-1 opacity-90 leading-relaxed">Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen müşteri hizmetleri ile iletişime geçin.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">
                                E-posta Adresiniz
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#7B3FF2] text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[15px]"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                                <label className="block text-[13px] font-bold text-gray-700">
                                    Şifreniz
                                </label>
                                <Link href="#" className="text-[13px] font-bold text-[#7B3FF2] hover:text-[#5a28c4] transition-colors">
                                    Şifremi Unuttum?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#7B3FF2] text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 tracking-widest text-[15px]"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] text-[15px] font-bold text-white bg-[#7B3FF2] hover:bg-[#6A32DE] focus:outline-none focus:ring-4 focus:ring-[#7B3FF2]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Panele Giriş Yap <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100/60">
                        <div className="bg-[#F8F9FF] border border-indigo-50 rounded-2xl p-5 text-center transition-colors hover:bg-indigo-50/50">
                            <p className="text-[13px] text-gray-500 font-medium mb-3">
                                Henüz Weey.NET dünyasıyla tanışmadınız mı?
                            </p>
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-purple-100 text-[#7B3FF2] text-[14px] font-bold rounded-xl shadow-sm hover:border-[#7B3FF2]/30 hover:text-[#6A32DE] hover:shadow-md transition-all">
                                Hemen Ücretsiz Hesap Oluşturun
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
