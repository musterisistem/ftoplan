'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, RotateCcw, Send, Sparkles, Eye, Edit3, ShieldCheck, Layout, MessageSquare, Settings, Info, CheckCircle2 } from 'lucide-react';

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
    VERIFY_EMAIL: {
        name: 'E-posta Doğrulama',
        icon: ShieldCheck,
        description: 'Yeni kayıt olan kullanıcıların doğrulanması için gönderilir.'
    },
    WELCOME_PHOTOGRAPHER: {
        name: 'Hoş Geldin Mesajı',
        icon: Layout,
        description: 'Kayıt süreci tamamlandığında gönderilen karşılama e-postası.'
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
    companyName: 'Firma / Sistem Adı'
};

const TEMPLATE_VARIABLES: Record<string, string[]> = {
    VERIFY_EMAIL: ['{{photographerName}}', '{{verifyUrl}}'],
    WELCOME_PHOTOGRAPHER: ['{{photographerName}}', '{{studioName}}', '{{loginUrl}}']
};

export default function SuperAdminEmailTemplatesPage() {
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
                showSuccess('Test maili gönderildi!');
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
        return ['subject', 'logoUrl', 'primaryColor', 'headerText', 'bodyText', 'buttonText', 'footerText', 'companyName'];
    };

    if (loading) {
        return <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div><div className="h-64 bg-gray-200 rounded"></div></div>;
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                        <Mail className="h-8 w-8 text-indigo-600" />
                        Sistem Mail Şablonları
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Yeni fotoğrafçılar için gönderilen sistem maillerini düzenleyin.
                    </p>
                </div>
            </div>

            {successMessage && (
                <div className="fixed top-8 right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-bold">{successMessage}</span>
                    </div>
                </div>
            )}

            {!selectedType ? (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Şablon Türü</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Açıklama</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider">Durum</th>
                                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-wider text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {templates.map(template => {
                                const info = TEMPLATE_INFO[template.type];
                                if (!info) return null;
                                const Icon = info.icon;
                                return (
                                    <tr key={template.type} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-indigo-600 transition-colors flex items-center justify-center">
                                                    <Icon className="h-6 w-6 text-gray-500 group-hover:text-white transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base">{info.name}</h3>
                                                    <span className="text-xs font-medium text-gray-400 font-mono">{template.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{info.description}</td>
                                        <td className="px-8 py-6">
                                            {template.isCustom ? (
                                                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">Özelleştirilmiş</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Varsayılan</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => setSelectedType(template.type)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-indigo-600 transition-all shadow-sm">
                                                <Edit3 className="h-4 w-4" /> Düzenle
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => setSelectedType(null)} className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-gray-600 hover:text-gray-900 flex items-center gap-2 font-bold text-sm shadow-sm transition-all">← Geri Dön</button>
                        <div className="flex items-center gap-3">
                            <button onClick={handleSendTest} className="px-6 py-3 rounded-2xl font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-sm shadow-sm flex items-center gap-2 inline-flex items-center">
                                <Send className="h-4 w-4 text-indigo-500" /> Test Maili Gönder
                            </button>
                            <button onClick={handleSave} disabled={saving} className="px-8 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50">
                                <Save className="h-4 w-4" /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 items-start">
                        <div className="col-span-12 lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                        {(() => {
                                            const Icon = TEMPLATE_INFO[selectedType].icon;
                                            return <Icon className="h-7 w-7 text-indigo-600" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{TEMPLATE_INFO[selectedType].name}</h2>
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{selectedType}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {getFields().map(field => (
                                        <div key={field}>
                                            <label className="block text-sm font-bold text-gray-600 mb-2">{FIELD_LABELS[field]}</label>
                                            {field === 'logoUrl' ? (
                                                <div className="relative group">
                                                    <label className="block w-full cursor-pointer">
                                                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 group-hover:border-indigo-500 group-hover:bg-indigo-50/30 transition-all text-center">
                                                            {uploading ? <div className="animate-pulse text-indigo-600 font-bold">Yükleniyor...</div> : customization[field] ? <img src={customization[field]} alt="Logo" className="max-h-12 mx-auto object-contain" /> : <div className="text-sm text-gray-400 font-bold">Logo seçin</div>}
                                                        </div>
                                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={uploading} />
                                                    </label>
                                                </div>
                                            ) : field === 'primaryColor' ? (
                                                <div className="flex gap-3">
                                                    <input type="color" value={customization[field] || '#6366f1'} onChange={(e) => updateField(field, e.target.value)} className="w-16 h-12 rounded-xl border border-gray-100 cursor-pointer overflow-hidden p-0" />
                                                    <input type="text" value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-xl px-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="#000000" />
                                                </div>
                                            ) : field === 'bodyText' || field === 'footerText' ? (
                                                <textarea value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} rows={4} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500" />
                                            ) : (
                                                <input type="text" value={customization[field] || ''} onChange={(e) => updateField(field, e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {TEMPLATE_VARIABLES[selectedType] && (
                                    <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                        <div className="flex items-center gap-2 mb-4 text-indigo-600">
                                            <Info className="h-4 w-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Değişken Rehberi</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {TEMPLATE_VARIABLES[selectedType].map(variable => (
                                                <code key={variable} className="px-2 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-[10px] font-black">{variable}</code>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isCustom && (
                                    <button onClick={handleReset} className="w-full mt-6 py-4 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                        <RotateCcw className="h-4 w-4" /> Sıfırla
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-7 sticky top-6">
                            <div className="bg-gray-100 rounded-[40px] p-6">
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100" style={{ height: 'calc(100vh - 250px)' }}>
                                    <div className="bg-gray-50 border-b border-gray-100 p-4 flex gap-2 text-xs">
                                        <span className="text-gray-400 font-bold">Konu:</span>
                                        <span className="text-gray-900 font-black">{customization.subject || '...'}</span>
                                    </div>
                                    {previewHtml ? (
                                        <iframe srcDoc={previewHtml} className="w-full h-full border-0" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300 font-bold uppercase tracking-widest">Önizleme Yükleniyor</div>
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
