'use client';

import { useState, useEffect } from 'react';
import { Package, Check, Server, Users, Zap, Edit2, X, Save, Plus, Trash2 } from 'lucide-react';

export default function PackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPackage, setEditingPackage] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/superadmin/packages');
            if (res.ok) {
                const data = await res.json();
                setPackages(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingPackage.name || editingPackage.price === undefined) {
            alert('İsim ve fiyat zorunludur.');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/superadmin/packages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPackage)
            });

            if (res.ok) {
                setEditingPackage(null);
                fetchPackages(); // Reload from DB
            } else {
                alert('Paket kaydedilirken hata oluştu.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Bir internet sorunu oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    const addFeature = () => {
        setEditingPackage({
            ...editingPackage,
            features: [...(editingPackage.features || []), '']
        });
    };

    const updateFeature = (index: number, val: string) => {
        const newFeat = [...editingPackage.features];
        newFeat[index] = val;
        setEditingPackage({ ...editingPackage, features: newFeat });
    };

    const removeFeature = (index: number) => {
        const newFeat = editingPackage.features.filter((_: any, i: number) => i !== index);
        setEditingPackage({ ...editingPackage, features: newFeat });
    };

    if (loading) {
        return <div className="text-white">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Package className="w-8 h-8" />
                    Paket Yönetimi
                </h1>
                <p className="text-gray-400 mt-1">Sistemdeki aktif paketlerin fiyatlarını ve sınırlarını düzenleyin</p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                {packages.map((pkg) => {
                    const isEditing = editingPackage?.id === pkg.id;
                    const currentPkg = isEditing ? editingPackage : pkg;
                    const colorClasses = pkg.id === 'kurumsal' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500';

                    return (
                        <div
                            key={pkg.id}
                            className={`relative bg-gray-800/50 rounded-2xl border ${currentPkg.popular ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-white/10'} overflow-hidden transition-all`}
                        >
                            {currentPkg.popular && !isEditing && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full">
                                    Önerilen
                                </div>
                            )}

                            {/* Header Editing */}
                            <div className={`p-6 bg-gradient-to-br ${colorClasses} bg-opacity-10 min-h-[140px] flex flex-col justify-center`}>
                                {isEditing ? (
                                    <div className="space-y-3 relative z-10 w-full">
                                        <div>
                                            <input
                                                type="text"
                                                value={currentPkg.name}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                                                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-bold"
                                                placeholder="Paket Adı"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-white">₺</span>
                                            <input
                                                type="number"
                                                value={currentPkg.price}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, price: Number(e.target.value) })}
                                                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-bold"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={currentPkg.popular}
                                                onChange={(e) => setEditingPackage({ ...editingPackage, popular: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-800 bg-gray-700"
                                            />
                                            <span className="text-sm text-white font-medium">Önerilen Etiketi (En Popüler)</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-2">
                                            <span className="text-4xl font-extrabold text-white">₺{pkg.price.toLocaleString('tr-TR')}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Features Editing */}
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-400">Depolama Limiti (GB)</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={currentPkg.storage}
                                            onChange={(e) => setEditingPackage({ ...editingPackage, storage: Number(e.target.value) })}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-white font-medium bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                            <Server className="w-5 h-5 text-purple-400" />
                                            {pkg.storage} GB Kota
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-medium text-gray-400">Erişim Özellikleri</label>
                                        {isEditing && (
                                            <button onClick={addFeature} className="text-xs text-purple-400 border border-purple-500/30 px-2 py-1 rounded bg-purple-500/10 flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Ekle
                                            </button>
                                        )}
                                    </div>

                                    <ul className="space-y-3">
                                        {currentPkg.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3">
                                                {!isEditing && <Check className="w-5 h-5 text-green-400 flex-shrink-0" />}

                                                {isEditing ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => updateFeature(i, e.target.value)}
                                                            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                                                            placeholder="Özellik metni..."
                                                        />
                                                        <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[15px] text-gray-300">{feature}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-white/10 bg-gray-900/30">
                                {isEditing ? (
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setEditingPackage(null)}
                                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setEditingPackage({ ...pkg })}
                                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Paketi Düzenle
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
