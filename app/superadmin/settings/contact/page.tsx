'use client';

import { useState, useEffect } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Plus,
    Trash2,
    Save,
    MoveVertical,
    Globe,
    MessageCircle,
    Instagram,
    Facebook,
    Twitter
} from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

const ICON_OPTIONS = [
    { name: 'MapPin', icon: MapPin },
    { name: 'Phone', icon: Phone },
    { name: 'Mail', icon: Mail },
    { name: 'Clock', icon: Clock },
    { name: 'Globe', icon: Globe },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'Instagram', icon: Instagram },
    { name: 'Facebook', icon: Facebook },
    { name: 'Twitter', icon: Twitter },
];

export default function ContactManagementPage() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [contactInfo, setContactInfo] = useState<any[]>([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/superadmin/settings');
            const data = await res.json();
            if (data.contactInfo) {
                setContactInfo(data.contactInfo.sort((a: any, b: any) => a.order - b.order));
            }
        } catch (error) {
            showAlert('Ayarlar yüklenirken bir hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        const newItem = {
            icon: 'MapPin',
            label: 'Yeni Bölüm',
            value: '',
            color: 'bg-[#5d2b72]',
            order: contactInfo.length
        };
        setContactInfo([...contactInfo, newItem]);
    };

    const handleRemove = (index: number) => {
        setContactInfo(contactInfo.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: string) => {
        const newInfo = [...contactInfo];
        newInfo[index][field] = value;
        setContactInfo(newInfo);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/superadmin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactInfo })
            });

            if (res.ok) {
                showAlert('İletişim bilgileri başarıyla kaydedildi', 'success');
            } else {
                showAlert('Kaydedilirken bir hata oluştu', 'error');
            }
        } catch (error) {
            showAlert('Bir hata oluştu', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">İletişim Sayfası Yönetimi</h1>
                    <p className="text-gray-400 text-sm">"Bize Ulaşın" sayfasındaki bölümleri ekleyin, çıkarın veya düzenleyin.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Ekle
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {contactInfo.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative group"
                    >
                        {/* Order Handle (UI only for now) */}
                        <div className="hidden md:flex items-center text-gray-600 cursor-move">
                            <MoveVertical className="w-5 h-5" />
                        </div>

                        {/* Icon Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">İkon</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ICON_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.name}
                                        onClick={() => handleChange(index, 'icon', opt.name)}
                                        className={`p-2 rounded-lg border transition-all ${item.icon === opt.name
                                                ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                                : 'bg-gray-900/50 border-white/5 text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        <opt.icon className="w-5 h-5 mx-auto" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık (Label)</label>
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleChange(index, 'label', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Örn: Telefon"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">İçerik (Value)</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Örn: +90 (212) ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Renk Sınıfı (Tailwind)</label>
                                <input
                                    type="text"
                                    value={item.color}
                                    onChange={(e) => handleChange(index, 'color', e.target.value)}
                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Örn: bg-blue-500"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => handleRemove(index)}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {contactInfo.length === 0 && (
                    <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-white/10">
                        <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Henüz hiç bölüm eklenmemiş.</p>
                        <button
                            onClick={handleAdd}
                            className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
                        >
                            İlk bölümü ekle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
