'use client';
import { Star, Heart, Camera, Award } from 'lucide-react';

export default function PlayfulAbout({ photographer, slug }: { photographer: any; slug: string }) {
    const primaryColor = photographer.primaryColor || '#f97316';
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'); .script-font { font-family: 'Dancing Script', cursive; }` }} />
            <main style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #FDF6F0 50%, #FEF7F0 100%)' }} className="min-h-screen pt-24 pb-32 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"><Star className="w-4 h-4" style={{ color: primaryColor }} /><span className="text-sm font-medium text-gray-700">Hakkımızda</span></div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"><span className="script-font italic" style={{ color: primaryColor }}>{photographer.studioName}</span></h1>
                    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8"><p className="text-gray-700 text-lg leading-relaxed">{photographer.aboutText || "En özel gününüzü profesyonel ekibimizle ölümsüzleştirin."}</p></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[{ icon: Camera, label: 'Yıl', value: '10+' }, { icon: Heart, label: 'Çift', value: '500+' }, { icon: Award, label: 'Ödül', value: '15+' }, { icon: Star, label: 'Proje', value: '1000+' }].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-lg"><stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: primaryColor }} /><div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div><div className="text-xs text-gray-500 uppercase">{stat.label}</div></div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
