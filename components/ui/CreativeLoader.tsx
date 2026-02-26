'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CreativeLoaderProps {
    message?: string;
    subMessage?: string;
    isVisible?: boolean;
}

export default function CreativeLoader({
    message = "Hazırlanıyor...",
    subMessage = "Lütfen bekleyin, sistem ayarlanıyor.",
    isVisible = true
}: CreativeLoaderProps) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0612]/95 backdrop-blur-2xl overflow-hidden"
                >
                    {/* Atmospheric Background Blobs */}
                    <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="relative flex flex-col items-center">
                        {/* Double Orbit Rings */}
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* Outer Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-t-purple-500/50 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            />

                            {/* Inner Ring - Opposite Direction */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border-2 border-t-indigo-400/40 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            />

                            {/* Glowing Core with Logo */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="relative z-10 w-24 h-24 bg-gradient-to-br from-[#1a0b2e] to-[#0a0612] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.3)] border border-white/10"
                            >
                                <img
                                    src="/logoweey.png"
                                    alt="Weey"
                                    className="w-16 h-auto brightness-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </motion.div>

                            {/* Orbiting Particle */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                            </motion.div>
                        </div>

                        {/* Typography & Status */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 text-center"
                        >
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                                {message}
                                <span className="inline-block w-8 text-left">{dots}</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-sm md:text-base max-w-xs mx-auto">
                                {subMessage}
                            </p>
                        </motion.div>

                        {/* Progress Bar (Visual Only) */}
                        <div className="mt-8 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 10, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                            />
                        </div>

                        {/* Branding */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-20 flex flex-col items-center gap-2"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">
                                Powered By
                            </span>
                            <p className="text-xs font-bold text-slate-300 tracking-widest uppercase">
                                Weey Digital Suite
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
