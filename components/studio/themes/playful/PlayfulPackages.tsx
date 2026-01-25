'use client';
import { Check, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PlayfulPackages({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#f97316';
    const packages = [
        { name: 'Dış Çekim', price: '₺8.000', features: ['2 Saat', '30 Fotoğraf', 'Albüm'], highlight: false },
        { name: 'Düğün Hikayesi', price: '₺25.000', features: ['Tüm Gün', 'Video', 'Drone', 'Sınırsız Fotoğraf'], highlight: true },
        { name: 'VIP Paket', price: '₺40.000', features: ['Dış + Düğün', 'Save The Date', 'Kanvas', 'Reels'], highlight: false }
    ];
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'); .script-font { font-family: 'Dancing Script', cursive; }` }} />
            <main style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"><Star className="w-4 h-4" style={{ color: primaryColor }} /><span className="text-sm font-medium text-gray-700">Hizmetler</span></div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900"><span className="script-font italic" style={{ color: primaryColor }}>Paketler</span></h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {packages.map((pkg, index) => (
                            <div key={index} className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${pkg.highlight ? 'md:-mt-4 md:mb-4 ring-2' : ''}`} style={pkg.highlight ? { ringColor: primaryColor } : {}}>
                                {pkg.highlight && <div className="py-2 text-center text-white text-xs font-bold uppercase" style={{ backgroundColor: primaryColor }}><Star className="w-3 h-3 inline mr-1" />En Popüler</div>}
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{pkg.name}</h3>
                                    <div className="text-center mb-6"><span className="text-3xl font-bold" style={{ color: primaryColor }}>{pkg.price}</span></div>
                                    <ul className="space-y-3 mb-8">{pkg.features.map((f, i) => (<li key={i} className="flex items-center gap-3 text-gray-700"><div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}><Check className="w-3 h-3" style={{ color: primaryColor }} /></div><span className="text-sm">{f}</span></li>))}</ul>
                                    <Link href={`https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`} target="_blank" className={`w-full py-4 rounded-full font-bold text-center flex items-center justify-center gap-2 ${pkg.highlight ? 'text-white' : 'bg-gray-900 text-white'}`} style={pkg.highlight ? { backgroundColor: primaryColor } : {}}>Teklif Al <ArrowRight className="w-4 h-4" /></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
