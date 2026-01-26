'use client';

import { X, Lock, ArrowRight, User, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface CustomerLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
    studioName?: string;
}

export default function CustomerLoginModal({ isOpen, onClose, logo, studioName }: CustomerLoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email: username,
                password: password,
                redirect: false
            });

            if (res?.error) {
                setError('Kullanıcı adı veya şifre hatalı.');
                setLoading(false);
            } else {
                setSuccess(true);
                // Redirect to selection after short delay
                setTimeout(() => {
                    // Force full page load to ensure session is picked up by server components
                    // and to clear any modal state
                    const cleanPath = pathname?.split('/selection')[0] || '';
                    // Remove trailing slash if present
                    const basePath = cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
                    window.location.href = `${basePath}/selection`;
                }, 1000);
            }
        } catch (err) {
            setError('Bir hata oluştu.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    {logo ? (
                        <img src={logo} alt={studioName} className="h-12 mx-auto mb-4 object-contain" />
                    ) : (
                        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">{studioName}</h2>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">Müşteri Girişi</h3>
                    <p className="text-gray-400 text-sm">Fotoğraflarınıza erişmek için bilgilerinizi giriniz.</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 text-black shadow-lg shadow-green-500/30">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Giriş Başarılı!</h3>
                        <p className="text-gray-400">Panelinize yönlendiriliyorsunuz...</p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kullanıcı Adı</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Kullanıcı Adınız"
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all placeholder:text-gray-600 font-medium"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Şifre</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all placeholder:text-gray-600 font-medium"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading || !username || !password}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>GİRİŞ YAP <ArrowRight className="w-4 h-4" /></>}
                        </button>

                        <div className="text-center">
                            <button type="button" className="text-xs text-gray-500 hover:text-white transition-colors">
                                Şifremi unuttum?
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
