'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, AlertCircle, Lock, Mail } from 'lucide-react';

export default function SuperAdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Auto-redirect if already logged in as superadmin
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'superadmin') {
            router.push('/superadmin/dashboard');
        }
    }, [session, status, router]);

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
                setError('Giriş başarısız. Bilgilerinizi kontrol ediniz.');
                setLoading(false);
                return;
            }

            // Check session to confirm SuperAdmin role
            const sessionRes = await fetch('/api/auth/session');
            const session = await sessionRes.json();

            if (session?.user?.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else {
                setError('Yetkisiz Erişim: Bu panel sadece sistem yöneticileri içindir.');
                setLoading(false);
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-900/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-indigo-900/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-pink-900/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md p-8 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 z-10 relative">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-900/50 animate-pulse">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Süper Admin
                    </h1>
                    <p className="text-gray-400 text-sm">Sistem Yönetimi Paneli</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-700/50 rounded-full text-xs text-purple-300">
                        <Lock className="w-3 h-3" />
                        <span>Yüksek Güvenlikli Erişim</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-shake">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-400" />
                            Yönetici E-posta
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-purple-400" />
                            Güvenlik Anahtarı
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                            placeholder="••••••••••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/30 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Doğrulanıyor...</span>
                            </>
                        ) : (
                            <>
                                <Crown className="w-5 h-5" />
                                <span>Güvenli Giriş</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-800/50">
                    <div className="text-center space-y-2">
                        <p className="text-xs text-gray-500">
                            Bu panel sadece sistem yöneticileri içindir
                        </p>
                        <a
                            href="/login"
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                        >
                            ← Fotoğrafçı Girişi
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
