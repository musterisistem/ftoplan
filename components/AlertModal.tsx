'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    title?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    message,
    type = 'info',
    title
}) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const icons = {
        info: <Info className="w-6 h-6 text-blue-500" />,
        success: <CheckCircle2 className="w-6 h-6 text-green-500" />,
        error: <XCircle className="w-6 h-6 text-red-500" />,
        warning: <AlertCircle className="w-6 h-6 text-amber-500" />,
    };

    const defaultTitles = {
        info: 'Bilgi',
        success: 'Başarılı',
        error: 'Hata',
        warning: 'Uyarı',
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="p-6 pt-8">
                    {/* Header/Icon */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${type === 'error' ? 'bg-red-50' :
                                type === 'success' ? 'bg-green-50' :
                                    type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                            }`}>
                            {icons[type]}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {title || defaultTitles[type]}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed px-2">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Footer/Button */}
                    <div className="mt-8">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-[#8B3D48] hover:bg-[#7A353F] text-white rounded-2xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-[#8B3D48]/20"
                        >
                            Tamam
                        </button>
                    </div>
                </div>

                {/* Close Icon (Optional) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
