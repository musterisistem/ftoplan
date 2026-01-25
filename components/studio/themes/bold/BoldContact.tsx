'use client';
import { Phone, Instagram, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BoldContact({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';
    const contacts = [
        { icon: Phone, label: 'Telefon', value: photographer.phone || '-', href: `tel:${photographer.phone}` },
        { icon: MessageCircle, label: 'WhatsApp', value: photographer.whatsapp || '-', href: `https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}` },
        { icon: Instagram, label: 'Instagram', value: photographer.instagram || '-', href: `https://instagram.com/${photographer.instagram?.replace('@', '')}` },
        { icon: Mail, label: 'E-posta', value: photographer.email || '-', href: `mailto:${photographer.email}` }
    ];
    return (
        <main className="min-h-screen bg-[#FDF8F5]">
            <section className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Bize Ulaşın</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">İletişim</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contacts.map((c, i) => (
                            <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}><c.icon className="w-6 h-6" style={{ color: primaryColor }} /></div>
                                <div className="flex-1 min-w-0"><div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.label}</div><div className="text-gray-900 font-medium truncate">{c.value}</div></div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 px-6" style={{ backgroundColor: primaryColor }}>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hikayenizi Anlatmaya Hazır mısınız?</h2>
                    <p className="text-white/70 mb-8">Size özel teklif almak için hemen iletişime geçin</p>
                    <Link href={`https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">WhatsApp ile Ulaşın <ArrowRight className="w-5 h-5" /></Link>
                </div>
            </section>
        </main>
    );
}
