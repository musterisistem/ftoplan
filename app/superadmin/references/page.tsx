'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, X, Star } from 'lucide-react';
import Image from 'next/image';

interface Reference {
    _id: string;
    companyName: string;
    logoUrl: string;
    website: string;
    isActive: boolean;
    order: number;
}

const emptyForm = {
    companyName: '',
    logoUrl: '',
    website: '',
    isActive: true,
    order: 0,
};

export default function ReferencesPage() {
    const [references, setReferences] = useState<Reference[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRef, setEditingRef] = useState<Reference | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchReferences(); }, []);

    const fetchReferences = async () => {
        try {
            const res = await fetch('/api/superadmin/references');
            const data = await res.json();
            setReferences(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch('/api/superadmin/upload-logo', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, logoUrl: data.url }));
            } else {
                alert(data.error || 'Görsel yükleme başarısız oldu');
            }
        } catch {
            alert('Görsel yükleme başarısız oldu');
        } finally {
            setUploading(false);
            // Reset input so same file can be re-selected
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingRef
                ? `/api/superadmin/references/${editingRef._id}`
                : '/api/superadmin/references';
            const method = editingRef ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) { fetchReferences(); closeModal(); }
            else alert('Kaydetme başarısız oldu');
        } catch { alert('Kaydetme başarısız oldu'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu referansı silmek istediğinize emin misiniz?')) return;
        try {
            await fetch(`/api/superadmin/references/${id}`, { method: 'DELETE' });
            fetchReferences();
        } catch { alert('Silme başarısız oldu'); }
    };

    const toggleActive = async (ref: Reference) => {
        try {
            await fetch(`/api/superadmin/references/${ref._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...ref, isActive: !ref.isActive }),
            });
            fetchReferences();
        } catch { alert('Durum güncellenemedi'); }
    };

    const openModal = (ref?: Reference) => {
        if (ref) {
            setEditingRef(ref);
            setFormData({
                companyName: ref.companyName,
                logoUrl: ref.logoUrl,
                website: ref.website,
                isActive: ref.isActive,
                order: ref.order,
            });
        } else {
            setEditingRef(null);
            setFormData({ ...emptyForm, order: references.length });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRef(null);
        setFormData({ ...emptyForm });
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Referanslar</h1>
                    </div>
                    <p className="text-gray-400 text-sm ml-13 pl-1">
                        Sitede görünecek referans logo ve firma isimlerini yönetin
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all shadow-lg shadow-purple-500/25"
                >
                    <Plus className="w-4 h-4" />
                    Referans Ekle
                </button>
            </div>

            {/* Grid */}
            {references.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
                    <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">Henüz referans eklenmedi</p>
                    <p className="text-gray-500 text-sm mt-1">Yukarıdaki butonu kullanarak ilk referansınızı ekleyin</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {references.map(ref => (
                        <div
                            key={ref._id}
                            className={`bg-white/10 backdrop-blur rounded-2xl border overflow-hidden transition-all ${ref.isActive ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}
                        >
                            {/* Logo area */}
                            <div className="bg-white/5 h-32 flex items-center justify-center p-4 relative">
                                <Image
                                    src={ref.logoUrl}
                                    alt={ref.companyName}
                                    fill
                                    className="object-contain p-4"
                                />
                                {/* Toggle active badge */}
                                <button
                                    onClick={() => toggleActive(ref)}
                                    className={`absolute top-2 right-2 p-1.5 rounded-lg ${ref.isActive ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'}`}
                                    title={ref.isActive ? 'Aktif — Pasif Yap' : 'Pasif — Aktif Yap'}
                                >
                                    {ref.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            {/* Footer */}
                            <div className="p-3">
                                <p className="text-white font-semibold text-sm text-center truncate mb-2">{ref.companyName}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(ref)}
                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 text-xs font-medium transition-colors"
                                    >
                                        <Edit className="w-3 h-3" /> Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ref._id)}
                                        className="flex items-center justify-center p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-purple-500/20 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingRef ? 'Referansı Düzenle' : 'Yeni Referans Ekle'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Logo *</label>

                                {/* Hidden file input — triggered via ref */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="ref-logo-input"
                                    disabled={uploading}
                                />

                                {formData.logoUrl ? (
                                    <div className="relative h-32 bg-white rounded-xl overflow-hidden mb-2">
                                        <Image src={formData.logoUrl} alt="Preview" fill className="object-contain p-3" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, logoUrl: '' }))}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-0.5"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex flex-col items-center justify-center h-32 border-2 border-dashed border-purple-500/40 rounded-xl cursor-pointer hover:border-purple-500/70 transition-colors bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <Upload className="w-8 h-8 text-purple-400 mb-2" />
                                        <span className="text-sm text-gray-400 font-medium">
                                            {uploading ? 'Yükleniyor...' : 'Logo Yükle (PNG/SVG/JPEG)'}
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Firma Adı *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                                    placeholder="örn: Fotoğraf Stüdyosu XYZ"
                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Web Sitesi (Opsiyonel)</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={e => setFormData(p => ({ ...p, website: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-purple-600' : 'bg-gray-600'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isActive ? 'translate-x-5' : ''}`} />
                                </button>
                                <label className="text-sm text-gray-300">Aktif (sitede görünsün)</label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 font-medium transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!formData.companyName || !formData.logoUrl || saving}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
