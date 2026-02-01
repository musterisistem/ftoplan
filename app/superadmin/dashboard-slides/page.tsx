'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, GripVertical, X } from 'lucide-react';
import Image from 'next/image';

interface Slide {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
    order: number;
}

export default function DashboardSlidesPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        isActive: true,
        order: 0
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/superadmin/slides');
            const data = await res.json();
            setSlides(data);
        } catch (error) {
            console.error('Failed to fetch slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Görsel yükleme başarısız oldu');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingSlide
                ? `/api/superadmin/slides/${editingSlide._id}`
                : '/api/superadmin/slides';

            const method = editingSlide ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchSlides();
                closeModal();
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('Kaydetme başarısız oldu');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/superadmin/slides/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchSlides();
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Silme başarısız oldu');
        }
    };

    const toggleActive = async (slide: Slide) => {
        try {
            const res = await fetch(`/api/superadmin/slides/${slide._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...slide, isActive: !slide.isActive })
            });

            if (res.ok) {
                fetchSlides();
            }
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    const openModal = (slide?: Slide) => {
        if (slide) {
            setEditingSlide(slide);
            setFormData({
                title: slide.title,
                description: slide.description,
                imageUrl: slide.imageUrl,
                link: slide.link,
                isActive: slide.isActive,
                order: slide.order
            });
        } else {
            setEditingSlide(null);
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                link: '',
                isActive: true,
                order: slides.length
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSlide(null);
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            link: '',
            isActive: true,
            order: 0
        });
    };

    const seedDemoSlides = async () => {
        if (!confirm('Demo slaytları yüklemek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch('/api/superadmin/slides/seed', {
                method: 'POST'
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Başarılı! ${data.count} demo slayt yüklendi.`);
                fetchSlides();
            } else {
                alert(data.message || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Seed failed:', error);
            alert('Demo slaytlar yüklenemedi');
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Slaytları</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Tüm fotoğrafçıların dashboard'unda görünecek slaytları yönetin
                    </p>
                </div>
                <div className="flex gap-3">
                    {slides.length === 0 && (
                        <button
                            onClick={seedDemoSlides}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            <Upload className="w-4 h-4" />
                            Demo Slaytları Yükle
                        </button>
                    )}
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Slayt Ekle
                    </button>
                </div>
            </div>

            {/* Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide) => (
                    <div key={slide._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="relative h-48 bg-gray-100">
                            {slide.imageUrl && (
                                <Image
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => toggleActive(slide)}
                                    className={`p-2 rounded-lg ${slide.isActive
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-500 text-white'
                                        }`}
                                >
                                    {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{slide.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{slide.description}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(slide)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(slide._id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSlide ? 'Slayt Düzenle' : 'Yeni Slayt Ekle'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Görsel *
                                </label>
                                {formData.imageUrl ? (
                                    <div className="relative h-48 rounded-lg overflow-hidden mb-2">
                                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                                    </div>
                                ) : null}
                                <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                                    <Upload className="w-5 h-5" />
                                    <span>{uploading ? 'Yükleniyor...' : 'Görsel Yükle'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link (Opsiyonel)
                                </label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-indigo-600"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    disabled={!formData.title || !formData.imageUrl}
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
