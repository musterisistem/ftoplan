'use client';
import { Heart, Camera, Award, Users } from 'lucide-react';

export default function BoldAbout({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#7c2d3e';
    return (
        <main className="min-h-screen bg-[#FDF8F5] pt-24 pb-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-xs uppercase tracking-widest" style={{ color: primaryColor }}>Hikayemiz</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">Hakkımızda</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
                    <div>
                        <div className="text-7xl font-bold opacity-10 mb-2" style={{ color: primaryColor }}>01</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 -mt-10">{photographer.studioName}</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">{photographer.aboutText || "Profesyonel ekibimizle, en değerli anlarınızı ölümsüzleştiriyoruz."}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[{ icon: Camera, label: 'Yıl Deneyim', value: '10+' }, { icon: Heart, label: 'Mutlu Çift', value: '500+' }, { icon: Award, label: 'Ödül', value: '50+' }, { icon: Users, label: 'Takım', value: '15+' }].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
                                <stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: primaryColor }} />
                                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
