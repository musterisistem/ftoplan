'use client';
import { Phone, Instagram, MessageCircle, Mail, Sparkles, ArrowRight, MapPin } from 'lucide-react';

import { motion } from 'framer-motion';

export default function WarmContact({ photographer, slug }: { photographer: any; slug: string }) {
    // Define contact items with proper labeling
    const contacts = [
        {
            id: 'address',
            icon: MapPin,
            title: 'ADRES',
            value: photographer.address || null,
            href: photographer.address ? `https://maps.google.com/?q=${photographer.address}` : null,
            visible: !!photographer.address
        },
        {
            id: 'phone',
            icon: Phone,
            title: 'TELEFON',
            value: photographer.phone || '+90 555 000 0000',
            href: `tel:${photographer.phone}`,
            visible: true
        },
        {
            id: 'whatsapp',
            icon: MessageCircle,
            title: 'WHATSAPP',
            value: photographer.whatsapp || 'Mesaj Gönder',
            href: `https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`,
            visible: true
        },
        {
            id: 'email',
            icon: Mail,
            title: 'E-POSTA',
            value: photographer.email || 'hello@studio.com',
            href: `mailto:${photographer.email}`,
            visible: true
        }
    ];

    const isLight = photographer.siteTheme === 'light';

    // Palette: Cream (#FFFBF0), Pink (#FCE7F3), Dark Pink (#831843)
    const bgColor = isLight ? 'bg-[#FFFBF0]' : 'bg-[#0a0a0a]';
    const textColor = isLight ? 'text-[#831843]' : 'text-white';

    // Header colors
    const titleGradient = isLight
        ? 'from-[#831843] via-[#9D174D] to-pink-400' // Dark Pink gradient
        : 'from-white via-white to-white/40'; // Light text gradient

    const subText = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';

    // Card styles
    const cardGroupHover = isLight ? 'group-hover:text-pink-600' : 'group-hover:text-purple-400';
    const cardTitle = isLight ? 'text-[#831843]/60' : 'text-gray-500';
    const cardValue = isLight ? 'text-[#831843] group-hover:text-black' : 'text-white group-hover:text-gray-200';
    const lineBg = isLight ? 'bg-[#831843]/20' : 'bg-white/20';
    const lineActive = isLight ? 'bg-[#831843]' : 'bg-white';


    return (
        <main className={`min-h-screen ${bgColor} ${textColor} pt-32 pb-32 px-6 font-sans flex flex-col justify-center`}>
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            <div className="max-w-6xl mx-auto w-full">
                {/* Header Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 text-center md:text-left"
                >
                    <h1 className={`text-7xl md:text-9xl font-bold font-syne tracking-tighter mb-8 bg-gradient-to-br ${titleGradient} bg-clip-text text-transparent`}>
                        İLETİŞİM
                    </h1>
                    <p className={`text-xl md:text-2xl ${subText} font-light max-w-2xl leading-relaxed`}>
                        Hayalinizdeki projeyi gerçeğe dönüştürmek için buradayız. Aşağıdaki kanallardan bize ulaşabilirsiniz.
                    </p>
                </motion.div>

                {/* INFO TEXT GRID (No Boxes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                    {contacts.filter(c => c.visible).map((c, i) => (
                        <motion.a
                            key={i}
                            href={c.href || '#'}
                            target="_blank"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            className="group block"
                        >
                            <div className={`flex items-center gap-3 mb-4 ${cardTitle} ${cardGroupHover} transition-colors`}>
                                <c.icon className="w-5 h-5" />
                                <span className="text-xs font-bold tracking-[0.2em] uppercase font-syne">{c.title}</span>
                            </div>

                            <div className="relative overflow-hidden">
                                <h3 className={`text-xl md:text-2xl font-medium leading-snug transition-colors ${cardValue}`}>
                                    {c.value}
                                </h3>
                                {/* Hover Line Animation */}
                                <div className={`h-[1px] w-full ${lineBg} mt-6 relative overflow-hidden`}>
                                    <div className={`absolute inset-0 w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${lineActive}`} />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </main>
    );
}
