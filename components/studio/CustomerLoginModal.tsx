'use client';

import { X, Lock, ArrowRight, User, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

interface CustomerLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
    studioName?: string;
    slug: string;
    theme?: string;
}

export default function CustomerLoginModal({ isOpen, onClose, logo, studioName, slug, theme = 'warm' }: CustomerLoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const { login } = useCustomerAuth();

    // Theme Logic
    const isPink = theme === 'light';

    // Modal Colors
    const modalBg = isPink ? 'bg-white' : 'bg-[#111]';
    const borderColor = isPink ? 'border-pink-200' : 'border-white/10';
    const textColor = isPink ? 'text-[#831843]' : 'text-white';
    const subTextColor = isPink ? 'text-[#9D174D]/70' : 'text-gray-400';
    const inputLabelColor = isPink ? 'text-[#9D174D]/60' : 'text-gray-500';

    // Input
    const inputBg = isPink ? 'bg-pink-50' : 'bg-[#1a1a1a]';
    const inputBorder = isPink ? 'border-pink-200 focus:border-pink-400' : 'border-white/10 focus:border-white/30';
    const inputText = isPink ? 'text-[#831843] placeholder:text-pink-300' : 'text-white placeholder:text-gray-600';
    const inputIconColor = isPink ? 'text-pink-300' : 'text-gray-500';

    // Button
    const btnClass = isPink
        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
        : 'bg-white text-black hover:bg-gray-200';

    // Close Button
    const closeBtnClass = isPink
        ? 'text-pink-300 hover:text-[#831843] hover:bg-pink-50'
        : 'text-gray-400 hover:text-white hover:bg-white/10';


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(username, password);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = `/studio/${slug}/selection`;
                }, 1000);
            } else {
                setError(result.error || 'Kullanıcı adı veya şifre hatalı.');
                setLoading(false);
            }
        } catch (err) {
            setError('Bir hata oluştu.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className={`relative w-full max-w-md ${modalBg} border ${borderColor} rounded-3xl p-8 shadow-2xl transform transition-all`}>
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${closeBtnClass}`}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    {logo ? (
                        <img src={logo} alt={studioName} className="h-12 mx-auto mb-4 object-contain" />
                    ) : (
                        <h2 className={`text-xl font-bold mb-4 uppercase tracking-widest ${textColor}`}>{studioName}</h2>
                    )}
                    <h3 className={`text-2xl font-bold mb-2 ${textColor}`}>Müşteri Girişi</h3>
                    <p className={`text-sm ${subTextColor}`}>Fotoğraflarınıza erişmek için bilgilerinizi giriniz.</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${isPink ? 'bg-green-100 text-green-600' : 'bg-green-500 text-black shadow-green-500/30'}`}>
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${textColor}`}>Giriş Başarılı!</h3>
                        <p className={subTextColor}>Panelinize yönlendiriliyorsunuz...</p>
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
                                <label className={`text-xs font-bold uppercase tracking-wider ${inputLabelColor}`}>Kullanıcı Adı</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Kullanıcı Adınız"
                                        className={`w-full py-4 pl-12 pr-4 rounded-xl outline-none transition-all font-medium border focus:ring-1 ${inputBg} ${inputBorder} ${inputText}`} // Updated input styles
                                    />
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${inputIconColor}`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider ${inputLabelColor}`}>Şifre</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                        className={`w-full py-4 pl-12 pr-4 rounded-xl outline-none transition-all font-medium border focus:ring-1 ${inputBg} ${inputBorder} ${inputText}`} // Updated input styles
                                    />
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${inputIconColor}`} />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading || !username || !password}
                            className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>GİRİŞ YAP <ArrowRight className="w-4 h-4" /></>}
                        </button>

                        <div className="text-center">
                            <button type="button" className={`text-xs transition-colors ${subTextColor} hover:opacity-80`}>
                                Şifremi unuttum?
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
