'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

interface ModernHeroProps {
    studioName: string;
    bannerImage: string;
    logo?: string;
    primaryColor: string;
    heroSubtitle?: string;
}

export default function ModernHero({ studioName, bannerImage, logo, primaryColor, heroSubtitle }: ModernHeroProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Fallback image if no banner provided
    const bgImage = bannerImage || "https://fotoplan.b-cdn.net/demo/demof_1.png";

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mb-6 flex justify-center"
                >
                    {logo && (
                        <img
                            src={logo}
                            alt={studioName}
                            className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl"
                        />
                    )}
                </motion.div>

                {!logo && (
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-lg font-serif"
                    >
                        {studioName}
                    </motion.h1>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-gray-100 text-lg md:text-xl font-light tracking-widest uppercase mb-8"
                >
                    {heroSubtitle || "Photography & Cinema"}
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-px w-24 mx-auto bg-white/50 mb-8"
                />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <ChevronDown className="w-8 h-8 text-white/70" />
            </motion.div>
        </div>
    );
}
