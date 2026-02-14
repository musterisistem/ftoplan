'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Camera,
    CheckCircle,
    User,
    Mail,
    Lock,
    Phone,
    Building,
    FileText,
    CreditCard,
    ArrowRight,
    Briefcase
} from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        studioName: '',
        slug: '',
        isSlugEdited: false,
        email: '',
        phone: '',
        password: '',
        companyType: 'individual', // individual or corporate
        address: '',
        taxOffice: '',
        taxNumber: '',
        identityNumber: '',
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4)}`;
        }
        if (phoneNumberLength < 9) {
            return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
        }
        return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let newFormData = { ...formData, [name]: value };

        if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            // Limit length safe guard
            if (formatted.length <= 19) {
                newFormData[name] = formatted;
            } else {
                return; // Don't update if too long
            }
        }

        // Auto-generate slug if Studio Name changes and slug wasn't manually edited
        if (name === 'studioName' && !formData.isSlugEdited) {
            newFormData.slug = generateSlug(value);
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    studioName: formData.studioName,
                    slug: formData.slug,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    billingInfo: {
                        companyType: formData.companyType,
                        address: formData.address,
                        taxOffice: formData.taxOffice,
                        taxNumber: formData.taxNumber,
                        identityNumber: formData.identityNumber
                    }
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
            } else {
                setError(data.error || 'Kayıt başarısız oldu.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-green-600 animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Harika! Kaydınız Alındı</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Sayın **{formData.name}**, Weey.NET dünyasına hoş geldiniz! <br /><br />
                        Hesabınızı aktifleştirmek ve 7 günlük ücretsiz denemenizi başlatmak için **{formData.email}** adresine bir doğrulama e-postası gönderdik. <br /><br />
                        <span className="text-sm italic">Not: E-posta ulaşmadıysa Spam/Gereksiz kutusunu kontrol etmeyi unutmayın.</span>
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
                    >
                        Giriş Sayfasına Git
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Visual & Benefits */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/60 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2535&auto=format&fit=crop")' }}
                />

                <div className="relative z-20 flex flex-col justify-between p-12 w-full text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <Camera className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-2xl font-bold">Weey.NET</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            Profesyonel Fotoğrafçılar İçin<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Hepsi Bir Arada Çözüm
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 mb-8 max-w-md">
                            Müşterilerinizi yönetin, randevularınızı düzenleyin ve fotoğraf galerilerinizi tek bir yerden paylaşın.
                        </p>

                        <div className="space-y-4">
                            {[
                                '7 Gün Ücretsiz Deneme Sürümü',
                                '3GB Depolama Alanı Hedİye',
                                'Kendi Adınıza Özel Web Sitesi',
                                'Online Randevu Yönetimi'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-gray-400">
                        © 2026 Weey.NET. Tüm hakları saklıdır.
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-md w-full">
                    <div className="text-center lg:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Hesap Oluşturun</h2>
                        <p className="text-gray-500 mt-2">
                            7 günlük ücretsiz deneme sürümünü hemen başlatın. <br />
                            <span className="text-sm text-purple-600">Kredi kartı gerekmez.</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                            <span className="font-bold">Hata:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                                <User className="w-4 h-4" /> Kişisel Bilgiler
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="(0535) 222 22 22"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Business Info */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                                <Briefcase className="w-4 h-4" /> Firma Bilgileri
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stüdyo / Firma Adı</label>
                                <input
                                    name="studioName"
                                    type="text"
                                    required
                                    value={formData.studioName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Foto Stüdyo"
                                />
                                <p className="text-xs text-gray-500 mt-1">Bu isim web sitenizde görünecektir.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Web Adresi (Link)</label>
                                <div className="flex items-center">
                                    <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm whitespace-nowrap">
                                        Weey.NET.com/studio/
                                    </span>
                                    <input
                                        name="slug"
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => {
                                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                            setFormData({ ...formData, slug: val, isSlugEdited: true });
                                        }}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                                        placeholder="studyo-adi"
                                    />
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                    Müşterileriniz bu link üzerinden size ulaşacaktır.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Firma Türü (Fatura İçin)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${formData.companyType === 'individual' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="companyType"
                                            value="individual"
                                            checked={formData.companyType === 'individual'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Şahıs Şirketi</span>
                                    </label>
                                    <label className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${formData.companyType === 'corporate' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="companyType"
                                            value="corporate"
                                            checked={formData.companyType === 'corporate'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="font-medium">Limited / A.Ş.</span>
                                    </label>
                                </div>
                            </div>

                            {formData.companyType === 'individual' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">T.C. Kimlik No</label>
                                    <input
                                        name="identityNumber"
                                        type="text"
                                        required
                                        maxLength={11}
                                        value={formData.identityNumber}
                                        onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value.replace(/\D/g, '') })}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        placeholder="11111111111"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi</label>
                                        <input
                                            name="taxOffice"
                                            type="text"
                                            required
                                            value={formData.taxOffice}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Vergi Dairesi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                                        <input
                                            name="taxNumber"
                                            type="text"
                                            required
                                            value={formData.taxNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Vergi No"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea
                                    name="address"
                                    required
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Fatura Adresi"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>İşleniyor...</span>
                                </>
                            ) : (
                                <>
                                    <span>Deneme Sürümünü Başlat</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Zaten hesabınız var mı?{' '}
                            <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700">
                                Giriş Yap
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Mobile Footer/Disclaimer */}
            <div className="lg:hidden absolute bottom-4 w-full text-center text-[10px] text-gray-400">
                © 2026 Weey.NET
            </div>
        </div>
    );
}
