'use client';
import { Sparkles, Heart, Camera, Award } from 'lucide-react';

export default function WarmAbout({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#8b4d62';

    return (
        <main style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #F5D5C8 25%, #FBEAE3 50%, #FDF8F5 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                        <Heart className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-sm font-medium text-gray-700">Hakkımızda</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>{photographer.studioName}</h1>
                    <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 mb-8">
                    <p className="text-gray-700 text-lg leading-relaxed text-center">
                        {photographer.aboutText || "Fotoğrafçılık bizim için sadece bir iş değil, anları ölümsüzleştirme sanatıdır."}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{ icon: Camera, label: 'Yıl', value: '10+' }, { icon: Heart, label: 'Çift', value: '500+' }, { icon: Award, label: 'Ödül', value: '15+' }, { icon: Sparkles, label: 'Proje', value: '1000+' }].map((stat, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
                            <stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: primaryColor }} />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
