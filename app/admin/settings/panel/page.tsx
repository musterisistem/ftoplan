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
        <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Page Header */}
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Panel Ayarları</h1>
                    <p className="text-xs text-gray-500 font-medium">Sistemin genel işleyiş ve görünüm ayarları</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
            {/* Success Message Toast/Banner */}
            {isSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="bg-white/20 p-1 rounded-full"><Save className="w-4 h-4" /></div>
                    <span className="font-medium text-sm">Ayarlar başarıyla kaydedildi</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Branding (1/3) */}
                <div className="space-y-6">
                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                                İşletme Kimliği
                            </h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2">Panel Logosu</label>
                                <div className="flex justify-center">
                                    <div className="relative group w-full">
                                        {/* Added bg-gray-800 to preview pane to simulate dark sidebar context */}
                                        <div className={`aspect-[3/2] w-full rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors ${logoPreview ? 'border-solid border-gray-600' : ''}`}>
                                            {logoPreview ? (
                                                <Image src={logoPreview} alt="Logo" width={160} height={100} className="object-contain w-full h-full p-2" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <span className="text-xs text-gray-400 font-medium">Logo Yükle</span>
                                                </div>
                                            )}
                                            <input type="file" onChange={handleLogoUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {logoPreview && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setLogoFile(null); }}
                                                className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 text-red-500 rounded-md shadow-sm hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 text-center">
                                    Tavsiye: Koyu renkli panel menüsünde iyi görünmesi için <strong>beyaz/açık renkli</strong> ve şeffaf arka planlı bir logo tercih edin.
                                </p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Stüdyo Adı</label>
                                    <input
                                        type="text"
                                        value={studioName}
                                        onChange={(e) => setStudioName(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="Örn: Kadraj Medya"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Fotoğrafçı Adı</label>
                                    <input
                                        type="text"
                                        value={photographerName}
                                        onChange={(e) => setPhotographerName(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                        placeholder="Örn: Ahmet Yılmaz"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ... Rest of existing sections ... */}
                    {/* Archive Settings (Small) */}
                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                Arşiv Ayarları
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="pt-1">
                                    <input
                                        type="checkbox"
                                        id="autoDelete"
                                        checked={autoDelete}
                                        onChange={() => setAutoDelete(!autoDelete)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="autoDelete" className="block text-sm font-medium text-gray-900 cursor-pointer">
                                        Otomatik Temizlik (30 Gün)
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Teslim edilen albüm dosyalarını 1 ay sonra sunucudan otomatik olarak siler.
                                    </p>
                                    {autoDelete && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-md border border-amber-100">
                                            <AlertTriangle className="w-3.5 h-3.5" />
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
                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                                Takvim Görünümü
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'month', label: 'Aylık Görünüm' },
                                    { id: 'week', label: 'Haftalık Görünüm' },
                                    { id: 'day', label: 'Günlük Liste' }
                                ].map((view) => (
                                    <button
                                        key={view.id}
                                        onClick={() => setDefaultView(view.id as any)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${defaultView === view.id
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-sm">{view.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">
                                Bu ayar, "Randevular" sayfasına girdiğinizde varsayılan olarak açılacak görünümü belirler.
                            </p>
                        </div>
                    </section>

                    {/* Status Management */}
                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <ListFilter className="w-4 h-4 text-indigo-500" />
                                Durum Etiketleri
                            </h2>
                            <div className="flex p-0.5 bg-gray-200/50 rounded-lg">
                                <button
                                    onClick={() => setActiveStatusType('appointment')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeStatusType === 'appointment' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Randevu
                                </button>
                                <button
                                    onClick={() => setActiveStatusType('album')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeStatusType === 'album' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Albüm
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Add New Status */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newStatusInput}
                                    onChange={(e) => setNewStatusInput(e.target.value)}
                                    placeholder={activeStatusType === 'appointment' ? "Yeni randevu durumu..." : "Yeni albüm durumu..."}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddStatus()}
                                />
                                <button
                                    onClick={handleAddStatus}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Ekle
                                </button>
                            </div>

                            {/* List */}
                            <div className="space-y-2">
                                {(activeStatusType === 'appointment' ? appointmentStatuses : albumStatuses).map((status) => (
                                    <div key={status.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-white hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${status.color}`}></div>
                                            <span className="text-sm text-gray-700 font-medium">{status.label}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveStatus(status.id, activeStatusType)}
                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(activeStatusType === 'appointment' ? appointmentStatuses : albumStatuses).length === 0 && (
                                    <div className="text-center py-6 text-sm text-gray-400 italic">
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
