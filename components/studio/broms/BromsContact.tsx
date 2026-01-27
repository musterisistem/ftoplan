'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

interface BromsContactProps {
    photographer: any;
    isLight?: boolean;
}

export default function BromsContact({ photographer, isLight = false }: BromsContactProps) {
    // Palette: Cream (#FFFBF0), Pink (#FCE7F3), Dark Pink (#831843)

    // Light Mode: Very Light Pink/Cream Footer with Dark Pink Text
    // Dark Mode: Black Footer with White Text
    const bgColor = isLight ? 'bg-[#FDF2F8]' : 'bg-black'; // Pink-50
    const textColor = isLight ? 'text-[#831843]' : 'text-white';
    const borderColor = isLight ? 'border-[#831843]/10' : 'border-white/5';

    // Icons
    const iconBg = isLight
        ? 'bg-[#831843]/5 group-hover:bg-[#831843] group-hover:text-white'
        : 'bg-white/5 group-hover:bg-white group-hover:text-black';

    const subText = isLight ? 'text-[#9D174D]/70' : 'text-gray-400';

    return (
        <footer className={`${bgColor} ${textColor} pt-24 pb-12 border-t ${borderColor}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="max-w-4xl mx-auto mb-24">
                    {/* Contact Info */}
                    <div>
                        <div className="text-2xl font-bold tracking-tighter mb-8 font-syne uppercase">İletişim</div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className={`p-3 rounded-full transition-colors ${iconBg}`}><Mail className="w-5 h-5" /></div>
                                <div>
                                    <div className={`text-xs uppercase tracking-widest ${subText}`}>Email</div>
                                    <div className="font-medium">{photographer.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className={`p-3 rounded-full transition-colors ${iconBg}`}><Phone className="w-5 h-5" /></div>
                                <div>
                                    <div className={`text-xs uppercase tracking-widest ${subText}`}>Telefon / WhatsApp</div>
                                    <div className="font-medium flex flex-col">
                                        <span>{photographer.phone}</span>
                                        {photographer.whatsapp && <span className={`text-sm mt-1 opacity-70`}>WP: {photographer.whatsapp}</span>}
                                    </div>
                                </div>
                            </div>

                            {photographer.address && (
                                <div className="flex items-center gap-4 group">
                                    <div className={`p-3 rounded-full transition-colors ${iconBg}`}><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <div className={`text-xs uppercase tracking-widest ${subText}`}>Adres</div>
                                        <div className="font-medium max-w-xs">{photographer.address}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Bottom (Simplified) */}
                <div className={`pt-8 border-t ${borderColor} text-center`}>
                    <div className={`text-sm font-medium tracking-widest uppercase ${subText}`}>
                        {photographer.studioName}
                    </div>
                </div>
            </div>
        </footer>
    );
}
