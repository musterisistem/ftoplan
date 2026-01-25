'use client';
import { Phone, Instagram, MessageCircle, Mail, Star, ArrowRight } from 'lucide-react';

export default function PlayfulContact({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#f97316';
    const contacts = [
        { icon: Phone, label: 'Telefon', value: photographer.phone || '-', href: `tel:${photographer.phone}`, color: primaryColor },
        { icon: MessageCircle, label: 'WhatsApp', value: photographer.whatsapp || '-', href: `https://wa.me/${photographer.whatsapp?.replace(/\D/g, '')}`, color: '#25D366' },
        { icon: Instagram, label: 'Instagram', value: photographer.instagram || '-', href: `https://instagram.com/${photographer.instagram?.replace('@', '')}`, color: '#E4405F' },
        { icon: Mail, label: 'E-posta', value: photographer.email || '-', href: `mailto:${photographer.email}`, color: '#EA4335' }
    ];
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'); .script-font { font-family: 'Dancing Script', cursive; }` }} />
            <main style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"><Star className="w-4 h-4" style={{ color: primaryColor }} /><span className="text-sm font-medium text-gray-700">Bize Ulaşın</span></div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900"><span className="script-font italic" style={{ color: primaryColor }}>İletişim</span></h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                        {contacts.map((c, i) => (
                            <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${c.color}15` }}><c.icon className="w-6 h-6" style={{ color: c.color }} /></div>
                                <div className="flex-1 min-w-0"><div className="text-xs text-gray-500 uppercase mb-1">{c.label}</div><div className="text-gray-900 font-medium truncate">{c.value}</div></div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
