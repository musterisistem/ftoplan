'use client';

import { useState } from 'react';
import { Settings, Globe, Mail, Bell, Shield, Database } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

export default function SuperAdminSettingsPage() {
    const { showAlert } = useAlert();
    const [settings, setSettings] = useState({
        siteName: 'Weey.NET',
        siteUrl: 'https://weey.net',
        supportEmail: 'destek@weey.net',
        defaultQuota: 20,
        trialDays: 14,
        enableRegistration: true,
        maintenanceMode: false
    });

    const handleSave = async () => {
        showAlert('Ayarlar kaydedildi! (Henüz API bağlantısı yok)', 'success');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Sistem Ayarları</h1>
                <p className="text-gray-400">Platform genelindeki ayarları yönetin</p>
            </div>

            {/* General Settings */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Genel Ayarlar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Site Adı</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Site URL</label>
                        <input
                            type="url"
                            value={settings.siteUrl}
                            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Destek Email</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Default Settings */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    Varsayılan Ayarlar
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Varsayılan Kota (GB)</label>
                        <input
                            type="number"
                            value={settings.defaultQuota}
                            onChange={(e) => setSettings({ ...settings, defaultQuota: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Deneme Süresi (Gün)</label>
                        <input
                            type="number"
                            value={settings.trialDays}
                            onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Güvenlik & Erişim
                </h2>

                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                        <div>
                            <p className="text-white font-medium">Yeni Kayıtları Aç</p>
                            <p className="text-sm text-gray-400">Yeni fotoğrafçıların kayıt olmasına izin ver</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.enableRegistration}
                            onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                            className="w-5 h-5 accent-purple-500"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                        <div>
                            <p className="text-white font-medium">Bakım Modu</p>
                            <p className="text-sm text-gray-400">Sistemi geçici olarak kapat (sadece superadmin erişebilir)</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            className="w-5 h-5 accent-red-500"
                        />
                    </label>
                </div>
            </div>

            {/* Communication Settings */}
            <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    İletişim Ayarları
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    <a
                        href="/superadmin/settings/mail-templates"
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-900/70 border border-white/5 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                <Mail className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Sistem Mail Şablonları</p>
                                <p className="text-sm text-gray-400">Doğrulama ve hoş geldin maillerini düzenleyin</p>
                            </div>
                        </div>
                        <Globe className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </a>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
                Ayarları Kaydet
            </button>
        </div>
    );
}
