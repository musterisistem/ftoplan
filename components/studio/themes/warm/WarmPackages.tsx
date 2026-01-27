'use client';
import { Check, ArrowRight, Sparkles, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WarmPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const packages = [
        {
            name: 'DIŞ ÇEKİM',
            price: '₺8.000',
            features: ['2 Saat Çekim', '30 Düzenlenmiş Fotoğraf', 'Dijital Teslim', 'Mini Albüm'],
            highlight: false,
            icon: Sparkles,
            accent: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'DÜĞÜN HİKAYESİ',
            price: '₺25.000',
            features: ['Tüm Gün Çekim', 'Kuaför & Hazırlık', 'Video Klip (Reels)', 'Drone Çekimi', 'Panoramik Albüm Seti'],
            highlight: true,
            icon: Crown,
            accent: 'from-pink-500 to-rose-600'
        },
        {
            name: 'VIP PAKET',
            price: '₺40.000',
            features: ['Dış Çekim + Düğün Günü', 'Save The Date', '3 Dakika Sinematik Film', 'Aile Albümleri', 'Kanvas Tablo'],
            highlight: false,
            icon: Star,
            accent: 'from-purple-500 to-indigo-600'
        }
    ];

    const isLight = photographer.siteTheme === 'light';
    const showPrice = photographer.showPackagePrices === true;

    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const subText = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';

    return (
        <main className={`min-h-screen ${bgColor} ${textColor} pt-24 pb-24 px-4 md:px-6 font-sans relative overflow-hidden`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .font-syne { font-family: 'Syne', sans-serif; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                .float-slow { animation: float 8s ease-in-out infinite; }
                .float-medium { animation: float 6s ease-in-out infinite; }
                .float-fast { animation: float 4s ease-in-out infinite; }
            ` }} />

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 float-slow ${isLight ? 'bg-pink-400' : 'bg-pink-500'}`} />
                <div className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 float-medium ${isLight ? 'bg-purple-400' : 'bg-purple-500'}`} />
                <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 float-fast ${isLight ? 'bg-blue-400' : 'bg-blue-500'}`} />
            </div>

            <div className="max-w-7xl mx-auto w-full relative z-10">
                {/* Elegant Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className={`inline-block mb-6 px-6 py-2 rounded-full border ${isLight ? 'bg-white/60 border-pink-200' : 'bg-white/5 border-white/10'}`}>
                        <span className={`text-xs font-bold tracking-[0.3em] uppercase ${isLight ? 'text-[#831843]/60' : 'text-gray-400'}`}>
                            FİYATLANDIRMA
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-syne mb-6 tracking-tight">
                        Sizin İçin Özel
                        <span className={`block bg-gradient-to-r ${isLight ? 'from-[#831843] via-[#9D174D] to-pink-500' : 'from-white via-pink-300 to-purple-400'} bg-clip-text text-transparent`}>
                            Paketler
                        </span>
                    </h1>
                    <p className={`text-base md:text-lg ${subText} max-w-2xl mx-auto font-light leading-relaxed`}>
                        Her anınızı mükemmelleştirmek için tasarlanmış özenle hazırlanmış paketlerimiz
                    </p>
                </motion.div>

                {/* Premium Package Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {packages.map((pkg, index) => {
                        const Icon = pkg.icon;
                        const isHighlight = pkg.highlight;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`relative group ${isHighlight ? 'lg:scale-110 z-10' : ''}`}
                            >
                                {/* Card Container */}
                                <div className={`
                                    relative h-full rounded-3xl overflow-hidden
                                    ${isLight
                                        ? isHighlight
                                            ? 'bg-gradient-to-br from-[#831843] via-[#9D174D] to-pink-600 text-white shadow-2xl shadow-pink-900/30'
                                            : 'bg-white/70 backdrop-blur-xl border border-pink-100 shadow-xl shadow-pink-500/10'
                                        : isHighlight
                                            ? 'bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-pink-500/20'
                                            : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl'
                                    }
                                `}>

                                    {/* Decorative Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                                            backgroundSize: '24px 24px'
                                        }} />
                                    </div>

                                    {/* Top Badge/Ornament */}
                                    {isHighlight && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                            <div className={`
                                                px-5 py-2 rounded-full font-bold text-xs tracking-widest uppercase shadow-lg
                                                ${isLight
                                                    ? 'bg-white text-[#831843]'
                                                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                                }
                                            `}>
                                                ✨ EN POPÜLER
                                            </div>
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="relative p-8 md:p-10 flex flex-col h-full">
                                        {/* Icon & Title */}
                                        <div className="mb-8">
                                            <div className={`
                                                inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                                                ${isLight
                                                    ? isHighlight
                                                        ? 'bg-white/20 backdrop-blur-md'
                                                        : 'bg-pink-100'
                                                    : 'bg-white/10 backdrop-blur-md'
                                                }
                                            `}>
                                                <Icon className={`w-8 h-8 ${isLight ? isHighlight ? 'text-white' : 'text-[#831843]' : 'text-white'}`} />
                                            </div>
                                            <h3 className={`
                                                text-lg font-bold tracking-[0.15em] font-syne mb-3
                                                ${isLight ? isHighlight ? 'text-white/90' : 'text-[#831843]/70' : isHighlight ? 'text-white/90' : 'text-gray-400'}
                                            `}>
                                                {pkg.name}
                                            </h3>

                                            {/* Price */}
                                            {showPrice && (
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`
                                                        text-4xl md:text-5xl font-bold font-syne
                                                        ${isLight ? isHighlight ? 'text-white' : 'text-[#831843]' : 'text-white'}
                                                    `}>
                                                        {pkg.price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Elegant Divider */}
                                        <div className={`
                                            w-full h-px mb-8
                                            ${isLight
                                                ? isHighlight ? 'bg-white/20' : 'bg-pink-200'
                                                : 'bg-white/10'
                                            }
                                        `} />

                                        {/* Features List */}
                                        <ul className="space-y-4 mb-10 flex-grow">
                                            {pkg.features.map((f, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.15 + i * 0.1 }}
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className={`
                                                        mt-0.5 flex-shrink-0
                                                        ${isLight
                                                            ? isHighlight ? 'text-white/80' : 'text-[#831843]/50'
                                                            : isHighlight ? 'text-white/80' : 'text-pink-400/60'
                                                        }
                                                    `}>
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                    <span className={`
                                                        text-sm md:text-base font-medium leading-relaxed
                                                        ${isLight
                                                            ? isHighlight ? 'text-white/95' : 'text-[#9D174D]/90'
                                                            : isHighlight ? 'text-white/95' : 'text-gray-300'
                                                        }
                                                    `}>
                                                        {f}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <Link
                                            href={`/studio/${slug}/contact`}
                                            className={`
                                                group/btn relative w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase
                                                transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden
                                                ${isLight
                                                    ? isHighlight
                                                        ? 'bg-white text-[#831843] hover:shadow-xl hover:shadow-white/30'
                                                        : 'bg-gradient-to-r from-[#831843] to-[#9D174D] text-white hover:shadow-lg hover:shadow-pink-500/30'
                                                    : isHighlight
                                                        ? 'bg-white text-purple-600 hover:shadow-xl hover:shadow-white/30'
                                                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
                                                }
                                            `}
                                        >
                                            <span className="relative z-10">Rezervasyon Yap</span>
                                            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                        </Link>
                                    </div>

                                    {/* Decorative Corner Elements */}
                                    <div className={`
                                        absolute top-0 right-0 w-32 h-32 opacity-5
                                        bg-gradient-to-br ${pkg.accent}
                                        rounded-bl-full
                                    `} />
                                    <div className={`
                                        absolute bottom-0 left-0 w-24 h-24 opacity-5
                                        bg-gradient-to-tr ${pkg.accent}
                                        rounded-tr-full
                                    `} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className={`${subText} text-sm mb-4`}>
                        Size özel bir paket mi arıyorsunuz?
                    </p>
                    <Link
                        href={`/studio/${slug}/contact`}
                        className={`
                            inline-flex items-center gap-2 font-semibold text-sm tracking-wide
                            ${isLight ? 'text-[#831843] hover:text-[#9D174D]' : 'text-pink-400 hover:text-pink-300'}
                            transition-colors group
                        `}
                    >
                        Bizimle İletişime Geçin
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
