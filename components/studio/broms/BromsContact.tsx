'use client';

import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface BromsContactProps {
    photographer: any;
}

export default function BromsContact({ photographer }: BromsContactProps) {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="max-w-4xl mx-auto mb-24">
                    {/* Contact Info */}
                    <div>
                        <div className="text-2xl font-bold tracking-tighter mb-8 font-syne uppercase">İletişim</div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white group-hover:text-black transition-colors"><Mail className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">Email</div>
                                    <div className="font-medium">{photographer.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 rounded-full group-hover:bg-white group-hover:text-black transition-colors"><Phone className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">Telefon / WhatsApp</div>
                                    <div className="font-medium flex flex-col">
                                        <span>{photographer.phone}</span>
                                        {photographer.whatsapp && <span className="text-sm text-gray-400">WP: {photographer.whatsapp}</span>}
                                    </div>
                                </div>
                            </div>

                            {photographer.address && (
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-full group-hover:bg-white group-hover:text-black transition-colors"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">Adres</div>
                                        <div className="font-medium max-w-xs">{photographer.address}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Bottom (Simplified) */}
                <div className="pt-8 border-t border-white/10 text-center">
                    <div className="text-sm font-medium tracking-widest text-gray-500 uppercase">
                        {photographer.studioName}
                    </div>
                </div>
            </div>
        </footer>
    );
}
