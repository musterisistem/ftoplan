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
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(93,43,114,0.15)] flex flex-col h-[80vh] md:h-[85vh] border border-white/20 overflow-hidden"
                >
                    {/* Header - Fixed Height */}
                    <div className="flex-none p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#5d2b72]">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">{title}</h2>
                                <p className="text-[11px] text-purple-400 font-bold uppercase tracking-widest mt-0.5">Yürürlükte olan güncel metin</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-300 hover:text-slate-600 active:scale-95"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content - Robust Flex Scroll */}
                    <div className="flex-1 min-h-0 relative bg-white overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 overscroll-contain scroll-smooth custom-scrollbar">
                            <div className="max-w-none text-slate-600 text-sm md:text-base leading-relaxed">
                                {content}

                                {/* Bottom Spacer */}
                                <div className="h-10 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Footer - Fixed Height */}
                    <div className="flex-none p-6 md:p-8 bg-slate-50/50 backdrop-blur-sm border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
                        <div className="flex items-center gap-3 text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-purple-300" />
                            <p className="text-[12px] font-medium leading-tight">
                                Devam etmek için metnin<br className="hidden md:block" /> tamamını okuduğunuzu onaylayın.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="w-full md:w-auto px-10 py-4 bg-[#5d2b72] text-white rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-2 hover:bg-[#4a225b] hover:shadow-xl hover:shadow-purple-900/20 active:scale-95 transition-all"
                        >
                            Okudum, Anladım
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
