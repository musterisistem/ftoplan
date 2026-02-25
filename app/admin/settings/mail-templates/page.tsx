'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, RotateCcw, Send, Sparkles, Eye, Edit3, ShieldCheck, Layout, MessageSquare, Settings, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface TemplateCustomization {
    logoUrl?: string;
    primaryColor?: string;
    subject?: string;
    headerText?: string;
    bodyText?: string;
    buttonText?: string;
    footerText?: string;
    companyName?: string;
}

interface EmailTemplate {
    type: string;
    customization: TemplateCustomization;
    isCustom: boolean;
}

const TEMPLATE_INFO: Record<string, { name: string; icon: any; description: string }> = {
    CUSTOMER_STATUS_UPDATE: {
        name: 'Müşteri Bilgilendirme',
        icon: MessageSquare,
        description: 'Randevu veya albüm durumu değiştiğinde müşteriye gönderilir.'
    },
    PLAN_UPDATED: {
        name: 'Paket Güncelleme',
        icon: Settings,
        description: 'Abonelik planı veya kota değişikliklerinde gönderilir.'
    }
};

const FIELD_LABELS: Record<string, string> = {
    logoUrl: 'Logo URL',
    primaryColor: 'Kurumsal Renk',
    subject: 'E-posta Konusu',
    headerText: 'Başlık Metni',
    bodyText: 'İçerik Metni',
    buttonText: 'Buton Yazısı',
    footerText: 'Alt Bilgi (Footer)',
    companyName: 'Firma / Stüdyo Adı'
};

const TEMPLATE_VARIABLES: Record<string, string[]> = {
    CUSTOMER_STATUS_UPDATE: ['{{customerName}}', '{{studioName}}', '{{statusTitle}}', '{{statusValue}}'],
    PLAN_UPDATED: ['{{photographerName}}', '{{newPlanName}}', '{{expiryDate}}', '{{storageLimit}}']
};

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [customization, setCustomization] = useState<TemplateCustomization>({});
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedType) {
            const template = templates.find(t => t.type === selectedType);
            if (template) {
                setCustomization(template.customization);
                setIsCustom(template.isCustom);
                fetchPreview(selectedType, template.customization);
            }
        }
    }, [selectedType, templates]);

    useEffect(() => {
        if (selectedType && customization && Object.keys(customization).length > 0) {
            const debounce = setTimeout(() => {
                fetchPreview(selectedType, customization);
            }, 300);
            return () => clearTimeout(debounce);
        }
    }, [customization]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/email-templates/customizations');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            showError('Şablonlar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const fetchPreview = async (type: string, custom: TemplateCustomization) => {
        try {
            const res = await fetch('/api/admin/email-templates/customizations/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, customization: custom })
            });
            if (res.ok) {
                const { html } = await res.json();
                setPreviewHtml(html);
            } else {
                console.error('Preview fetch failed:', await res.text());
            }
        } catch (error) {
            console.error('Error fetching preview:', error);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const { url } = await response.json();
                updateField('logoUrl', url);
                showSuccess('Logo başarıyla yüklendi');
            } else {
                showError('Logo yüklenemedi');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showError('Bir hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedType) return;
        try {
            setSaving(true);
            const res = await fetch(`/api/admin/email-templates/customizations/${selectedType}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customization }),
            });
            if (res.ok) {
                showSuccess('Şablon başarıyla kaydedildi');
                fetchTemplates();
            } else {
                showError('Şablon kaydedilemedi');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            showError('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!selectedType) return;
        if (!confirm('Şablonu varsayılana sıfırlamak istediğinizden emin misiniz?')) return;
        try {
            const res = await fetch(`/api/admin/email-templates/customizations/${selectedType}/reset`, {
                method: 'POST',
            });
            if (res.ok) {
                showSuccess('Şablon varsayılana sıfırlandı');
                fetchTemplates();
            } else {
                showError('Şablon sıfırlanamadı');
            }
        } catch (error) {
            console.error('Error resetting template:', error);
            showError('Bir hata oluştu');
        }
    };

    const handleSendTest = async () => {
        if (!selectedType) return;
        try {
            const res = await fetch(`/api/admin/email-templates/customizations/${selectedType}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customization }),
            });
            if (res.ok) {
                showSuccess('Test maili gönderildi! E-postanızı kontrol edin.');
            } else {
                showError('Test maili gönderilemedi');
            }
        } catch (error) {
            console.error('Error sending test email:', error);
            showError('Bir hata oluştu');
        }
    };

    const updateField = (field: keyof TemplateCustomization, value: string) => {
        setCustomization(prev => ({ ...prev, [field]: value }));
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage('');
        setTimeout(() => setErrorMessage(''), 3000);
    };

    const getFields = (): (keyof TemplateCustomization)[] => {
        if (!selectedType) return [];
        const fieldsByType: Record<string, (keyof TemplateCustomization)[]> = {
            VERIFY_EMAIL: ['subject', 'logoUrl', 'primaryColor', 'headerText', 'bodyText', 'buttonText', 'footerText', 'companyName'],
            WELCOME_PHOTOGRAPHER: ['subject', 'logoUrl', 'primaryColor', 'headerText', 'bodyText', 'buttonText', 'footerText', 'companyName'],
            CUSTOMER_STATUS_UPDATE: ['subject', 'primaryColor', 'headerText', 'bodyText', 'footerText'],
            PLAN_UPDATED: ['subject', 'logoUrl', 'primaryColor', 'headerText', 'bodyText', 'buttonText', 'footerText', 'companyName']
        };
        return fieldsByType[selectedType] || [];
    };

    if (loading) {
        return (
            <div className="p-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div><div className="h-64 bg-gray-200 rounded"></div></div></div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2.5 tracking-tight">
                        <Mail className="h-6 w-6 text-[#7A70BA]" />
                        E-posta Şablonları
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Müşterilerinize giden otomatik bildirimleri kurumsal kimliğinize göre özelleştirin.
                    </p>
                </div>
            </div>

            {successMessage && (
                <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-3.5 rounded-2xl shadow-sm flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-bold text-sm">{successMessage}</span>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
            )}

            {!selectedType ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Şablon Türü</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Açıklama</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {templates.map(template => {
                                    const info = TEMPLATE_INFO[template.type];
                                    const Icon = info.icon;
                                    return (
                                        <tr key={template.type} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#7A70BA]/10 transition-colors flex items-center justify-center border border-gray-100 group-hover:border-[#7A70BA]/20">
                                                        <Icon className="h-5 w-5 text-gray-500 group-hover:text-[#7A70BA] transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-sm">{info.name}</h3>
                                                        <span className="text-[11px] font-semibold text-gray-400 font-mono mt-0.5 inline-block">{template.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                {info.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                {template.isCustom ? (
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold bg-[#7A70BA]/10 text-[#7A70BA] border border-[#7A70BA]/20">
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        Özelleştirilmiş
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                                        Varsayılan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedType(template.type)}
                                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                    Düzenle
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setSelectedType(null)}
                            className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 flex items-center gap-2 font-semibold text-sm shadow-sm transition-all"
                        >
                            ← Geri Dön
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSendTest}
                                className="px-5 py-2.5 rounded-xl font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm shadow-sm flex items-center gap-2"
                            >
                                <Send className="h-4 w-4 text-[#7A70BA]" />
                                Test Gönder
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl font-semibold bg-[#7A70BA] text-white hover:bg-[#7A70BA]/90 transition-all text-sm shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {saving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-5 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                        {(() => {
                                            const Icon = TEMPLATE_INFO[selectedType].icon;
                                            return <Icon className="h-6 w-6 text-[#7A70BA]" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">{TEMPLATE_INFO[selectedType].name}</h2>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{selectedType}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {getFields().map(field => (
                                        <div key={field}>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-semibold text-gray-700">{FIELD_LABELS[field]}</label>
                                            </div>

                                            {field === 'logoUrl' ? (
                                                <div className="relative group">
                                                    <label className="block w-full cursor-pointer">
                                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-[#7A70BA]/50 hover:bg-gray-50/50 transition-all text-center">
                                                            {uploading ? (
                                                                <div className="animate-pulse text-[#7A70BA] font-semibold text-sm">Yükleniyor...</div>
                                                            ) : customization[field] ? (
                                                                <div className="flex items-center justify-center gap-4">
                                                                    <img src={customization[field]} alt="Logo" className="max-h-12 object-contain" />
                                                                    <div className="text-left">
                                                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mevcut Logo</div>
                                                                        <div className="text-[10px] text-[#7A70BA] font-semibold mt-0.5">Değiştirmek için tıklayın</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-400 font-semibold">Logo dosyası seçin</div>
                                                            )}
                                                        </div>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }} disabled={uploading} />
                                                    </label>
                                                </div>
                                            ) : field === 'primaryColor' ? (
                                                <div className="flex gap-3">
                                                    <div className="relative">
                                                        <input type="color" value={customization[field] || '#7A70BA'} onChange={(e) => updateField(field, e.target.value)} className="w-14 h-11 rounded-lg border border-gray-200 cursor-pointer overflow-hidden p-0 block" />
                                                    </div>
                                                    <input type="text" value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-4 font-mono text-sm focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 font-semibold text-gray-900 transition-all outline-none" placeholder="#000000" />
                                                </div>
                                            ) : field === 'bodyText' || field === 'footerText' ? (
                                                <textarea value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} rows={4} className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm font-medium focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 text-gray-900 transition-all outline-none" placeholder={`${FIELD_LABELS[field]} giriniz...`} />
                                            ) : (
                                                <input type="text" value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#7A70BA] focus:ring-4 focus:ring-[#7A70BA]/10 text-gray-900 transition-all outline-none" placeholder={`${FIELD_LABELS[field]} giriniz...`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {TEMPLATE_VARIABLES[selectedType] && (
                                    <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 mb-3 text-gray-700">
                                            <Info className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Değişken Rehberi</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3 font-medium leading-relaxed">Aşağıdaki kodları metin içinde kullanarak dinamik veriler gelmesini sağlayabilirsiniz:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {TEMPLATE_VARIABLES[selectedType].map(variable => (
                                                <code key={variable} className="px-2 py-1 bg-white border border-gray-200 text-[#7A70BA] rounded text-[11px] font-bold shadow-sm">{variable}</code>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isCustom && (
                                    <button onClick={handleReset} className="w-full mt-6 py-3 rounded-xl border border-red-100 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                        <RotateCcw className="h-4 w-4" />
                                        Fabrika Ayarlarına Sıfırla
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-7 sticky top-6">
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-4">Canlı Önizleme Paneli</span>
                                </div>

                                <div className="bg-white rounded-xl shadow-inner overflow-hidden border border-gray-200" style={{ height: 'calc(100vh - 280px)' }}>
                                    {/* Virtual Header for Subject */}
                                    <div className="bg-gray-50 border-b border-gray-200 p-3.5">
                                        <div className="flex gap-2 text-xs">
                                            <span className="text-gray-500 font-semibold">Konu:</span>
                                            <span className="text-gray-900 font-bold">{customization.subject || (templates.find(t => t.type === selectedType)?.customization.subject)}</span>
                                        </div>
                                    </div>
                                    {previewHtml ? (
                                        <iframe srcDoc={previewHtml} className="w-full h-full border-0" title="Preview" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full"><div className="text-center animate-pulse"><Eye className="h-8 w-8 text-gray-300 mx-auto mb-2" /><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Yükleniyor</p></div></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
