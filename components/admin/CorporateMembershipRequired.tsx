'use client';

import { Crown, Globe, Sparkles, Palette, Mail, Zap, Check, ArrowRight } from 'lucide-react';

export default function CorporateMembershipRequired() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                {/* Main Card */}
                <div className="relative group">
                    {/* Animated Gradient Background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-40 transition-all duration-500 animate-gradient"></div>

                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-5">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
                        </div>

                        {/* Content */}
                        <div className="relative p-12">
                            {/* Icon Header */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                                        <Crown className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                Kurumsal Üyelik Gerekli
                            </h1>

                            {/* Subtitle */}
                            <p className="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                                Web site özelliklerine erişim için Kurumsal Üyeliğe sahip olmanız gerekmektedir.
                                Premium özelliklerin keyfini çıkarmak için kurumsal üyelik paketlerimizi inceleyin.
                            </p>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-2 gap-6 mb-12">
                                {[
                                    {
                                        icon: Globe,
                                        title: 'Kişisel Web Sitesi',
                                        description: 'Profesyonel portfolyo ve galeri sistemi'
                                    },
                                    {
                                        icon: Palette,
                                        title: 'Özel Tasarım',
                                        description: 'Markanıza özel tema ve renk düzenlemeleri'
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Sınırsız Galeri',
                                        description: 'İstediğiniz kadar fotoğraf ve albüm yükleyin'
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Premium Özellikler',
                                        description: 'Gelişmiş entegrasyonlar ve özel modüller'
                                    }
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group/item bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                                                <feature.icon className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-lg mb-1 group-hover/item:text-purple-300 transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Benefits List */}
                            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl p-8 mb-8 border border-purple-500/20">
                                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    Kurumsal Üyelik Avantajları
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        'Özel domain yönlendirme',
                                        'SEO optimizasyonu',
                                        'Profesyonel e-posta hesapları',
                                        'Öncelikli teknik destek',
                                        'Gelişmiş analitik raporlar',
                                        'Sosyal medya entegrasyonu'
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3 text-gray-300">
                                            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-green-400" />
                                            </div>
                                            <span className="text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="flex justify-center">
                                <button className="group/btn relative">
                                    {/* Button Glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

                                    {/* Button Content */}
                                    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl flex items-center gap-3 transform group-hover/btn:scale-105 transition-all duration-300">
                                        <Mail className="w-5 h-5 text-white" />
                                        <span className="text-white font-bold text-lg">
                                            Kurumsal Üyelik İçin Teklif Al
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-500 text-sm">
                                    Sorularınız için:{' '}
                                    <a href="mailto:info@fotoplan.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                                        info@fotoplan.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient Animation */}
            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
