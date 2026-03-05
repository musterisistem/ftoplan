'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Loader2, Award, Users, TrendingUp, MapPin } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

interface Reference {
    _id: string;
    companyName: string;
    logoUrl: string;
    website: string;
}

export default function ReferanslarPage() {
    const [references, setReferences] = useState<Reference[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/references')
            .then(r => r.json())
            .then(data => setReferences(Array.isArray(data) ? data : []))
            .catch(() => setReferences([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#f8faff] text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Decorative BG */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-8%] right-[-8%] w-[700px] h-[700px] bg-purple-100/40 rounded-full blur-[130px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[110px]" />
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-fuchsia-50/60 rounded-full blur-[90px]" />
                {/* Subtle dot grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#5d2b72" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44 lg:pb-32">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mb-16 w-full"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[11px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-[#5d2b72]" /> Güvenilir Referanslarımız
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                        Bize Güvenen{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] via-purple-600 to-fuchsia-500">
                            Stüdyolar
                        </span>
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                        Türkiye'nin önde gelen fotoğraf stüdyoları Weey.NET ile işlerini dijitale taşıdı.
                        Her gün yeni stüdyolar aramıza katılıyor.
                    </p>
                </motion.div>



                {/* Logo Grid */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-[#5d2b72]" />
                    </div>
                ) : references.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg font-medium">Referanslar yakında eklenecek</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {references.map((ref, i) => {
                            const card = (
                                <motion.div
                                    key={ref._id}
                                    initial={{ opacity: 0, scale: 0.93 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.35 }}
                                    className="group bg-white rounded-2xl overflow-hidden transition-all duration-300"
                                    style={{
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.14)')}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)')}
                                >
                                    {/* Logo area — pure white bg */}
                                    <div className="h-40 flex items-center justify-center p-6 bg-white relative">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={ref.logoUrl}
                                                alt={ref.companyName}
                                                fill
                                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                    {/* Company Name */}
                                    <div className="px-4 py-3 text-center border-t border-slate-100">
                                        <p className="text-[13px] font-normal text-slate-500 group-hover:text-[#5d2b72] transition-colors truncate">
                                            {ref.companyName}
                                        </p>
                                    </div>
                                </motion.div>
                            );

                            return ref.website
                                ? <a key={ref._id} href={ref.website} target="_blank" rel="noopener noreferrer">{card}</a>
                                : <div key={ref._id}>{card}</div>;
                        })}
                    </div>
                )}


            </main>

            <PublicFooter />
        </div>
    );
}
