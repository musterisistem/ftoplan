'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Building, GripVertical, Upload, X, Loader2 } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

export default function BankAccountsPage() {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [uploading, setUploading] = useState<number | null>(null);

    useEffect(() => { fetchAccounts(); }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/superadmin/bank-accounts');
            const data = await res.json();
            setAccounts(data.bankAccounts || []);
        } catch {
            showAlert('Banka hesapları yüklenemedi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (index: number, file: File) => {
        if (!file.type.startsWith('image/')) {
            showAlert('Sadece görsel dosyaları yüklenebilir', 'error');
            return;
        }

        setUploading(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/superadmin/bank-accounts/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                handleChange(index, 'logoUrl', data.url);
                showAlert('Logo yüklendi', 'success');
            } else {
                showAlert(data.error || 'Yükleme başarısız', 'error');
            }
        } catch {
            showAlert('Sunucu bağlantı hatası', 'error');
        } finally {
            setUploading(null);
        }
    };

    const handleAdd = () => {
        setAccounts([...accounts, { bankName: '', accountHolder: '', iban: '', logoUrl: '', order: accounts.length }]);
    };

    const handleRemove = (i: number) => setAccounts(accounts.filter((_, idx) => idx !== i));

    const handleChange = (i: number, field: string, value: string) => {
        const updated = [...accounts];
        updated[i][field] = value;
        setAccounts(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/superadmin/bank-accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bankAccounts: accounts }),
            });
            if (res.ok) {
                showAlert('Banka hesapları kaydedildi', 'success');
            } else {
                showAlert('Kaydetme başarısız', 'error');
            }
        } catch {
            showAlert('Bir hata oluştu', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-[400px]"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Banka Hesap Bilgileri</h1>
                    <p className="text-gray-400 text-sm">Havale ödemelerinde müşterilere gösterilecek banka hesaplarını yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white hover:bg-gray-700 transition-colors text-sm">
                        <Plus className="w-4 h-4" /> Banka Ekle
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 text-sm">
                        {saving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
                        Kaydet
                    </button>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-white/10">
                    <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Henüz banka hesabı eklenmemiş.</p>
                    <button onClick={handleAdd} className="mt-4 text-purple-400 hover:text-purple-300 font-medium text-sm">İlk hesabı ekle</button>
                </div>
            ) : (
                <div className="space-y-4 pb-20">
                    {accounts.map((acc, i) => (
                        <div key={i} className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
                            {/* Accent Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                            <div className="hidden md:flex items-center text-gray-600 cursor-move pt-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Drop Zone / Image Area */}
                            <div className="w-full md:w-32 flex-shrink-0">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5 px-1">BANKA LOGO</label>
                                
                                <div 
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-purple-500', 'bg-purple-500/10'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/10'); }}
                                    onDrop={(e) => { 
                                        e.preventDefault(); 
                                        e.currentTarget.classList.remove('border-purple-500', 'bg-purple-500/10');
                                        const file = e.dataTransfer.files[0];
                                        if (file) handleFileUpload(i, file);
                                    }}
                                    className={`relative aspect-[4/3] w-full bg-gray-900 border-2 border-dashed rounded-xl flex items-center justify-center transition-all cursor-pointer overflow-hidden group/logo ${acc.logoUrl ? 'border-white/5' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'}`}
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) handleFileUpload(i, file);
                                        };
                                        input.click();
                                    }}
                                >
                                    {uploading === i ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                                            <span className="text-[10px] text-purple-400 font-bold">Yükleniyor</span>
                                        </div>
                                    ) : acc.logoUrl ? (
                                        <>
                                            <img src={acc.logoUrl} alt="logo" className="w-full h-full object-contain p-2" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload className="w-5 h-5 text-white" />
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleChange(i, 'logoUrl', ''); }}
                                                className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover/logo:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-3">
                                            <Upload className="w-5 h-5 text-gray-600 mx-auto mb-1 group-hover/logo:text-purple-400 transition-colors" />
                                            <p className="text-[9px] text-gray-500 font-medium">Logoyu sürükleyin veya tıklayın</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 w-full">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Banka Adı *</label>
                                    <input type="text" value={acc.bankName} onChange={e => handleChange(i, 'bankName', e.target.value)}
                                        placeholder="Örn: Ziraat Bankası"
                                        className="w-full bg-gray-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Hesap Sahibi *</label>
                                    <input type="text" value={acc.accountHolder} onChange={e => handleChange(i, 'accountHolder', e.target.value)}
                                        placeholder="Örn: Ahmet Yılmaz"
                                        className="w-full bg-gray-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">IBAN *</label>
                                    <input type="text" value={acc.iban} onChange={e => handleChange(i, 'iban', e.target.value.toUpperCase())}
                                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                                        className="w-full bg-gray-900 border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 opacity-50">Logo URL (Alternatif)</label>
                                    <input type="url" value={acc.logoUrl} onChange={e => handleChange(i, 'logoUrl', e.target.value)}
                                        placeholder="Dosya seçmediyseniz buraya link yapıştırabilirsiniz"
                                        className="w-full bg-gray-900 border border-white/5 rounded-xl px-4 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <button onClick={() => handleRemove(i)} className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0 self-start mt-6">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
