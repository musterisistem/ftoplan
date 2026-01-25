'use client';

import { useState } from 'react';
import { Package, Check, Server, Users, Calendar, Zap } from 'lucide-react';

const packages = [
    {
        id: 'starter',
        name: 'Başlangıç',
        price: 999,
        storage: 20,
        color: 'from-blue-500 to-cyan-500',
        features: [
            '20 GB Depolama',
            'Sınırsız Müşteri',
            'Albüm Paylaşımı',
            'Temel Destek'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 1999,
        storage: 50,
        color: 'from-purple-500 to-pink-500',
        popular: true,
        features: [
            '50 GB Depolama',
            'Sınırsız Müşteri',
            'Albüm Paylaşımı',
            'Öncelikli Destek',
            'Özel Marka (White Label)',
            'Gelişmiş Raporlar'
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 3499,
        storage: 100,
        color: 'from-amber-500 to-orange-500',
        features: [
            '100 GB Depolama',
            'Sınırsız Müşteri',
            'Albüm Paylaşımı',
            '7/24 VIP Destek',
            'Özel Marka (White Label)',
            'Gelişmiş Raporlar',
            'API Erişimi',
            'Özel Domain'
        ]
    }
];

export default function PackagesPage() {
    const [editingPackage, setEditingPackage] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Paket Yönetimi</h1>
                <p className="text-gray-400">Abonelik paketlerini ve fiyatlarını yönetin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Başlangıç Paket', count: 0, icon: Package, color: 'blue' },
                    { label: 'Pro Paket', count: 0, icon: Zap, color: 'purple' },
                    { label: 'Premium Paket', count: 0, icon: Crown, color: 'amber' },
                    { label: 'Toplam Gelir', count: '₺0', icon: Users, color: 'green' }
                ].map((stat, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-${stat.color}-500/20 rounded-lg`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-xl font-bold text-white">{stat.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`relative bg-gray-800/50 rounded-2xl border ${pkg.popular ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-white/10'} overflow-hidden`}
                    >
                        {pkg.popular && (
                            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full">
                                En Popüler
                            </div>
                        )}

                        {/* Header */}
                        <div className={`p-6 bg-gradient-to-br ${pkg.color} bg-opacity-10`}>
                            <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-3xl font-bold text-white">₺{pkg.price.toLocaleString()}</span>
                                <span className="text-gray-400">/yıl</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Server className="w-5 h-5 text-purple-400" />
                                <span className="font-medium">{pkg.storage} GB Depolama</span>
                            </div>

                            <ul className="space-y-3">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-white/10">
                            <button
                                onClick={() => setEditingPackage(pkg.id)}
                                className="w-full py-2 text-sm text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
                            >
                                Paketi Düzenle
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">📝 Not</h3>
                <p className="text-gray-400 text-sm">
                    Paket fiyatları ve özellikleri şu an için sabit tanımlıdır. İlerleyen sürümlerde
                    dinamik paket yönetimi ve ödeme entegrasyonu (İyzico, Stripe) eklenecektir.
                </p>
            </div>
        </div>
    );
}

function Crown(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
        </svg>
    );
}
