'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, Zap, HardDrive, Globe, CreditCard, LogIn, UserPlus } from 'lucide-react';

export default function PackagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedPackageForAuth, setSelectedPackageForAuth] = useState<string | null>(null);

    const selectPackage = (packageId: string) => {
        if (status === 'unauthenticated') {
            setSelectedPackageForAuth(packageId);
            setShowAuthModal(true);
            return;
        }
        setLoading(packageId);
        router.push(`/checkout?package=${packageId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl border-b-4 border-purple-500 inline-block pb-2 mb-6">
                        İşletmeniz İçin En Uygun Planı Seçin
                    </h1>
                    <p className="text-xl text-gray-600">
                        Fotoğraf stüdyonuzu yönetmek ve büyütmek için ihtiyacınız olan tüm araçlar.
                        Size özel web sitesi, mobil uygulama ve müşteri paneli.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
                    {/* Standart Package */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Standart Paket</h3>
                            <p className="text-gray-500 mb-6">Başlangıç ve orta ölçekli stüdyolar için ideal.</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-5xl font-extrabold text-gray-900">₺4.999</span>
                                <span className="text-xl text-gray-500 font-medium">/ Yıl</span>
                            </div>
                            <button
                                onClick={() => selectPackage('standart')}
                                disabled={loading !== null}
                                className="w-full py-4 px-6 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                            >
                                {loading === 'standart' ? (
                                    <div className="w-6 h-6 border-3 border-gray-500 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Standart Paketi Seç
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-8 flex-1">
                            <div className="flex items-center gap-3 mb-6 text-indigo-600">
                                <HardDrive className="w-6 h-6" />
                                <span className="font-bold text-lg">10 GB Panel Disk Alanı</span>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Randevu Oluşturma Sistemi',
                                    'Üyeye Özel Müşteri Paneli',
                                    'Online Ödeme & Kapora Sistemi',
                                    'Müşteri Fotoğraf Onay Sistemi',
                                    'Otomatik Fotoğraf Küçültme & Optimizasyon',
                                    'Güvenli Fotoğraf Arşivleme',
                                    'İşletmeye Özel Mobil Uygulama',
                                    'Mobil Uygulama Yönetim Paneli',
                                    'Üyeye Özel Mobil Uygulama Tasarım Düzenleme'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                                <li className="flex items-start gap-3 opacity-50">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-gray-500 line-through">İşletmeye Özel Kurumsal Web Sitesi</span>
                                </li>
                                <li className="flex items-start gap-3 opacity-50">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span className="text-gray-500 line-through">Ücretsiz Domain & Hosting</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Kurumsal Package */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-purple-500 flex flex-col relative transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                        <div className="absolute top-6 right-6">
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                En Çok Tercih Edilen
                            </span>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100">
                            <h3 className="text-2xl font-bold text-purple-900 mb-2">Kurumsal Paket</h3>
                            <p className="text-purple-700/80 mb-6">Kurumsallaşmak ve prestij kazanmak isteyenler için.</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-5xl font-extrabold text-gray-900">₺9.999</span>
                                <span className="text-xl text-gray-500 font-medium">/ Yıl</span>
                            </div>
                            <button
                                onClick={() => selectPackage('kurumsal')}
                                disabled={loading !== null}
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 group"
                            >
                                {loading === 'kurumsal' ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Kurumsal Paketi Seç
                                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-8 flex-1">
                            <div className="flex items-center gap-3 mb-6 text-purple-600">
                                <HardDrive className="w-6 h-6" />
                                <span className="font-bold text-lg">30 GB Panel Disk Alanı</span>
                            </div>

                            <div className="mb-4">
                                <span className="font-bold text-gray-900">Standart paketin tüm özellikleri, artı olarak:</span>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    'İşletmeye Özel Kurumsal Web Sitesi',
                                    'Ücretsiz Domain (Alan Adı)',
                                    '2 GB Ücretsiz Hosting',
                                    'Firma İsmiyle Kurumsal E-Posta Adresi',
                                    'Web Sitesi Teknik Destek Hizmeti (Ücretsiz)'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-purple-50/50 p-2 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                        <span className="text-purple-900 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 max-w-4xl mx-auto pt-10 border-t border-gray-200">
                    <div className="grid sm:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Güvenli Altyapı</h4>
                            <p className="text-gray-500 text-sm">Verileriniz ve fotoğraflarınız güvenle bulutta saklanır.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Güvenli Ödeme</h4>
                            <p className="text-gray-500 text-sm">256-bit SSL güvencesiyle kredi kartı veya havale ile ödeme.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Anında Aktif</h4>
                            <p className="text-gray-500 text-sm">Ödeme sonrası saniyeler içinde sisteminizi kullanmaya başlayın.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auth Required Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Devam Etmek İçin Giriş Yapın</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                {selectedPackageForAuth === 'standart' ? 'Standart Paket' : 'Kurumsal Paket'} satın almak için mevcut hesabınıza giriş yapmalı veya yeni bir hesap oluşturmalısınız.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push(`/login?redirect=/packages`)}
                                    className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Zaten Hesabım Var (Giriş Yap)</span>
                                </button>

                                <button
                                    onClick={() => router.push(`/register`)}
                                    className="w-full py-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-purple-200"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Yeni Hesap Oluştur</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="mt-6 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
                            >
                                Şimdilik Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
