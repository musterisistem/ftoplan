'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Mail,
    Save,
    RefreshCcw,
    Eye,
    Type,
    Image as ImageIcon,
    Palette,
    Settings2,
    Send,
    Loader2,
    ChevronRight,
    Smartphone,
    Monitor,
    CheckCircle2,
    AlertCircle,
    Undo2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { EmailTemplateType } from '@/models/EmailTemplate';

interface TemplateCustomization {
    logoUrl?: string;
    logoWidth?: number;
    primaryColor?: string;
    subject?: string;
    headerText?: string;
    bodyText?: string;
    buttonText?: string;
    footerText?: string;
    companyName?: string;
}

const TEMPLATES = [
    { id: 'VERIFY_EMAIL', name: 'E-posta Doğrulama', icon: CheckCircle2 },
    { id: 'WELCOME_PHOTOGRAPHER', name: 'Hoş Geldin Mesajı', icon: Mail },
    { id: 'PLAN_UPDATED', name: 'Paket Değişikliği', icon: RefreshCcw },
];

export default function MailEditorPage() {
    const [selectedType, setSelectedType] = useState('VERIFY_EMAIL');
    const [customization, setCustomization] = useState<TemplateCustomization>({});
    const [previewHtml, setPreviewHtml] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isDirty, setIsDirty] = useState(false);
    const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

    // Fetch template data
    const fetchTemplate = useCallback(async () => {
        try {
            setLoading(true);
            setPendingLogoFile(null); // Reset pending logo on template change
            const res = await fetch(`/api/superadmin/email-templates/${selectedType}`);
            const data = await res.json();

            if (res.ok) {
                setCustomization(data.customization || {});
                setIsDirty(false);
            } else {
                toast.error(data.error || 'Yükleme başarısız');
            }
        } catch (error) {
            toast.error('Şablon yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, [selectedType]);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    // Live Preview update
    useEffect(() => {
        const updatePreview = async () => {
            if (!selectedType || Object.keys(customization).length === 0) return;
            try {
                const res = await fetch('/api/superadmin/email-templates/preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: selectedType, customization })
                });
                const data = await res.json();
                if (res.ok) {
                    setPreviewHtml(data.html);
                }
            } catch (error) {
                console.error('Preview error:', error);
            }
        };

        const timeout = setTimeout(updatePreview, 500);
        return () => clearTimeout(timeout);
    }, [customization, selectedType]);

    const updateField = (field: keyof TemplateCustomization, value: string | number) => {
        setCustomization(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleLogoUpload = (file: File) => {
        setPendingLogoFile(file);
        const localUrl = URL.createObjectURL(file);
        updateField('logoUrl', localUrl);
        toast.success('Logo hazır, kaydet butonuna bastığınızda yüklenecek');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            let finalCustomization = { ...customization };

            // 1. Upload logo to BunnyCDN if there's a pending file
            if (pendingLogoFile) {
                toast.loading('Logo BunnyCDN\'e yükleniyor...', { id: 'logo-upload' });
                const formData = new FormData();
                formData.append('file', pendingLogoFile);

                const uploadRes = await fetch('/api/superadmin/upload/logo', {
                    method: 'POST',
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    toast.error(uploadData.error || 'Logo yükleme başarısız', { id: 'logo-upload' });
                    setSaving(false);
                    return;
                }

                finalCustomization.logoUrl = uploadData.url;
                setCustomization(finalCustomization);
                setPendingLogoFile(null);
                toast.success('Logo yüklendi', { id: 'logo-upload' });
            }

            // 2. Save template with final customization (including the new BunnyCDN URL)
            const res = await fetch(`/api/superadmin/email-templates/${selectedType}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customization: finalCustomization }),
            });
            if (res.ok) {
                toast.success('Şablon başarıyla kaydedildi');
                setIsDirty(false);
            } else {
                toast.error('Kaydedilirken bir hata oluştu');
            }
        } catch (error) {
            toast.error('Bağlantı hatası');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Varsayılan ayarlara dönmek istediğinizden emin misiniz?')) return;
        try {
            const res = await fetch(`/api/superadmin/email-templates/${selectedType}/reset`, {
                method: 'POST',
            });
            if (res.ok) {
                toast.success('Varsayılan ayarlara dönüldü');
                fetchTemplate();
            }
        } catch (error) {
            toast.error('Sıfırlama başarısız');
        }
    };

    const handleSendTest = async () => {
        try {
            toast.loading('Test maili gönderiliyor...', { id: 'test-mail' });
            const res = await fetch(`/api/superadmin/email-templates/${selectedType}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customization }),
            });
            if (res.ok) {
                toast.success('Test maili adresinize gönderildi', { id: 'test-mail' });
            } else {
                toast.error('Gönderim başarısız', { id: 'test-mail' });
            }
        } catch (error) {
            toast.error('Hata oluştu', { id: 'test-mail' });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Palette className="w-6 h-6 text-purple-400" />
                        Görsel Mail Editörü
                    </h1>
                    <p className="text-gray-400 text-sm">Sistem maillerini canlı olarak tasarlayın ve düzenleyin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSendTest}
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Test Gönder
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-800 text-red-400 rounded-xl border border-gray-700 hover:bg-red-500/10 transition-all flex items-center gap-2"
                    >
                        <Undo2 className="w-4 h-4" />
                        Sıfırla
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isDirty
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/25'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                            }`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Kaydet
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Left Panel: Controls */}
                <div className="w-96 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Template Selection */}
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
                        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-purple-400" />
                            Şablon Seçimi
                        </h3>
                        <div className="space-y-2">
                            {TEMPLATES.map(tmp => (
                                <button
                                    key={tmp.id}
                                    onClick={() => setSelectedType(tmp.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedType === tmp.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                        : 'text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 text-sm font-medium">
                                        <tmp.icon className="w-4 h-4" />
                                        {tmp.name}
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedType === tmp.id ? 'rotate-90' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center p-12">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Design & Branding */}
                            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-4">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-pink-400" />
                                    Tasarım & Markalama
                                </h3>
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-medium">Logo</label>
                                    <div className="space-y-3">
                                        {customization.logoUrl ? (
                                            <div className="relative w-full aspect-video bg-black/20 rounded-xl overflow-hidden group border border-white/10">
                                                <img
                                                    src={customization.logoUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain p-4"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all">
                                                        <RefreshCcw className="w-4 h-4 text-white" />
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleLogoUpload(file);
                                                            }}
                                                        />
                                                    </label>
                                                    <button
                                                        onClick={() => updateField('logoUrl', '')}
                                                        className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg transition-all"
                                                    >
                                                        <Undo2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-purple-400 mb-2" />
                                                    <p className="text-[10px] text-gray-500 group-hover:text-purple-400 font-medium">Logo Yükle (BunnyCDN)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleLogoUpload(file);
                                                    }}
                                                />
                                            </label>
                                        )}

                                        {customization.logoUrl && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-[10px] text-gray-500 font-medium">Logo Genişliği: {customization.logoWidth || 140}px</label>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="350"
                                                    step="5"
                                                    value={customization.logoWidth || 140}
                                                    onChange={(e) => updateField('logoWidth', parseInt(e.target.value))}
                                                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <label className="text-xs text-gray-500 mb-2 block font-medium">Ana Renk (Vurgu)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={customization.primaryColor || '#6366f1'}
                                            onChange={(e) => updateField('primaryColor', e.target.value)}
                                            className="w-10 h-10 bg-transparent border-none rounded-lg cursor-pointer outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={customization.primaryColor || '#6366f1'}
                                            onChange={(e) => updateField('primaryColor', e.target.value)}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-4 mb-4">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Type className="w-4 h-4 text-blue-400" />
                                    İçerik Düzenleyici
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block font-medium">E-posta Konusu</label>
                                        <input
                                            type="text"
                                            value={customization.subject || ''}
                                            onChange={(e) => updateField('subject', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block font-medium">Başlık (H1)</label>
                                        <input
                                            type="text"
                                            value={customization.headerText || ''}
                                            onChange={(e) => updateField('headerText', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block font-medium">Ana Metin</label>
                                        <textarea
                                            rows={4}
                                            value={customization.bodyText || ''}
                                            onChange={(e) => updateField('bodyText', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block font-medium">Buton Yazısı</label>
                                        <input
                                            type="text"
                                            value={customization.buttonText || ''}
                                            onChange={(e) => updateField('buttonText', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-2 block font-medium">Alt Bilgi (Footer)</label>
                                        <textarea
                                            rows={2}
                                            value={customization.footerText || ''}
                                            onChange={(e) => updateField('footerText', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 flex flex-col bg-gray-950/20 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gray-900/80 border-b border-white/5 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
                            <span className="w-3 h-3 rounded-full bg-amber-500/40"></span>
                            <span className="w-3 h-3 rounded-full bg-emerald-500/40"></span>
                            <span className="text-xs text-gray-500 ml-4 font-mono font-medium">Email_Live_Preview.html</span>
                        </div>
                        <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${previewMode === 'desktop' ? 'bg-purple-600/20 text-purple-400 shadow-inner' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                                Masaüstü
                            </button>
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${previewMode === 'mobile' ? 'bg-purple-600/20 text-purple-400 shadow-inner' : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                                Mobil
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-[#f8fafc] p-10 flex items-start justify-center relative">
                        {/* Shadow Overlays for depth */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]"></div>

                        <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out origin-top ${previewMode === 'desktop' ? 'w-full max-w-[600px]' : 'w-[375px]'
                            } rounded-xl overflow-hidden relative group`}>
                            {previewHtml ? (
                                <iframe
                                    srcDoc={previewHtml}
                                    className="w-full h-[800px] border-none"
                                    title="Mail Preview"
                                />
                            ) : (
                                <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                    <p className="text-sm font-medium">Önizleme yükleniyor...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="bg-gray-900 border-t border-white/5 px-6 py-3 flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                {isDirty ? 'Kaydedilmemiş Değişiklikler' : 'Senkronize Edildi'}
                            </span>
                            <span>RT-Renderer: Active</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Resend API: Operational</span>
                            <span>UTF-8 Encoding</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(168, 85, 247, 0.2);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(168, 85, 247, 0.4);
                }
            `}</style>
        </div>
    );
}
