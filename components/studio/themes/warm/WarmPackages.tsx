'use client';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function WarmPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#8b4d62';
    const packages = [
        { name: 'Dış Çekim', price: '₺8.000', features: ['2 Saat', '30 Fotoğraf', 'Albüm'], highlight: false },
        { name: 'Düğün Hikayesi', price: '₺25.000', features: ['Tüm Gün', 'Video', 'Drone', 'Sınırsız Fotoğraf'], highlight: true },
        { name: 'VIP Paket', price: '₺40.000', features: ['Dış + Düğün', 'Save The Date', 'Kanvas', 'Reels'], highlight: false }
    ];

    return (
        <main style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 25%, #FBEAE3 50%, #FDF8F5 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                        <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-700">Hizmetlerimiz</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Paketler</h1>
                    <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg, index) => (
                        <div key={index} className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden ${pkg.highlight ? 'md:-mt-4 md:mb-4' : ''}`} style={pkg.highlight ? { boxShadow: `0 0 0 2px ${primaryColor}` } : {}}>
                            {pkg.highlight && <div className="py-2 text-center text-white text-xs font-bold uppercase" style={{ backgroundColor: primaryColor }}><Star className="w-3 h-3 inline mr-1" />En Popüler</div>}
                            <div className={`p-8 ${pkg.highlight ? '' : 'pt-8'}`}>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Georgia, serif' }}>{pkg.name}</h3>
                                <div className="text-center mb-6"><span className="text-3xl font-bold" style={{ color: primaryColor }}>{pkg.price}</span></div>
                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}><Check className="w-3 h-3" style={{ color: primaryColor }} /></div>
                                            <span className="text-sm">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`} target="_blank" className={`w-full py-4 rounded-full font-semibold text-center flex items-center justify-center gap-2 transition-all ${pkg.highlight ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={pkg.highlight ? { backgroundColor: primaryColor } : {}}>Teklif Al <ArrowRight className="w-4 h-4" /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
