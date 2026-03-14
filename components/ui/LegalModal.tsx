'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, onConfirm, title, content }: LegalModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col h-[80vh] overflow-hidden border border-slate-100"
                >
                    {/* Header */}
                    <div className="flex-none px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-20">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                        <div className="text-slate-600 text-[15px] leading-relaxed space-y-4">
                            {content}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-none p-5 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
                        <p className="text-[13px] text-slate-500 font-medium">
                            Devam etmek için metni onaylamanız gerekmektedir.
                        </p>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="w-full md:w-auto px-8 py-3 bg-[#5d2b72] text-white rounded-xl font-bold text-sm hover:bg-[#4a225b] transition-all active:scale-[0.98] shadow-sm"
                        >
                            Okudum, Onaylıyorum
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
