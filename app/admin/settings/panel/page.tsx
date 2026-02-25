'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Save,
    Upload,
    Calendar as CalendarIcon,
    Trash2,
    Plus,
    LayoutTemplate,
    ListFilter,
    Clock,
    AlertTriangle,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';

// Types
interface StatusItem {
    id: string;
    label: string;
    color: string;
}

export default function PanelSettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // --- State: Profile ---
    // Initialize with session data if available to avoid empty flash
    const [studioName, setStudioName] = useState(session?.user?.studioName || '');
    const [photographerName, setPhotographerName] = useState(session?.user?.name || '');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // --- State: Calendar ---
    const [defaultView, setDefaultView] = useState<'month' | 'week' | 'day'>('month');

    // --- State: Archive ---
    const [autoDelete, setAutoDelete] = useState(false);

    // --- State: Status Lists ---
    const [appointmentStatuses, setAppointmentStatuses] = useState<StatusItem[]>([
        { id: '1', label: 'Onay Bekliyor', color: 'bg-yellow-500' },
        { id: '2', label: 'Onaylandı', color: 'bg-green-500' },
        { id: '3', label: 'Çekim Yapıldı', color: 'bg-blue-500' },
    ]);
    const [albumStatuses, setAlbumStatuses] = useState<StatusItem[]>([
        { id: '1', label: 'Seçim Bekliyor', color: 'bg-orange-500' },
        { id: '2', label: 'Retouch Aşamasında', color: 'bg-purple-500' },
        { id: '3', label: 'Baskıda', color: 'bg-indigo-500' },
        { id: '4', label: 'Teslim Edildi', color: 'bg-green-600' },
    ]);

    const [newStatusInput, setNewStatusInput] = useState('');
    const [activeStatusType, setActiveStatusType] = useState<'appointment' | 'album'>('appointment');

    // Load Initial Data
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/studio/settings');
                if (res.ok) {
                    const data = await res.json();
                    // Fallback to session data if API returns empty (e.g., first load issue)
                    setStudioName(data.studioName || session?.user?.studioName || '');
                    setPhotographerName(data.name || session?.user?.name || '');

                    // Prioritize panelLogo since this is "Panel Settings"
                    // Fallback to legacy logoUrl or logo if panelLogo is missing
                    if (data.panelLogo) setLogoPreview(data.panelLogo);
                    else if (data.logo) setLogoPreview(data.logo);
                    else if (data.logoUrl) setLogoPreview(data.logoUrl);

                    if (data.panelSettings) {
                        setDefaultView(data.panelSettings.defaultView || 'month');
                        setAutoDelete(data.panelSettings.autoDelete || false);
                        if (data.panelSettings.appointmentStatuses) setAppointmentStatuses(data.panelSettings.appointmentStatuses);
                        if (data.panelSettings.albumStatuses) setAlbumStatuses(data.panelSettings.albumStatuses);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddStatus = () => {
        if (!newStatusInput.trim()) return;
        const newItem = {
            id: Date.now().toString(),
            label: newStatusInput,
            color: 'bg-gray-500'
        };

        if (activeStatusType === 'appointment') {
            setAppointmentStatuses([...appointmentStatuses, newItem]);
        } else {
            setAlbumStatuses([...albumStatuses, newItem]);
        }
        setNewStatusInput('');
    };

    const handleRemoveStatus = (id: string, type: 'appointment' | 'album') => {
        if (type === 'appointment') {
            setAppointmentStatuses(appointmentStatuses.filter(s => s.id !== id));
        } else {
            setAlbumStatuses(albumStatuses.filter(s => s.id !== id));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('studioName', studioName);
            formData.append('photographerName', photographerName);

            // NOTE: Here we send 'panelLogo' instead of generic 'logo'
            if (logoFile) {
                formData.append('panelLogo', logoFile);
            }

            const settingsData = {
                defaultView,
                autoDelete,
                appointmentStatuses,
                albumStatuses
            };
            formData.append('settings', JSON.stringify(settingsData));

            const res = await fetch('/api/studio/settings', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                await updateSession();
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Page Header */}
            <div className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Panel Ayarları</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Sistemin genel işleyiş ve görünüm ayarları</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7A70BA] text-white text-sm font-semibold rounded-xl hover:bg-[#7A70BA]/90 disabled:opacity-50 transition-all shadow-sm"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
            {/* Success Message Toast/Banner */}
            {isSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-3.5 rounded-2xl shadow-sm flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-emerald-100 p-1.5 rounded-xl"><Save className="w-4 h-4" /></div>
                    <span className="font-bold text-sm">Ayarlar başarıyla kaydedildi</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Branding (1/3) */}
                <div className="space-y-6">
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <LayoutTemplate className="w-5 h-5 text-gray-400" />
                                İşletme Kimliği
                            </h2>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Panel Logosu</label>
                                <div className="flex justify-center">
                                    <div className="relative group w-full">
                                        <div className={`aspect-[3/2] w-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${logoPreview ? 'border-solid border-gray-100 bg-white' : ''}`}>
                                            {logoPreview ? (
                                                <Image src={logoPreview} alt="Logo" width={160} height={100} className="object-contain w-full h-full p-4" />
                                            ) : (
                                                <div className="text-center p-6">
                                                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                                    <span className="text-sm font-semibold text-gray-500">Logo Yükle</span>
                                                </div>
                                            )}
                                            <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {logoPreview && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setLogoFile(null); }}
                                                className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-red-50 shadow-sm hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs font-semibold text-gray-400 mt-3 text-center">
                                    Tavsiye: Koyu renkli panel menüsünde iyi görünmesi için <strong className="text-gray-700">beyaz/açık renkli</strong> ve şeffaf arka planlı bir logo tercih edin.
                                </p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stüdyo Adı</label>
                                    <input
                                        type="text"
                                        value={studioName}
                                        onChange={(e) => setStudioName(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                        placeholder="Örn: Kadraj Medya"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fotoğrafçı Adı</label>
                                    <input
                                        type="text"
                                        value={photographerName}
                                        onChange={(e) => setPhotographerName(e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                        placeholder="Örn: Ahmet Yılmaz"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Archive Settings (Small) */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-gray-400" />
                                Arşiv Ayarları
                            </h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex items-start gap-3">
                                <div className="pt-1 flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="autoDelete"
                                        checked={autoDelete}
                                        onChange={() => setAutoDelete(!autoDelete)}
                                        className="w-4 h-4 text-[#7A70BA] bg-white border-gray-300 rounded focus:ring-[#7A70BA] focus:ring-2 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="autoDelete" className="block text-sm font-semibold text-gray-900 cursor-pointer">
                                        Otomatik Temizlik (30 Gün)
                                    </label>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">
                                        Teslim edilen albüm dosyalarını 1 ay sonra sunucudan otomatik olarak siler.
                                    </p>
                                    {autoDelete && (
                                        <div className="mt-3 flex items-center gap-2.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-2.5 rounded-xl border border-amber-200">
                                            <AlertTriangle className="w-4 h-4" />
                                            <span>Kalıcı olarak silinir!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Config (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Calendar Config */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
                                Takvim Görünümü
                            </h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 'month', label: 'Aylık Görünüm' },
                                    { id: 'week', label: 'Haftalık Görünüm' },
                                    { id: 'day', label: 'Günlük Liste' }
                                ].map((view) => (
                                    <button
                                        key={view.id}
                                        onClick={() => setDefaultView(view.id as any)}
                                        className={`flex items-center justify-center p-3.5 rounded-xl border-2 transition-all ${defaultView === view.id
                                            ? 'bg-white border-[#7A70BA] ring-2 ring-[#7A70BA]/10 text-[#7A70BA] font-bold shadow-sm'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50 font-semibold'
                                            }`}
                                    >
                                        <span className="text-sm">{view.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs font-semibold text-gray-400 mt-4 text-center">
                                Bu ayar, "Randevular" sayfasına girdiğinizde varsayılan olarak açılacak görünümü belirler.
                            </p>
                        </div>
                    </section>

                    {/* Status Management */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="px-4 py-4 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2.5 ml-2">
                                <ListFilter className="w-5 h-5 text-gray-400" />
                                Durum Etiketleri
                            </h2>
                            <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setActiveStatusType('appointment')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeStatusType === 'appointment' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 border border-transparent'}`}
                                >
                                    Randevu
                                </button>
                                <button
                                    onClick={() => setActiveStatusType('album')}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeStatusType === 'album' ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 border border-transparent'}`}
                                >
                                    Albüm
                                </button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            {/* Add New Status */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={newStatusInput}
                                    onChange={(e) => setNewStatusInput(e.target.value)}
                                    placeholder={activeStatusType === 'appointment' ? "Yeni randevu durumu..." : "Yeni albüm durumu..."}
                                    className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddStatus()}
                                />
                                <button
                                    onClick={handleAddStatus}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Ekle
                                </button>
                            </div>

                            {/* List */}
                            <div className="space-y-3">
                                {(activeStatusType === 'appointment' ? appointmentStatuses : albumStatuses).map((status) => (
                                    <div key={status.id} className="flex items-center justify-between px-5 py-4 bg-white border border-gray-100 rounded-2xl group hover:border-gray-200 hover:shadow-sm transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                            <span className="text-sm text-gray-800 font-semibold">{status.label}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStatus(status.id, activeStatusType)}
                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-gray-50 rounded-xl hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(activeStatusType === 'appointment' ? appointmentStatuses : albumStatuses).length === 0 && (
                                    <div className="text-center py-8 text-sm font-semibold text-gray-400 italic bg-white rounded-2xl border border-gray-200 border-dashed">
                                        Henüz bir durum etiketi eklenmemiş.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
