'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

function LoginContent() {
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const verified = searchParams.get('verified');
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
                setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            } else {
                // Fetch session to determine role-based redirect
                const sessionRes = await fetch('/api/auth/session');
                const session = await sessionRes.json();

                if (session?.user?.role === 'superadmin') {
                    router.push('/superadmin/dashboard');
                } else if (session?.user?.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (session?.user?.role === 'couple') {
                    router.push('/client/dashboard');
                } else {
                    router.push('/admin/dashboard'); // Default fallback
                }
            }
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
            <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
                    <p className="text-gray-300">Yönetim paneline giriş yapın</p>
                </div>

                {registered && (
                    <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-100 text-sm flex items-start gap-3">
                        <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Kayıt Başarılı!</p>
                            <p className="mt-1 opacity-90">Lütfen e-posta adresinizi doğrulayın. Doğrulama linki mail adresinize gönderildi.</p>
                        </div>
                    </div>
                )}

                {verified && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-100 text-sm flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">E-posta Doğrulandı!</p>
                            <p className="mt-1 opacity-90">Hesabınız başarıyla aktif edildi. Şimdi giriş yapabilirsiniz.</p>
                        </div>
                    </div>
                )}

                {errorParam === 'invalid_token' && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Hatalı Link!</p>
                            <p className="mt-1 opacity-90">Doğrulama linki geçersiz veya süresi dolmuş. Lütfen tekrar kayıt olmayı deneyin.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email veya Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                            placeholder="email@örnek.com veya kullanıcıadı"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Şifre
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
