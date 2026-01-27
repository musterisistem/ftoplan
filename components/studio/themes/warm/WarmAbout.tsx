'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WarmAbout({ photographer, slug }: { photographer: any; slug: string }) {
    const isLight = photographer.siteTheme === 'light';

    // Palette settings
    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const subTextColor = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';
    const accentColor = isLight ? 'bg-pink-500/10' : 'bg-white/5';

    return (
        <main className={`min-h-screen ${bgColor} ${textColor} pt-32 pb-40 px-6 font-sans relative overflow-hidden flex flex-col items-center justify-center`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .font-syne { font-family: 'Syne', sans-serif; }
                .text-outline {
                    -webkit-text-stroke: 1px currentColor;
                    color: transparent;
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, -20px); }
                }
                .animate-slow-float {
                    animation: float 15s ease-in-out infinite;
                }
            ` }} />

            {/* Background Decorative Text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
                <h2 className="text-[25vw] font-black font-syne whitespace-nowrap leading-none uppercase tracking-tighter">
                    {photographer.studioName || "HAKKIMIZDA"}
                </h2>
            </div>

            {/* Floating Accents */}
            <div className={`absolute top-1/4 -right-20 w-80 h-80 rounded-full blur-[120px] ${isLight ? 'bg-pink-300/30' : 'bg-pink-900/10'} animate-slow-float`} />
            <div className={`absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-[150px] ${isLight ? 'bg-rose-300/30' : 'bg-rose-900/10'} animate-slow-float`} style={{ animationDirection: 'reverse' }} />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-16"
                >
                    {/* Artistic Header Section */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className={`w-20 h-[2px] ${isLight ? 'bg-[#831843]' : 'bg-white'}`}
                        />
                        <h1 className="text-xs font-bold tracking-[0.6em] uppercase opacity-60">
                            HİKAYEMİZ
                        </h1>
                    </div>

                    {/* Main Content Area */}
                    <div className="relative pt-10">
                        {/* Decorative Quote Mark */}
                        <span className={`absolute -top-4 -left-8 text-[120px] font-serif italic ${isLight ? 'text-pink-100' : 'text-white/5'} leading-none select-none`}>
                            “
                        </span>

                        <div className="space-y-12">
                            <h2 className="text-4xl md:text-7xl font-bold font-syne tracking-tight leading-[1.1] text-center">
                                {photographer.studioName}
                            </h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 1.5 }}
                                className={`text-xl md:text-3xl lg:text-4xl ${subTextColor} text-center font-medium leading-[1.5] font-syne antialiased max-w-3xl mx-auto`}
                            >
                                {photographer.aboutText || "Her çekim bizim için yeni bir hikaye, her kare ise ölümsüzleşen birer hatıradır. Profesyonel bakış açımız ve sanatsal dokunuşlarımızla hayatınızın en özel anlarını estetik bir dille anlatıyoruz."}
                            </motion.p>
                        </div>

                        {/* Reverse Quote Mark */}
                        <span className={`absolute -bottom-20 -right-8 text-[120px] font-serif italic ${isLight ? 'text-pink-100' : 'text-white/5'} leading-none select-none`}>
                            ”
                        </span>
                    </div>

                    {/* Footer / Contact Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex flex-col items-center space-y-8"
                    >
                        <div className={`h-24 w-[1px] ${isLight ? 'bg-[#831843]/20' : 'bg-white/10'}`} />
                        <Link
                            href={`/studio/${slug}/contact`}
                            className={`
                                group relative px-10 py-5 rounded-full overflow-hidden transition-all duration-500
                                ${isLight
                                    ? 'bg-[#831843] text-white hover:shadow-2xl hover:shadow-pink-900/20'
                                    : 'bg-white text-black hover:bg-gray-100'
                                }
                            `}
                        >
                            <span className="relative z-10 text-sm font-bold tracking-[0.2em] uppercase">
                                BİZE ULAŞIN
                            </span>
                            <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full transition-all duration-300 bg-white/10 z-0" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Visual Accents in corners */}
            <div className={`absolute bottom-10 right-10 flex gap-1 ${isLight ? 'text-[#831843]/20' : 'text-white/10'}`}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-current" />
                ))}
            </div>
        </main>
    );
}
