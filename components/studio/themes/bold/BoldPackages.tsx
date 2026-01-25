'use client';
import { Check, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BoldPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';
    const packages = [
        { name: 'Dış Çekim', price: '₺8.000', features: ['2 Saat', '30 Fotoğraf', 'Albüm'], highlight: false },
        { name: 'Düğün Hikayesi', price: '₺25.000', features: ['Tüm Gün', 'Video', 'Drone', 'Sınırsız Fotoğraf'], highlight: true },
        { name: 'VIP Paket', price: '₺40.000', features: ['Dış + Düğün', 'Save The Date', 'Kanvas', 'Reels'], highlight: false }
    ];
    return (
        <main className="min-h-screen bg-[#FDF8F5] pt-24 pb-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Hizmetlerimiz</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">Paketler</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg, index) => (
                        <div key={index} className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 ${pkg.highlight ? 'md:-mt-4 md:mb-4' : ''}`} style={pkg.highlight ? { boxShadow: `0 0 0 2px ${primaryColor}` } : {}}>
                            {pkg.highlight && <div className="py-2 text-center text-white text-xs font-bold uppercase" style={{ backgroundColor: primaryColor }}><Star className="w-3 h-3 inline mr-1" />En Popüler</div>}
                            <div className="p-8">
                                <div className="text-5xl font-bold opacity-10 mb-2" style={{ color: primaryColor }}>{String(index + 1).padStart(2, '0')}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 -mt-8">{pkg.name}</h3>
                                <div className="mb-6"><span className="text-3xl font-bold" style={{ color: primaryColor }}>{pkg.price}</span></div>
                                <ul className="space-y-3 mb-8">{pkg.features.map((f, i) => (<li key={i} className="flex items-center gap-3 text-gray-700"><div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}><Check className="w-3 h-3" style={{ color: primaryColor }} /></div><span className="text-sm">{f}</span></li>))}</ul>
                                <Link href={`https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`} target="_blank" className={`w-full py-4 rounded-full font-bold text-center flex items-center justify-center gap-2 transition-all ${pkg.highlight ? 'text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`} style={pkg.highlight ? { backgroundColor: primaryColor } : {}}>Teklif Al <ArrowRight className="w-4 h-4" /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
