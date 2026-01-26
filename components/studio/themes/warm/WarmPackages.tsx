'use client';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function WarmPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const packages = [
        { name: 'Dış Çekim', price: '₺8.000', features: ['2 Saat', '30 Fotoğraf', 'Albüm'], highlight: false },
        { name: 'Düğün Hikayesi', price: '₺25.000', features: ['Tüm Gün', 'Video', 'Drone', 'Sınırsız Fotoğraf'], highlight: true },
        { name: 'VIP Paket', price: '₺40.000', features: ['Dış + Düğün', 'Save The Date', 'Kanvas', 'Reels'], highlight: false }
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-32 px-6 font-sans">
            <style dangerouslySetInnerHTML={{ __html: `.font-syne { font-family: 'Syne', sans-serif; }` }} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-16 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-bold font-syne mb-4">Paketler</h1>
                    <p className="text-gray-400 max-w-xl">Size özel hazırladığımız çekim paketleri.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div key={index} className={`relative p-8 rounded-2xl border ${pkg.highlight ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-white/10 text-white'} transition-all hover:-translate-y-2`}>
                            {pkg.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold uppercase py-1 px-3 rounded-full">En Popüler</div>}

                            <h3 className={`text-xl font-bold mb-4 font-syne ${pkg.highlight ? 'text-black' : 'text-white'}`}>{pkg.name}</h3>
                            <div className="text-3xl font-bold mb-8">{pkg.price}</div>

                            <ul className="space-y-4 mb-10">
                                {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className={`w-5 h-5 ${pkg.highlight ? 'text-black' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${pkg.highlight ? 'text-gray-800' : 'text-gray-300'}`}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={`https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`} target="_blank" className={`w-full py-4 rounded-lg font-bold text-center block transition-all ${pkg.highlight ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}>
                                Teklif Al
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
