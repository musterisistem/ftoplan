'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Camera, Heart, Lock, User } from 'lucide-react';

export default function ClientLoginPage() {
    const [username, setUsername] = useState('');
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
                email: username, // We use email field but pass username
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
            } else {
                // Verify user is a customer (couple)
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                if (session?.user?.role === 'couple' && session?.user?.customerId) {
                    // Get customer info to find photographer slug
                    const customerRes = await fetch(`/api/customers/${session.user.customerId}`);
                    if (customerRes.ok) {
                        const customerData = await customerRes.json();
                        if (customerData.photographerSlug) {
                            // Redirect to photo selection page
                            router.push(`/studio/${customerData.photographerSlug}/selection`);
                        } else {
                            // Fallback to dashboard if no photographer slug
                            router.push('/client/dashboard');
                        }
                    } else {
                        router.push('/client/dashboard');
                    }
                } else if (session?.user?.role === 'couple') {
                    router.push('/client/dashboard');
                } else {
                    // If not a customer, sign out and show error
                    await signIn('credentials', { redirect: false }); // This will fail and effectively sign out
                    setError('Bu giriş sayfası sadece müşteriler içindir. Fotoğrafçı girişi için /login sayfasını kullanın.');
                }
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 p-4">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-rose-200 rounded-full blur-2xl opacity-40"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl mb-4">
                        <Camera className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Fotoğraflarınız</h1>
                    <p className="text-gray-600">Özel anlarınızı görüntüleyin</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="text-sm text-gray-600">Müşteri Girişi</span>
                        <Heart className="w-5 h-5 text-pink-500" />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition-all"
                                    placeholder="Kullanıcı adınızı girin"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Giriş Yapılıyor...
                                </span>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                            Giriş bilgilerinizi fotoğrafçınızdan alabilirsiniz.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    © 2024 Kadraj Panel. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    );
}
