'use client';

import { useState, useEffect } from 'react';
import { useAlert } from '@/context/AlertContext';
import { BookImage, Save, Plus, Trash2, Edit2, Loader2, ChevronRight, Store } from 'lucide-react';
import Link from 'next/link';

export default function AlbumProvidersPage() {
    const { showAlert } = useAlert();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProviderName, setNewProviderName] = useState('');

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await fetch('/api/admin/album-providers');
            if (res.ok) {
                const data = await res.json();
                setProviders(data);
            }
        } catch {
            showAlert('Tedarikçiler yüklenirken bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProvider = async () => {
        if (!newProviderName.trim()) {
            showAlert('Lütfen tedarikçi adını girin.', 'warning');
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch('/api/admin/album-providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newProviderName })
            });

            if (res.ok) {
                await fetchProviders();
                setNewProviderName('');
                showAlert('Tedarikçi başarıyla eklendi.', 'success');
            } else {
                showAlert('Tedarikçi eklenirken bir hata oluştu.', 'error');
            }
        } catch {
            showAlert('Bir ağ hatası oluştu.', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProvider = async (id: string, name: string) => {
        if (!confirm(`${name} tedarikçisini ve içindeki tüm kapakları silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/album-providers/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProviders(prev => prev.filter(p => p._id !== id));
                showAlert(`${name} başarıyla silindi.`, 'success');
            } else {
                showAlert('Tedarikçi silinirken bir hata oluştu.', 'error');
            }
        } catch {
            showAlert('Bir ağ hatası oluştu.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 bg-[#fafafa] min-h-screen">
            {/* Header Area */}
            <div className="flex flex-col gap-2 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-[#f3f4fa] rounded-lg flex items-center justify-center">
                        <BookImage className="w-5 h-5 text-[#544ee8]" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl font-[900] text-[#111827] tracking-tight">
                        Albüm Kapak Yönetimi
                    </h1>
                </div>
                <p className="text-[13px] font-medium text-[#6b7280]">
                    Müşterilerinizin seçeceği albüm kapağı tedarikçilerini ve kapak modellerini buradan yönetin.
                </p>
            </div>

            {/* Yeni Ekleme */}
            <div className="bg-white p-6 rounded-[20px] border border-[#e5e7eb] shadow-sm">
                <label className="block text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-3 ml-1">Tedarikçi / Kategori Adı</label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={newProviderName}
                        onChange={(e) => setNewProviderName(e.target.value)}
                        placeholder="Örn: Kapak Dünyası, Ahşap Modeller..."
                        className="flex-1 w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[14px] px-5 py-3.5 text-sm font-medium text-[#111827] focus:bg-white focus:border-[#d1d5db] focus:ring-4 focus:ring-[#f3f4fa] outline-none transition-all placeholder:text-[#9ca3af]"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleCreateProvider(); }}
                    />
                    <button
                        onClick={handleCreateProvider}
                        disabled={isCreating}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#544ee8] hover:bg-[#4338ca] text-white px-8 py-3.5 rounded-[14px] text-sm font-bold transition-all shadow-md shadow-[#544ee8]/20 hover:shadow-lg hover:shadow-[#544ee8]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex-shrink-0"
                    >
                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Tedarikçi Ekle
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[24px] border border-[#e5e7eb] shadow-sm flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-[#f3f4fa] rounded-2xl flex items-center justify-center mb-5">
                            <Store className="w-8 h-8 text-[#544ee8]" strokeWidth={2} />
                        </div>
                        <h3 className="text-[17px] font-bold text-[#111827] mb-2">Tedarikçi Bulunamadı</h3>
                        <p className="text-sm font-medium text-[#6b7280]">Yukarıdaki formu kullanarak ilk albüm tedarikçinizi ekleyin.</p>
                    </div>
                ) : (
                    providers.map((provider) => (
                        <div key={provider._id} className="bg-white rounded-[24px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                            {/* Card Body */}
                            <div className="flex-1 w-full flex flex-col items-center justify-center text-center p-8 pb-7">
                                <div className="w-[64px] h-[64px] bg-[#f3f4fa] rounded-[20px] flex items-center justify-center mb-5">
                                    <Store className="w-7 h-7 text-[#544ee8]" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-[900] text-[#111827] uppercase tracking-wide">{provider.name}</h3>
                                <p className="text-[10px] font-bold text-[#9ca3af] mt-1.5 uppercase tracking-widest">{provider.covers?.length || 0} Kapak Modeli</p>
                            </div>
                            
                            {/* Card Footer */}
                            <div className="w-full p-4 pt-0 flex items-center gap-3">
                                <button
                                    onClick={() => handleDeleteProvider(provider._id, provider.name)}
                                    className="p-3 text-[#9ca3af] hover:text-[#ef4444] bg-white border border-[#f3f4f6] hover:border-[#fee2e2] rounded-[14px] transition-all flex-shrink-0 flex items-center justify-center hover:bg-[#fef2f2]"
                                    title="Sil"
                                >
                                    <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
                                </button>
                                <Link
                                    href={`/admin/album-providers/${provider._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#f3f4fa] hover:bg-[#e6e8f4] text-[#544ee8] px-4 py-[11px] rounded-[14px] text-sm font-bold transition-all"
                                >
                                    Modelleri Yönet <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
