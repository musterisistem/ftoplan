'use client';

import { useState, useEffect } from 'react';
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
    CreditCard,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types (Reflecting MongoDB Schema)
interface ShootPackage {
    _id?: string;
    id?: string; // Fallback for UI if needed
    name: string;
    tagline: string;
    price: number;
    currency: 'TL' | 'USD' | 'EUR';
    features: {
        albumSizes: string[];
        albumTypes: string[];
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

const DEFAULT_FORM_DATA: Partial<ShootPackage> = {
    name: '',
    tagline: '',
    price: 0,
    currency: 'TL',
    features: {
        albumSizes: [],
        albumTypes: [],
        albumPages: 10,
        familyAlbums: 2,
        familyAlbumSize: '15x21',
        posterSize: '50x70',
        posterCount: 1,
        extras: []
    },
    isPopular: false,
    isActive: true
};

export default function PackagesPage() {
    const [packages, setPackages] = useState<ShootPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<ShootPackage>>(DEFAULT_FORM_DATA);
    const [isSaving, setIsSaving] = useState(false);

    // Dynamic Input States
    const [newAlbumSize, setNewAlbumSize] = useState('');
    const [newAlbumType, setNewAlbumType] = useState('');
    const [newExtraName, setNewExtraName] = useState('');
    const [newExtraPrice, setNewExtraPrice] = useState<number | ''>('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/packages');
            if (res.ok) {
                const data = await res.json();
                setPackages(data.packages);
            } else {
                toast.error('Paketler yüklenemedi');
            }
        } catch (error) {
            console.error(error);
            toast.error('Bağlantı hatası');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (pkg?: ShootPackage) => {
        if (pkg) {
            setEditingId(pkg._id!);
            setFormData(pkg);
        } else {
            setEditingId(null);
            setFormData(DEFAULT_FORM_DATA);
        }
        setNewAlbumSize('');
        setNewAlbumType('');
        setNewExtraName('');
        setNewExtraPrice('');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error('Lütfen paket adını girin');
            return;
        }

        setIsSaving(true);
        try {
            const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingId ? 'Paket güncellendi' : 'Paket oluşturuldu');
                fetchPackages();
                setIsModalOpen(false);
            } else {
                toast.error('Paket kaydedilemedi');
            }
        } catch (error) {
            console.error(error);
            toast.error('Bağlantı hatası');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu paketi silmek istediğinize emin misiniz?')) return;
        
        try {
            const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Paket silindi');
                fetchPackages();
            } else {
                toast.error('Paket silinemedi');
            }
        } catch (error) {
            console.error(error);
            toast.error('Bağlantı hatası');
        }
    };

    // --- Array Handlers ---
    const addAlbumSize = () => {
        if (!newAlbumSize.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                albumSizes: [...(prev.features?.albumSizes || []), newAlbumSize.trim()]
            }
        }));
        setNewAlbumSize('');
    };

    const removeAlbumSize = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                albumSizes: prev.features!.albumSizes.filter((_, i) => i !== index)
            }
        }));
    };

    const addAlbumType = () => {
        if (!newAlbumType.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                albumTypes: [...(prev.features?.albumTypes || []), newAlbumType.trim()]
            }
        }));
        setNewAlbumType('');
    };

    const removeAlbumType = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                albumTypes: prev.features!.albumTypes.filter((_, i) => i !== index)
            }
        }));
    };

    const addExtra = () => {
        if (!newExtraName.trim() || newExtraPrice === '') return;
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                extras: [...(prev.features?.extras || []), { name: newExtraName.trim(), price: Number(newExtraPrice) }]
            }
        }));
        setNewExtraName('');
        setNewExtraPrice('');
    };

    const removeExtra = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: {
                ...prev.features!,
                extras: prev.features!.extras.filter((_, i) => i !== index)
            }
        }));
    };

    const updateFeatureProperty = (field: string, value: any) => {
        setFormData({
            ...formData,
            features: {
                ...formData.features!,
                [field]: value
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[1920px] mx-auto min-h-screen space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">Çekim Paketleri</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Müşterilerinize sunacağınız paketleri oluşturun ve yönetin.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Paket Oluştur
                </button>
            </div>

            {/* Packages Grid */}
            {packages.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Henüz Paket Eklenmemiş</h3>
                    <p className="text-slate-500 text-sm">Müşterilerinize sunmak için ilk çekim paketinizi oluşturun.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Paket Oluştur
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div key={pkg._id} className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            {pkg.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-bold shadow-sm shadow-orange-500/20">
                                    EN ÇOK TERCİH EDİLEN
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{pkg.name}</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-1">{pkg.tagline}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-indigo-600 tracking-tight">
                                        {pkg.price.toLocaleString('tr-TR')} <span className="text-sm font-medium text-indigo-400">{pkg.currency}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                {/* Album Info */}
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">
                                            {pkg.features.albumSizes?.length > 0 ? pkg.features.albumSizes.join(', ') : 'Albüm Yok'}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-500">
                                            {pkg.features.albumTypes?.length > 0 ? pkg.features.albumTypes.join(', ') : 'Kapak Türü Belirtilmemiş'} • {pkg.features.albumPages || 0} Sayfa
                                        </p>
                                    </div>
                                </div>

                                {/* Features List */}
                                <ul className="space-y-2 mt-4">
                                    {pkg.features.familyAlbums > 0 && (
                                        <li className="flex items-center gap-2 text-xs text-slate-600">
                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{pkg.features.familyAlbums} Adet Aile Albümü ({pkg.features.familyAlbumSize})</span>
                                        </li>
                                    )}
                                    {pkg.features.posterCount > 0 && (
                                        <li className="flex items-center gap-2 text-xs text-slate-600">
                                            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{pkg.features.posterCount} Adet Poster ({pkg.features.posterSize})</span>
                                        </li>
                                    )}
                                    {pkg.features.extras?.map((extra, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>
                                                {extra.name}
                                                {extra.price > 0 && <span className="text-slate-400 ml-1">(+{extra.price.toLocaleString()} TL)</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-2 mt-auto pt-5 border-t border-slate-100/60">
                                <button
                                    onClick={() => handleOpenModal(pkg)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-transparent hover:bg-white hover:border-indigo-200 text-slate-700 hover:text-indigo-600 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Düzenle
                                </button>
                                <button 
                                    onClick={() => handleDelete(pkg._id!)}
                                    className="p-2.5 bg-slate-50 border border-transparent hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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

                                {/* Dynamic Album Details */}
                                <section className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                                        Albüm Özellikleri (Çoklu Ekleme)
                                    </h4>
                                    
                                    <div className="p-5 bg-white border border-gray-200 rounded-2xl space-y-5">
                                        {/* Albüm Boyutları */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-2">Albüm Boyutları</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.features?.albumSizes?.map((size, index) => (
                                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100">
                                                        {size}
                                                        <button onClick={() => removeAlbumSize(index)} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors text-indigo-400 hover:text-indigo-800">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                                {(!formData.features?.albumSizes || formData.features.albumSizes.length === 0) && (
                                                    <span className="text-xs text-gray-400 italic">Henüz boyut eklenmedi</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Örn: 30x50 Panoramik" 
                                                    value={newAlbumSize}
                                                    onChange={e => setNewAlbumSize(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAlbumSize())}
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                                />
                                                <button type="button" onClick={addAlbumSize} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-5"></div>

                                        {/* Kapak Türleri */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-2">Kapak Türleri</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.features?.albumTypes?.map((type, index) => (
                                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-100">
                                                        {type}
                                                        <button onClick={() => removeAlbumType(index)} className="hover:bg-purple-200 p-0.5 rounded-full transition-colors text-purple-400 hover:text-purple-800">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                                {(!formData.features?.albumTypes || formData.features.albumTypes.length === 0) && (
                                                    <span className="text-xs text-gray-400 italic">Henüz kapak türü eklenmedi</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Örn: Deri Kapak" 
                                                    value={newAlbumType}
                                                    onChange={e => setNewAlbumType(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAlbumType())}
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                                />
                                                <button type="button" onClick={addAlbumType} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-5"></div>

                                        {/* Ek Alanlar (Sayfa, Aile, Poster) */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">İç Sayfa</label>
                                                <input
                                                    type="number"
                                                    value={formData.features?.albumPages}
                                                    onChange={(e) => updateFeatureProperty('albumPages', Number(e.target.value))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    placeholder="Adet"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Aile Albümü</label>
                                                <input
                                                    type="number"
                                                    value={formData.features?.familyAlbums}
                                                    onChange={(e) => updateFeatureProperty('familyAlbums', Number(e.target.value))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    placeholder="Adet"
                                                />
                                            </div>
                                            <div className="space-y-1 col-span-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Aile Albüm Boyutu</label>
                                                <input
                                                    type="text"
                                                    value={formData.features?.familyAlbumSize}
                                                    onChange={(e) => updateFeatureProperty('familyAlbumSize', e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    placeholder="Örn: 15x21"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Poster</label>
                                                <input
                                                    type="number"
                                                    value={formData.features?.posterCount}
                                                    onChange={(e) => updateFeatureProperty('posterCount', Number(e.target.value))}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    placeholder="Adet"
                                                />
                                            </div>
                                            <div className="space-y-1 col-span-3">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase">Poster Boyutu</label>
                                                <input
                                                    type="text"
                                                    value={formData.features?.posterSize}
                                                    onChange={(e) => updateFeatureProperty('posterSize', e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                    placeholder="Örn: 50x70"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Dynamic Extras */}
                                <section className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Ekstra Hizmetler (Çoklu Ekleme)
                                    </h4>
                                    
                                    <div className="p-5 bg-white border border-gray-200 rounded-2xl space-y-4">
                                        
                                        {/* Eklenen Ekstralar Listesi */}
                                        <div className="space-y-2">
                                            {formData.features?.extras?.map((extra, index) => (
                                                <div key={index} className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">{extra.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-sm font-bold text-emerald-600">
                                                            {extra.price > 0 ? `+${extra.price.toLocaleString()} TL` : 'Ücretsiz'}
                                                        </div>
                                                        <button onClick={() => removeExtra(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!formData.features?.extras || formData.features.extras.length === 0) && (
                                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                                                    Eklentiniz yok. Aşağıdan yeni bir ekstra hizmet ekleyebilirsiniz.
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 pt-4"></div>

                                        {/* Yeni Ekstra Ekleme Formu */}
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="Hizmet Adı (Örn: Drone Çekimi)" 
                                                value={newExtraName}
                                                onChange={e => setNewExtraName(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExtra())}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                            <div className="flex gap-2">
                                                <div className="relative w-32">
                                                    <input 
                                                        type="number" 
                                                        placeholder="0" 
                                                        value={newExtraPrice}
                                                        onChange={e => setNewExtraPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExtra())}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-indigo-500 text-right font-bold text-emerald-600"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">TL</span>
                                                </div>
                                                <button type="button" onClick={addExtra} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors">
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </section>

                                {/* Package Options */}
                                <section className="flex gap-6 pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isPopular} 
                                            onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                            'En Çok Tercih Edilen' Etiketi Ekle
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isActive} 
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                                            Paketi Aktif Et
                                        </span>
                                    </label>
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
                                            <ImageIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                            <span className="font-semibold text-xs leading-snug">
                                                Size: {formData.features?.albumSizes?.length ? formData.features.albumSizes.join(', ') : '-'} <br/>
                                                Tip: {formData.features?.albumTypes?.length ? formData.features.albumTypes.join(', ') : '-'}
                                            </span>
                                        </div>

                                        {formData.features?.extras?.slice(0, 5).map((extra, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>
                                                    {extra.name}
                                                    {extra.price > 0 && <span className="text-gray-400 ml-1">(+{extra.price.toLocaleString()} TL)</span>}
                                                </span>
                                            </div>
                                        ))}
                                        {(formData.features?.extras?.length || 0) > 5 && (
                                            <div className="text-xs text-gray-400 text-center font-medium italic pt-2">
                                                + {formData.features!.extras!.length - 5} daha özellik var
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6">
                                        <button disabled className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 opacity-80 cursor-not-allowed">
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
                                        disabled={isSaving}
                                        className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
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

// Ensure the helper icon component remains in file if used
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
