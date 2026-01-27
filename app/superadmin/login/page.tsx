'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, AlertCircle } from 'lucide-react';

export default function SuperAdminLoginPage() {
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
                // Not a superadmin - force logout and show error
                // await signOut({ redirect: false }); // Commented out to avoid circular dependency or import issues if signOut isn't imported
                // Better approach: Show error and let them try again or go to main login
                setError('Yetkisiz Erişim: Bu panel sadece sistem yöneticileri içindir.');
                setLoading(false);
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-900/20 blur-[100px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-indigo-900/20 blur-[100px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-900/50">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Süper Admin Paneli</h1>
                    <p className="text-gray-400 text-sm">Sistem yönetimi için giriş yapın</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-lg flex items-center gap-3 text-red-200 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Yönetici Profili
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-600 transition-all font-mono text-sm"
                            placeholder="musterisistem@gmail.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Güvenlik Anahtarı
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-600 transition-all font-mono text-sm"
                            placeholder="................"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/20 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Kontrol Ediliyor...</span>
                            </>
                        ) : (
                            'Güvenli Giriş'
                        )}
                    </button>

                    <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
                        <a href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                            Normal Giriş Sayfasına Dön
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
