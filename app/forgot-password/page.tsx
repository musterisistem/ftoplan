'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, Calendar, Image as ImageIcon, CreditCard, ArrowRight, Mail, ArrowLeft, Globe } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage('Lütfen e-posta adresinizi giriniz.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Şifre sıfırlama API isteği simülasyonu
            // const res = await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setErrorMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Visual & Info (Same as Login Page) */}
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

            {/* Right Side - Forgot Password Form (Creative & Glassmorphic) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#FAFBFF]">
                {/* Ambient Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

                <div className="w-full max-w-[420px] relative z-10 bg-white/60 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white/80">

                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7B3FF2] transition-colors mb-8 font-bold text-[13px] group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Giriş'e Dön
                    </Link>

                    <div className="mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#7B3FF2] to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-6 mx-auto lg:mx-0">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h2 className="text-[28px] sm:text-[32px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 lg:mb-2 mb-3 text-center lg:text-left">
                            Şifrenizi Mi Unuttunuz?
                        </h2>
                        <p className="text-slate-500 text-[15px] font-medium text-center lg:text-left leading-relaxed">
                            Hesabınıza bağlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center p-6 bg-emerald-50/80 backdrop-blur-sm border-2 border-emerald-100/50 rounded-2xl text-center shadow-[0_4px_20px_rgba(16,185,129,0.08)]">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                                <Mail className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="font-extrabold text-[18px] text-emerald-900 mb-2">E-posta Gönderildi!</h3>
                            <p className="text-emerald-700/90 text-[14px] font-medium leading-relaxed">
                                Lütfen <strong className="text-emerald-800">{email}</strong> adresinin gelen kutusunu (veya spam klasörünü) kontrol edin.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-2xl text-red-800 text-sm font-semibold shadow-sm animate-in fade-in">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 ml-1">
                                    E-posta Adresi
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-white/70 border border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/15 focus:border-[#7B3FF2]/50 text-slate-900 transition-all font-medium text-[15px] placeholder:text-slate-400 outline-none hover:bg-white backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full flex justify-center items-center py-4 px-4 rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-[#7B3FF2] to-indigo-600 hover:from-[#6A32DE] hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-[#7B3FF2]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Sıfırlama Bağlantısı Gönder <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
