'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MarqueePortfolioProps {
    photos: any[];
    isLight: boolean;
}

const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MarqueeRow = ({ images, direction = 'left', speed = 30 }: { images: any[], direction?: 'left' | 'right', speed?: number }) => {
    if (!images || images.length === 0) return null;

    // Duplicate images to ensure seamless loop
    // Ensure we have enough to cover screen width + buffer. 
    // If few images, repeat many times.
    const repeatedImages = [...images, ...images, ...images, ...images];

    return (
        <div className="flex overflow-hidden relative w-full py-4">
            <motion.div
                className="flex gap-4 min-w-max"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed * (images.length / 5), // Adjust duration based on count
                        ease: "linear",
                    },
                }}
            >
                {repeatedImages.map((img, idx) => (
                    <div key={`${img.url}-${idx}`} className="relative h-64 md:h-80 aspect-[3/4] rounded-xl overflow-hidden shadow-lg shrink-0">
                        <img
                            src={img.url}
                            alt={`Portfolio ${idx}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default function MarqueePortfolio({ photos, isLight }: MarqueePortfolioProps) {
    const [row1, setRow1] = useState<any[]>([]);
    const [row2, setRow2] = useState<any[]>([]);

    useEffect(() => {
        if (photos && photos.length > 0) {
            const shuffled = shuffleArray(photos);
            const mid = Math.ceil(shuffled.length / 2);
            setRow1(shuffled.slice(0, mid));
            setRow2(shuffled.slice(mid));
        } else {
            // Fallback placeholders using the 15 custom demo images
            const defaultDemoImages = Array.from({ length: 15 }, (_, i) => ({
                url: `https://fotoplan.b-cdn.net/demo/demof_${i + 1}.png`
            }));
            const shuffled = shuffleArray(defaultDemoImages);
            const mid = Math.ceil(shuffled.length / 2);
            setRow1(shuffled.slice(0, mid));
            setRow2(shuffled.slice(mid));
        }
    }, [photos]);

    const bgClass = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';

    return (
        <section className={`py-20 overflow-hidden ${bgClass}`}>
            <div className="mb-8 rotate-1">
                <MarqueeRow images={row1} direction="right" speed={40} />
            </div>
            <div className="-rotate-1">
                <MarqueeRow images={row2} direction="left" speed={45} />
            </div>
        </section>
    );
}
