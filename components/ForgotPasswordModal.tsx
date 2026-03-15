'use client';
import { useState } from 'react';
import { Lock, X, Phone, CreditCard, Key, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ForgotPasswordModal({ onClose, onSuccess }: ForgotPasswordModalProps) {
    const [step, setStep] = useState<'identifier' | 'code' | 'password'>('identifier');
    const [identifier, setIdentifier] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Format phone number automatically
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/[^\d]/g, '');
        
        // If starts with 0, format as phone
        if (cleaned.startsWith('0')) {
            let formatted = '';
            if (cleaned.length > 0) formatted += cleaned.substring(0, 1);
            if (cleaned.length > 1) formatted += ' (' + cleaned.substring(1, 4);
            if (cleaned.length > 4) formatted += ') ' + cleaned.substring(4, 7);
            if (cleaned.length > 7) formatted += ' ' + cleaned.substring(7, 9);
            if (cleaned.length > 9) formatted += ' ' + cleaned.substring(9, 11);
            return formatted.trim();
        }
        
        // Otherwise keep as TC (11 digits max)
        return cleaned.slice(0, 11);
    };

    const handleIdentifierChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setIdentifier(formatted);
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            });

            const data = await res.json();

            if (res.ok) {
                setMaskedPhone(data.maskedPhone);
                setUserId(data.userId);
                setStep('code');
            } else {
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, code, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setStep('password');
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                }, 2000);
            } else {
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-purple-500/10 to-transparent border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-purple-400" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Şifremi Unuttum</h3>
                    <p className="text-sm text-gray-400">
                        {step === 'identifier' && 'TC Kimlik No veya telefon numaranızı girin'}
                        {step === 'code' && 'SMS ile gönderilen kodu girin'}
                        {step === 'password' && 'Şifreniz başarıyla güncellendi!'}
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {step === 'identifier' && (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    TC Kimlik No veya Telefon
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => handleIdentifierChange(e.target.value)}
                                        placeholder="12345678901 veya 0 (555) 123 45 67"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-sm text-red-400 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-4 h-4" />
                                        SMS Kodu Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 'code' && (
                        <form onSubmit={handleVerifyAndReset} className="space-y-4">
                            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                                <p className="text-sm text-blue-400 font-medium text-center">
                                    {maskedPhone} numarasına SMS kodu gönderildi
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    SMS Doğrulama Kodu
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="6 haneli kod"
                                        maxLength={6}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white text-center text-xl font-bold tracking-widest focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Yeni Şifre
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="En az 6 karakter"
                                    minLength={6}
                                    className="w-full px-4 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Yeni Şifre (Tekrar)
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Şifrenizi tekrar girin"
                                    minLength={6}
                                    className="w-full px-4 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-sm text-red-400 font-medium">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('identifier')}
                                    className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 border border-white/10 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                                >
                                    Geri
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Doğrulanıyor...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Şifreyi Güncelle
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'password' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Başarılı!</h4>
                            <p className="text-gray-400">Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
