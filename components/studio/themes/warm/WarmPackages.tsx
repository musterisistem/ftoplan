'use client';
import { CheckCircle2, ArrowRight, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WarmPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const rawPackages = Array.isArray(photographer.packages) ? photographer.packages : [];

    const packages = rawPackages.map((pkg: any) => {
        const features: string[] = [];
        if (pkg.features?.albumSizes?.length > 0) features.push(`Albüm Ebatları: ${pkg.features.albumSizes.join(', ')}`);
        if (pkg.features?.albumTypes?.length > 0) features.push(`Kapak Seçenekleri: ${pkg.features.albumTypes.join(', ')}`);
        if (pkg.features?.albumPages > 0) features.push(`${pkg.features.albumPages} İç Sayfa Tasarımı`);
        if (pkg.features?.familyAlbums > 0) features.push(`${pkg.features.familyAlbums} Adet Aile Albümü (${pkg.features.familyAlbumSize || '-'})`);
        if (pkg.features?.posterCount > 0) features.push(`${pkg.features.posterCount} Adet Poster (${pkg.features.posterSize || '-'})`);
        if (pkg.features?.extras?.length > 0) pkg.features.extras.forEach((ext: any) => features.push(ext.name));
        return {
            id: pkg._id,
            name: pkg.name,
            tagline: pkg.tagline,
            features: features.length > 0 ? features : ['Özellik belirtilmemiş'],
            highlight: pkg.isPopular === true,
        };
    });

    const isLight = photographer.siteTheme === 'light';
    const pageBg  = isLight ? 'bg-[#FFFBF0]'   : 'bg-[#0a0a0a]';
    const textMain = isLight ? 'text-[#831843]'  : 'text-white';
    const textSub  = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';

    // Card colours
    const cardBg      = isLight ? 'bg-white/70 border border-pink-100'   : 'bg-white/5 border border-white/10';
    const cardHlBg    = isLight
        ? 'bg-gradient-to-br from-[#831843] via-[#9D174D] to-pink-600 text-white'
        : 'bg-gradient-to-br from-pink-600 via-purple-700 to-[#1a1a2e]  text-white';
    const featureText = isLight ? 'text-gray-700'   : 'text-gray-300';
    const checkColor  = isLight ? 'text-[#9D174D]'  : 'text-pink-400';

    return (
        <main className={`min-h-screen ${pageBg} ${textMain} pt-28 pb-28 px-4 md:px-8 relative overflow-hidden font-sans`}>
            {/* Background orbs */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes orb { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
                .orb { animation: orb 8s ease-in-out infinite; }
            `}} />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`orb absolute top-0 right-10 w-96 h-96 rounded-full blur-[100px] opacity-20 ${isLight ? 'bg-pink-400' : 'bg-pink-600'}`} />
                <div className={`orb absolute bottom-0 left-0  w-[500px] h-[500px] rounded-full blur-[130px] opacity-10 ${isLight ? 'bg-purple-300' : 'bg-purple-700'}`} style={{ animationDelay: '3s' }} />
            </div>

            {/* ——— Page header ——— */}
            <div className="max-w-5xl mx-auto text-center mb-20 relative z-10">
                <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
                    <div className={`inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-xs font-bold tracking-[.3em] uppercase backdrop-blur-md border ${isLight ? 'bg-white/60 border-pink-200/50 text-[#9D174D]/70' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                        <Sparkles className={`w-4 h-4 ${isLight ? 'text-pink-500' : 'text-pink-400'}`} />
                        HİZMETLER
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-syne tracking-tight mb-6">
                        Çekim{' '}
                        <span className={`bg-gradient-to-r ${isLight ? 'from-[#831843] via-[#9D174D] to-pink-500' : 'from-pink-300 via-purple-300 to-indigo-400'} bg-clip-text text-transparent`}>
                            Paketleri
                        </span>
                    </h1>
                    <p className={`text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed ${textSub}`}>
                        Hayalinizdeki anıları gerçeğe dönüştürmek için özenle hazırlanan paketlerimizi inceleyin.
                    </p>
                </motion.div>
            </div>

            {/* ——— Package cards ——— */}
            <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {packages.map((pkg: any, index: number) => {
                    const isHl = pkg.highlight;
                    return (
                        <motion.div
                            key={pkg.id || index}
                            initial={{ opacity:0, y:36 }}
                            whileInView={{ opacity:1, y:0 }}
                            viewport={{ once:true, margin:'-60px' }}
                            transition={{ duration:.65, delay: index * .12 }}
                            whileHover={{ y:-6, transition:{ duration:.25 } }}
                            className={`relative flex flex-col rounded-3xl overflow-hidden shadow-lg backdrop-blur-xl
                                ${isHl ? cardHlBg : cardBg}`}
                        >
                            {/* Popular badge */}
                            {isHl && (
                                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-[11px] font-bold tracking-widest uppercase">
                                    <Heart className="w-3 h-3 fill-pink-200 text-pink-200" /> EN POPÜLER
                                </div>
                            )}

                            {/* ── Card body ── */}
                            <div className="flex flex-col flex-1 p-8 gap-6">

                                {/* Package title + tagline */}
                                <div>
                                    <h2 className={`text-2xl md:text-3xl font-syne font-bold leading-tight mb-2 ${isHl ? 'text-white' : textMain}`}>
                                        {pkg.name}
                                    </h2>
                                    {pkg.tagline && (
                                        <p className={`text-sm md:text-base ${isHl ? 'text-white/70' : textSub}`}>
                                            {pkg.tagline}
                                        </p>
                                    )}
                                </div>

                                {/* Thin divider */}
                                <div className={`w-full h-px ${isHl ? 'bg-white/20' : isLight ? 'bg-pink-200' : 'bg-white/10'}`} />

                                {/* ── Features list ── */}
                                <ul className="flex-1 space-y-3">
                                    {pkg.features.map((f: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHl ? 'text-pink-200' : checkColor}`} />
                                            <span className={`text-sm md:text-base leading-relaxed ${isHl ? 'text-white/90' : featureText}`}>
                                                {f}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* ── CTA button ── */}
                                <div className="pt-4">
                                    <Link
                                        href={`/studio/${slug}/contact`}
                                        className={`group/btn inline-flex w-full items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300
                                            ${isHl
                                                ? 'bg-white text-[#831843] hover:shadow-xl hover:shadow-white/20'
                                                : isLight
                                                    ? 'bg-gradient-to-r from-[#831843] to-[#9D174D] text-white hover:shadow-lg hover:shadow-pink-900/20'
                                                    : 'bg-white text-black hover:shadow-lg'
                                            }`}
                                    >
                                        Rezervasyon Yap
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </main>
    );
}
