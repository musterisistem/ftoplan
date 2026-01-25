'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Package,
    Image as ImageIcon,
    Camera,
    Video,
    Plane,
    Users,
    Check,
    X,
    Trash2,
    Edit2,
    Save,
    CreditCard
} from 'lucide-react';

// Types
interface ShootPackage {
    id: string;
    name: string;
    tagline: string;
    price: number;
    currency: 'TL' | 'USD' | 'EUR';
    features: {
        albumSize: string;
        albumType: string;
        albumPages: number;
        familyAlbums: number;
        familyAlbumSize: string;
        posterSize: string;
        posterCount: number;
        extras: { name: string; price: number }[];
    };
    isPopular?: boolean;
    isActive: boolean;
}

// Initial Data
const INITIAL_PACKAGES: ShootPackage[] = [
    {
        id: '1',
        name: 'Gold Düğün Paketi',
        tagline: 'En çok tercih edilen eksiksiz düğün hikayesi',
        price: 15000,
        currency: 'TL',
        features: {
            albumSize: '30x50 Panoramik',
            albumType: 'Deri Kapak',
            albumPages: 10,
            familyAlbums: 2,
            familyAlbumSize: '15x21',
            posterSize: '50x70',
            posterCount: 1,
            extras: [
                { name: 'Drone Çekimi', price: 2500 },
                { name: 'Tüm Dijital Teslim', price: 0 },
                { name: 'Jimmy Jib', price: 3000 }
            ]
        },
        isPopular: true,
        isActive: true
    },
    {
        id: '2',
        name: 'Platin Dış Çekim',
        tagline: 'Dış mekan için premium deneyim',
        price: 8500,
        currency: 'TL',
        features: {
            albumSize: '35x65 Panoramik',
            albumType: 'Kristal Kapak',
            albumPages: 12,
            familyAlbums: 2,
            familyAlbumSize: '18x24',
            posterSize: '75x100',
            posterCount: 1,
            extras: [
                { name: 'Drone Çekimi', price: 2500 },
                { name: 'Video Klip (Teaser)', price: 1500 },
                { name: 'Reels Videosu', price: 1000 }
            ]
        },
        isActive: true
    }
];

export default function PackagesPage() {
    const [packages, setPackages] = useState<ShootPackage[]>(INITIAL_PACKAGES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<ShootPackage>>({
        name: '',
        tagline: '',
        price: 0,
        currency: 'TL',
        features: {
            albumSize: '30x50 Panoramik',
            albumType: 'Deri Kapak',
            albumPages: 10,
            familyAlbums: 2,
            familyAlbumSize: '15x21',
            posterSize: '50x70',
            posterCount: 1,
            extras: []
        },
        isPopular: false,
        isActive: true
    });

    const handleOpenModal = (pkg?: ShootPackage) => {
        if (pkg) {
            setEditingId(pkg.id);
            setFormData(pkg);
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                tagline: '',
                price: 0,
                currency: 'TL',
                features: {
                    albumSize: '30x50 Panoramik',
                    albumType: 'Deri Kapak',
                    albumPages: 10,
                    familyAlbums: 2,
                    familyAlbumSize: '15x21',
                    posterSize: '50x70',
                    posterCount: 1,
                    extras: []
                },
                isPopular: false,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingId) {
            setPackages(prev => prev.map(p => p.id === editingId ? { ...formData, id: editingId } as ShootPackage : p));
        } else {
            const newPackage = {
                ...formData,
                id: Math.random().toString(36).substr(2, 9)
            } as ShootPackage;
            setPackages([...packages, newPackage]);
        }
        setIsModalOpen(false);
    };

    const toggleExtra = (extraName: string) => {
        const currentExtras = formData.features?.extras || [];
        const exists = currentExtras.find(e => e.name === extraName);

        let newExtras;
        if (exists) {
            newExtras = currentExtras.filter(e => e.name !== extraName);
        } else {
            newExtras = [...currentExtras, { name: extraName, price: 0 }];
        }

        setFormData({
            ...formData,
            features: {
                ...formData.features!,
                extras: newExtras
            }
        });
    };

    const updateExtraPrice = (extraName: string, price: number) => {
        const currentExtras = formData.features?.extras || [];
        const newExtras = currentExtras.map(e =>
            e.name === extraName ? { ...e, price } : e
        );

        setFormData({
            ...formData,
            features: {
                ...formData.features!,
                extras: newExtras
            }
        });
    };

    const updateFeature = (field: string, value: any) => {
        setFormData({
            ...formData,
            features: {
                ...formData.features!,
                [field]: value
            }
        });
    };

    return (
        <div className="p-8 max-w-[1920px] mx-auto min-h-screen space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Çekim Paketleri</h2>
                    <p className="text-gray-500 text-sm">Müşterilerinize sunacağınız paketleri oluşturun ve yönetin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#5558DD] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Paket Oluştur
                </button>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="group relative bg-white rounded-3xl p-6 border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                        {pkg.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20">
                                EN ÇOK TERCİH EDİLEN
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{pkg.tagline}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-[#6366F1]">
                                    {pkg.price.toLocaleString('tr-TR')} <span className="text-sm text-gray-400">{pkg.currency}</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Album Info */}
                            <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-700">{pkg.features.albumSize}</p>
                                    <p className="text-[10px] text-gray-500">{pkg.features.albumType} • {pkg.features.albumPages} Sayfa</p>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-xs text-gray-600">
                                    <Users className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{pkg.features.familyAlbums} Adet Aile Albümü ({pkg.features.familyAlbumSize})</span>
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-600">
                                    <Image className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{pkg.features.posterCount} Adet Poster ({pkg.features.posterSize})</span>
                                </li>
                                {pkg.features.extras.map((extra, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                        <Check className="w-3.5 h-3.5 text-green-500" />
                                        <span>
                                            {extra.name}
                                            {extra.price > 0 && <span className="text-gray-400 ml-1">({extra.price.toLocaleString()} TL)</span>}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOpenModal(pkg)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Düzenle
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-[#F8FAFC] w-full max-w-6xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                        {/* Left Side - Form */}
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingId ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* General Info */}
                                <section className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <Package className="w-4 h-4 text-indigo-500" />
                                        Temel Bilgiler
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Paket Adı</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Örn: Gold Düğün Paketi"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Alt Başlık (Slogan)</label>
                                            <input
                                                type="text"
                                                value={formData.tagline}
                                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                placeholder="Örn: En çok tercih edilen..."
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Fiyat</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Para Birimi</label>
                                            <select
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                            >
                                                <option value="TL">TL (₺)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Album Details */}
                                <section className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                                        Albüm Özellikleri
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Albüm Boyutu</label>
                                            <select
                                                value={formData.features?.albumSize}
                                                onChange={(e) => updateFeature('albumSize', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                            >
                                                <option value="30x50 Panoramik">30x50 Panoramik</option>
                                                <option value="30x60 Panoramik">30x60 Panoramik</option>
                                                <option value="35x65 Panoramik">35x65 Panoramik</option>
                                                <option value="30x80 Panoramik">30x80 Panoramik</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Kapak Türü</label>
                                            <select
                                                value={formData.features?.albumType}
                                                onChange={(e) => updateFeature('albumType', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                            >
                                                <option>Deri Kapak</option>
                                                <option>Kristal Kapak</option>
                                                <option>Keten Kapak</option>
                                                <option>Ahşap Kapak</option>
                                                <option>Nubuk Kapak</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500">Sayfa Sayısı</label>
                                            <input
                                                type="number"
                                                value={formData.features?.albumPages}
                                                onChange={(e) => updateFeature('albumPages', Number(e.target.value))}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Extras */}
                                <section className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <Check className="w-4 h-4 text-indigo-500" />
                                        Ekstra Hizmetler
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            'Drone Çekimi',
                                            'Jimmy Jib',
                                            'Video Klip (Teaser)',
                                            'Video Klip (Tam)',
                                            'Reels Videosu',
                                            'Tüm Dijital Teslim',
                                            'Kanvas Tablo'
                                        ].map((extraName) => {
                                            const isSelected = formData.features?.extras?.find(e => e.name === extraName);

                                            return (
                                                <div key={extraName} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'bg-indigo-50 border-indigo-200'
                                                    : 'bg-white border-gray-200'
                                                    }`}>
                                                    <button
                                                        onClick={() => toggleExtra(extraName)}
                                                        className="flex items-center gap-3 flex-1 text-left"
                                                    >
                                                        <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${isSelected
                                                            ? 'bg-indigo-500 border-indigo-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                                                            {extraName}
                                                        </span>
                                                    </button>

                                                    {isSelected && (
                                                        <div className="flex items-center gap-2 pl-3 border-l border-indigo-200">
                                                            <input
                                                                type="number"
                                                                value={isSelected.price}
                                                                onChange={(e) => updateExtraPrice(extraName, Number(e.target.value))}
                                                                placeholder="0"
                                                                className="w-20 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 text-right"
                                                            />
                                                            <span className="text-xs font-bold text-indigo-400">TL</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Right Side - Preview */}
                        <div className="w-full md:w-[400px] bg-[#1E293B] p-8 flex flex-col items-center justify-center border-l border-white/10 relative overflow-hidden">
                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

                            <div className="relative w-full space-y-6">

                                <div className="text-center">
                                    <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">CANLI ÖNİZLEME</h4>
                                    <p className="text-white/40 text-[10px]">Müşteriler paketi bu şekilde görecek</p>
                                </div>

                                {/* Preview Card */}
                                <div className="bg-white rounded-3xl p-6 shadow-2xl overflow-hidden relative">
                                    {formData.isPopular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-b-xl text-[10px] font-bold shadow-lg">
                                            EN ÇOK TERCİH EDİLEN
                                        </div>
                                    )}

                                    <div className="text-center mb-6 mt-2">
                                        <h3 className="text-xl font-bold text-gray-900">{formData.name || 'Paket Adı'}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{formData.tagline || 'Paket açıklaması buraya gelecek'}</p>
                                        <div className="mt-4 pb-4 border-b border-gray-100">
                                            <span className="text-3xl font-black text-[#6366F1]">
                                                {formData.price?.toLocaleString() || 0}
                                            </span>
                                            <span className="text-sm text-gray-400 font-medium ml-1">{formData.currency}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                                            <ImageIcon className="w-4 h-4 text-indigo-500" />
                                            <span className="font-semibold">{formData.features?.albumSize}</span>
                                        </div>

                                        {formData.features?.extras?.map((extra, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>
                                                    {extra.name}
                                                    {extra.price > 0 && <span className="text-gray-400 ml-1">(+{extra.price.toLocaleString()} TL)</span>}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <button className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20">
                                            Paketi Seç
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Kaydet
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Image(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}
