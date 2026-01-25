'use client';
import { Phone, Instagram, MessageCircle, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function WarmContact({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#8b4d62';
    const contacts = [
        { icon: Phone, label: 'Telefon', value: photographer.phone || '-', href: `tel:${photographer.phone}`, color: primaryColor },
        { icon: MessageCircle, label: 'WhatsApp', value: photographer.whatsapp || '-', href: `https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`, color: '#25D366' },
        { icon: Instagram, label: 'Instagram', value: photographer.instagram || '-', href: `https://instagram.com/${photographer.instagram?.replace('@', '')}`, color: '#E4405F' },
        { icon: Mail, label: 'E-posta', value: photographer.email || '-', href: `mailto:${photographer.email}`, color: '#EA4335' }
    ];

    return (
        <main style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 25%, #FBEAE3 50%, #FDF8F5 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                        <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-700">Bize Ulaşın</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>İletişim</h1>
                    <div className="w-16 h-1 mx-auto rounded-full mb-6" style={{ backgroundColor: primaryColor }} />
                    <p className="text-gray-600 max-w-md mx-auto">Hayalinizdeki çekim için bizimle iletişime geçin.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {contacts.map((c, i) => (
                        <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}><c.icon className="w-6 h-6" style={{ color: c.color }} /></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.label}</div>
                                <div className="text-gray-900 font-medium truncate">{c.value}</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        </a>
                    ))}
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center shadow-lg">
                    <p className="text-xl text-gray-700 italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>"En güzel hikayeler, doğru zamanda doğru yerde olmakla başlar."</p>
                    <span className="font-medium text-sm" style={{ color: primaryColor }}>— {photographer.studioName}</span>
                </div>
            </div>
        </main>
    );
}
