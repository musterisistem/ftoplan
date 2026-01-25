'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import Button from '@/components/common/Button';

interface CustomerFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function CustomerForm({ initialData, isEditing = false }: CustomerFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        brideName: initialData?.brideName || '',
        groomName: initialData?.groomName || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        weddingDate: initialData?.weddingDate ? new Date(initialData.weddingDate).toISOString().split('T')[0] : '',
        notes: initialData?.notes || '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        console.log('Form data:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect back to list
        router.push('/admin/customers');
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gelin Adı</label>
                    <input
                        type="text"
                        name="brideName"
                        value={formData.brideName}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Ad Soyad"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Damat Adı</label>
                    <input
                        type="text"
                        name="groomName"
                        value={formData.groomName}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Ad Soyad"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="05XX XXX XX XX"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Düğün Tarihi</label>
                    <input
                        type="date"
                        name="weddingDate"
                        value={formData.weddingDate}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Müşteri hakkında özel notlar..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                >
                    <X className="w-4 h-4 mr-2" />
                    İptal
                </Button>
                <Button
                    type="submit"
                    isLoading={loading}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                </Button>
            </div>
        </form>
    );
}
