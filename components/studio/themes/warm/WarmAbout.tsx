'use client';
import { Sparkles, Heart, Camera, Award } from 'lucide-react';

import { motion } from 'framer-motion';

export default function WarmAbout({ photographer, slug }: { photographer: any; slug: string }) {

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-32 px-6 font-sans relative overflow-hidden flex items-center justify-center">
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Decorative Line */}
                    <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto mb-12" />

                    <h1 className="text-5xl md:text-7xl font-bold font-syne mb-12 tracking-tighter leading-tight">
                        {photographer.studioName}
                    </h1>

                    <div className="space-y-8">
                        <p className="text-xl md:text-3xl text-gray-300 font-light leading-relaxed font-syne antialiased">
                            "{photographer.aboutText || "Biz, anları sadece kaydetmez, onları sonsuz birer sanat eserine dönüştürürüz. Işığın ve gölgenin dansıyla hikayenizi anlatmak için buradayız."}"
                        </p>
                    </div>

                    {/* Decorative Signature/Element */}
                    <div className="mt-16 pt-16 border-t border-white/5">
                        <span className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
                            EST. 2024
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
