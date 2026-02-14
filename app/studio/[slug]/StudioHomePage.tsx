'use client';

import { useState } from 'react';
import { Camera, ChevronDown, MessageCircle, Phone, Instagram, ArrowRight } from 'lucide-react';
import StudioHeader from '@/components/studio/StudioHeader';

interface Photographer {
    _id: string;
    name: string;
    studioName: string;
    slug: string;
    logo: string;
    bannerImage: string;
    primaryColor: string;
    aboutText: string;
    phone: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    portfolioPhotos: Array<{ url: string; title: string }>;
}

export default function StudioHomePage({ photographer }: { photographer: Photographer }) {
    const primaryColor = photographer.primaryColor || '#ec4899';
    const studioName = photographer.studioName || photographer.name || 'Stüdyo';

    const services = [
        { title: 'Düğün Hikayesi', image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80', description: 'En özel anlarınızın masalsı hikayesi.' },
        { title: 'Dış Çekim', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', description: 'Doğanın içinde aşkınızın yansıması.' },
        { title: 'Nişan & Söz', image: 'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80', description: 'İlk adımınızda yanınızdayız.' },
        { title: 'Save The Date', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80', description: 'Tarihinizi estetikle kaydedin.' },
    ];

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <StudioHeader photographer={photographer} primaryColor={primaryColor} />

            {/* Hero Section */}
            <section
                className="relative min-h-screen flex items-center justify-center pt-20"
                style={{
                    background: photographer.bannerImage
                        ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${photographer.bannerImage}) center/cover fixed`
                        : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}99 100%)`
                }}
            >
                <div className="text-center text-white px-6 max-w-4xl mx-auto animate-fade-in-up">
                    {photographer.logo && (
                        <img
                            src={photographer.logo}
                            alt={studioName}
                            className="h-24 md:h-32 w-auto mx-auto mb-8 drop-shadow-2xl"
                        />
                    )}

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-tight">
                        {studioName}
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                        {photographer.aboutText || 'Unutulmaz anlarınızı sonsuzluğa taşıyoruz.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <button
                            onClick={() => scrollToSection('gallery')}
                            className="px-10 py-4 bg-white text-gray-900 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                        >
                            Çalışmalarımızı İncele
                        </button>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('services')}>
                        <ChevronDown className="w-10 h-10 text-white/80 hover:text-white transition-colors" />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2 block">Hizmetlerimiz</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Neler Yapıyoruz?</h2>
                        <div className="w-24 h-1 mx-auto mt-6 rounded-full" style={{ backgroundColor: primaryColor }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div key={index} className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/80 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Preview Section */}
            {photographer.portfolioPhotos && photographer.portfolioPhotos.length > 0 && (
                <section id="gallery" className="py-24 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 p-4">
                            <div>
                                <span className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2 block">Portfolyo</span>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Son Çalışmalar</h2>
                            </div>
                            <div
                                onClick={() => scrollToSection('gallery')}
                                className="group flex items-center gap-2 font-semibold text-lg hover:gap-3 transition-all cursor-pointer"
                                style={{ color: primaryColor }}
                            >
                                Tüm Galeriyi Gör <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                            {photographer.portfolioPhotos.slice(0, 6).map((photo, index) => (
                                <div
                                    key={index}
                                    className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all ${index === 0 || index === 3 ? 'md:col-span-2' : ''
                                        }`}
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.title || 'Portfolio'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <ArrowRight className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section id="contact" className="py-24 px-4 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">İletişime Geçin</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Hayalinizdeki çekim için bizimle iletişime geçin. Sorularınızı yanıtlamaktan mutluluk duyarız.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {photographer.whatsapp && (
                            <a
                                href={`https://wa.me/${photographer.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-8 py-5 bg-green-500/10 border border-green-500/50 text-green-400 rounded-2xl font-bold text-lg hover:bg-green-500 hover:text-white transition-all duration-300"
                            >
                                <MessageCircle className="w-6 h-6" />
                                WhatsApp
                            </a>
                        )}
                        {photographer.phone && (
                            <a
                                href={`tel:${photographer.phone}`}
                                className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                            >
                                <Phone className="w-6 h-6" />
                                Ara: {photographer.phone}
                            </a>
                        )}
                        {photographer.instagram && (
                            <a
                                href={`https://instagram.com/${photographer.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-500/50 text-pink-400 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
                            >
                                <Instagram className="w-6 h-6" />
                                Instagram
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-4 bg-black text-center border-t border-white/10">
                <p className="text-gray-500 mb-2">
                    © {new Date().getFullYear()} {studioName}. Tüm hakları saklıdır.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4" />
                    <span>Powered by Weey.NET</span>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
