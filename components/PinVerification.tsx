'use client';
import { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface PinVerificationProps {
    onVerify: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
}

const CORRECT_PIN = '8533';

export default function PinVerification({ 
    onVerify, 
    onCancel, 
    title = 'Güvenlik Doğrulaması',
    description = 'Bu işlemi gerçekleştirmek için 4 haneli PIN kodunu girin.'
}: PinVerificationProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (pin.length !== 4) {
            setError('PIN kodu 4 haneli olmalıdır');
            return;
        }

        if (pin !== CORRECT_PIN) {
            setError('Hatalı PIN kodu');
            setPin('');
            return;
        }

        setLoading(true);
        onVerify();
    };

    const handlePinChange = (value: string) => {
        // Only allow numbers and max 4 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 4);
        setPin(numericValue);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-red-500/10 to-transparent border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                            <Lock className="w-6 h-6 text-red-400" />
                        </div>
                        <button 
                            onClick={onCancel}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                PIN Kodu
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                value={pin}
                                onChange={(e) => handlePinChange(e.target.value)}
                                placeholder="••••"
                                maxLength={4}
                                autoFocus
                                className="w-full px-6 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-sm text-red-400 font-medium text-center">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-white/10 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || pin.length !== 4}
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Doğrula
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
