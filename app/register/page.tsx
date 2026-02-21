'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Camera, CheckCircle, User, Mail, Lock, Briefcase, Calendar, Image as ImageIcon, CreditCard, Globe, ArrowRight, Package
} from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [intendedAction, setIntendedAction] = useState<'trial' | 'purchase'>('trial');
    const [selectedPackage, setSelectedPackage] = useState<'trial' | 'standart' | 'kurumsal'>('trial');

    const [formData, setFormData] = useState({
        name: '',
        studioName: '',
        slug: '',
        isSlugEdited: false,
        email: '',
        phone: '',
        password: '',
        companyType: 'individual',
        address: '',
        taxOffice: '',
        taxNumber: '',
        identityNumber: '',
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i')
            .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4)}`;
        if (phoneNumberLength < 9) return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
        return `(${phoneNumber.slice(0, 4)}) ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'phone') {
            const formatted = formatPhoneNumber(value);
            if (formatted.length <= 19) newFormData[name] = formatted;
            else return;
        }

        if (name === 'studioName' && !formData.isSlugEdited) {
            newFormData.slug = generateSlug(value);
        }

        setFormData(newFormData);
    };

    const handleNextStep = () => {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    intendedAction: selectedPackage === 'trial' ? 'trial' : 'purchase',
                    selectedPackage: selectedPackage,
                    // Note: Actual selectedPackage could be passed here if backend wants to pre-select, but standard flow uses redirect
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
                        Sayın <strong>{formData.name}</strong>, Weey.NET dünyasına hoş geldiniz! <br /><br />
                        Hesabınızı aktifleştirmek için <strong>{formData.email}</strong> adresine bir doğrulama e-postası gönderdik. Lütfen e-postanızı kontrol edin. <br /><br />
                        <span className="text-sm italic">Not: E-posta ulaşmadıysa Spam/Gereksiz kutusunu kontrol etmeyi unutmayın.</span>
                    </p>
                    <Link
                        href={'/login'}
                        className="block w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
                    >
                        Giriş Sayfasına Git
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50 relative">
            {/* Loading Modal */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 border border-gray-100 animate-in zoom-in-95">
                        <div className="w-20 h-20 mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-[#7B3FF2]/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#7B3FF2] animate-spin"></div>
                        </div>
                        <h3 className="text-[22px] font-black text-slate-900 mb-3 text-center tracking-tight">Hesabınız Oluşturuluyor</h3>
                        <p className="text-[14px] text-gray-500 text-center font-medium leading-relaxed">
                            Lütfen bekleyin, size özel arka plan ayarları yapılıyor ve e-postanız hazırlanıyor...
                        </p>
                    </div>
                </div>
            )}

            {/* Left Side - Visual & Info (Same as Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2670&auto=format&fit=crop")' }}
                />

                <div className="relative z-20 flex flex-col justify-between p-12 xl:p-20 w-full text-white">
                    <div>
                        <div className="flex items-center gap-4 mb-16">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                <Camera className="w-7 h-7 text-purple-300" />
                            </div>
                            <span className="text-3xl font-extrabold tracking-tight">Weey.NET</span>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6">
                            Fotoğraf Stüdyonuzu<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                Tek Yerden Yönetin
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 mb-12 max-w-lg leading-relaxed mix-blend-plus-lighter">
                            Müşteri ilişkileri, randevu takibi, fotoğraf teslimi ve sanal pos ile ödeme alma süreçlerinizi baştan uca profesyonelleştirin.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <Calendar className="w-6 h-6 text-purple-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">Akıllı Randevu</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Ajandanızı dijitalleştirin, çakışmaları ve unutulmaları önleyin.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <ImageIcon className="w-6 h-6 text-pink-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Müşteri Galerisi</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Kolay toplu fotoğraf seçimi ve dijital yüksek hızlı teslimat.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <CreditCard className="w-6 h-6 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Online Tahsilat</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Müşterilerden kapora alın, bakiyeleri sanal pos ile güvenle tahsil edin.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center shrink-0 border border-white/10">
                                    <Globe className="w-6 h-6 text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1.5">Premium Web Sayfası</h3>
                                    <p className="text-sm text-gray-400 leading-snug">Kurumsal markanıza özel portfolyo ve prestijli vitrin.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 mt-12 font-medium">
                        © 2026 Weey.NET Fotoğrafçı Çözümleri
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Mobile Background with subtle gradient */}
                <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-gray-50 to-gray-200 z-0" />

                <div className="relative z-10 w-full max-w-[30rem] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-50 my-4 sm:my-8">

                    <div className="text-center mb-8">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#7B3FF2] to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                                <Camera className="w-8 h-8" />
                            </div>
                        </div>
                        <h2 className="text-[28px] sm:text-[32px] font-black text-slate-900 tracking-tight lg:mb-2 mb-3">Hesap Oluşturun</h2>
                        <p className="text-gray-500 text-sm font-medium">
                            {step === 1 ? 'Önce nasıl başlamak istediğinizi seçin.' : 'Son olarak bilgilerinizi doldurun.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Option 1: Trial */}
                            <label className={`block relative p-5 border-2 rounded-[1.5rem] cursor-pointer transition-all duration-300 transform ${selectedPackage === 'trial' ? 'border-[#7B3FF2] bg-[#7B3FF2]/5 scale-[1.02] shadow-[0_8px_20px_-6px_rgba(123,63,242,0.15)]' : 'border-gray-100 hover:border-[#7B3FF2]/40 hover:bg-gray-50 hover:scale-[1.01]'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPackage === 'trial' ? 'border-[#7B3FF2]' : 'border-gray-300'}`}>
                                            {selectedPackage === 'trial' && <div className="w-2.5 h-2.5 bg-[#7B3FF2] rounded-full animate-in zoom-in" />}
                                        </div>
                                        <div>
                                            <h4 className="text-[17px] font-black text-slate-900 tracking-tight">Ücretsiz Deneme</h4>
                                            <p className="text-[13px] text-gray-500 mt-0.5 font-medium leading-tight">7 Gün ücretsiz, 3 GB Depolama, kredi kartsız.</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <span className="text-[17px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FF2] to-indigo-600">Ücretsiz</span>
                                    </div>
                                    <input type="radio" name="package" value="trial" checked={selectedPackage === 'trial'} onChange={() => setSelectedPackage('trial')} className="hidden" />
                                </div>
                            </label>

                            {/* Option 2: Standart */}
                            <label className={`block relative p-5 border-2 rounded-[1.5rem] cursor-pointer transition-all duration-300 transform ${selectedPackage === 'standart' ? 'border-[#7B3FF2] bg-[#7B3FF2]/5 scale-[1.02] shadow-[0_8px_20px_-6px_rgba(123,63,242,0.15)]' : 'border-gray-100 hover:border-[#7B3FF2]/40 hover:bg-gray-50 hover:scale-[1.01]'}`}>
                                <div className="absolute -top-3 left-6">
                                    <span className="bg-indigo-100/80 text-indigo-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">Mobil Uygulama Dahil</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPackage === 'standart' ? 'border-[#7B3FF2]' : 'border-gray-300'}`}>
                                            {selectedPackage === 'standart' && <div className="w-2.5 h-2.5 bg-[#7B3FF2] rounded-full animate-in zoom-in" />}
                                        </div>
                                        <div>
                                            <h4 className="text-[17px] font-black text-slate-900 tracking-tight">Standart Paket</h4>
                                            <p className="text-[13px] text-gray-500 mt-0.5 font-medium leading-tight">10 GB Depolama ve temel yönetim paneli özellikleri.</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end shrink-0 ml-2">
                                        <span className="text-xl font-black text-slate-900 tracking-tight">₺4.999</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">/ Yıl</span>
                                    </div>
                                    <input type="radio" name="package" value="standart" checked={selectedPackage === 'standart'} onChange={() => setSelectedPackage('standart')} className="hidden" />
                                </div>
                            </label>

                            {/* Option 3: Kurumsal */}
                            <label className={`block relative p-5 border-2 rounded-[1.5rem] cursor-pointer transition-all duration-300 transform ${selectedPackage === 'kurumsal' ? 'border-[#7B3FF2] bg-[#7B3FF2]/5 scale-[1.02] shadow-[0_8px_20px_-6px_rgba(123,63,242,0.15)]' : 'border-gray-100 hover:border-[#7B3FF2]/40 hover:bg-gray-50 hover:scale-[1.01]'}`}>
                                <div className="absolute -top-3 right-6">
                                    <span className="bg-gradient-to-r from-[#7B3FF2] to-indigo-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-md shadow-[#7B3FF2]/30">Önerilen</span>
                                </div>
                                <div className="absolute -top-3 left-6">
                                    <span className="bg-blue-100/80 text-blue-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm">Mobil Uygu. + Web Sitesi</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPackage === 'kurumsal' ? 'border-[#7B3FF2]' : 'border-gray-300'}`}>
                                            {selectedPackage === 'kurumsal' && <div className="w-2.5 h-2.5 bg-[#7B3FF2] rounded-full animate-in zoom-in" />}
                                        </div>
                                        <div>
                                            <h4 className="text-[17px] font-black text-slate-900 tracking-tight">Kurumsal Paket</h4>
                                            <p className="text-[13px] text-gray-500 mt-0.5 font-medium leading-tight">30 GB Depolama, Premium Web Sayfası dahil tam erişim.</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end shrink-0 ml-2">
                                        <span className="text-xl font-black text-slate-900 tracking-tight">₺9.999</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">/ Yıl</span>
                                    </div>
                                    <input type="radio" name="package" value="kurumsal" checked={selectedPackage === 'kurumsal'} onChange={() => setSelectedPackage('kurumsal')} className="hidden" />
                                </div>
                            </label>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-3.5 mt-8 bg-[#7B3FF2] hover:bg-[#6A32DE] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Devam Et <ArrowRight className="w-5 h-5" />
                            </button>

                            <div className="mt-8 pt-6 border-t border-gray-100/60">
                                <div className="bg-[#F8F9FF] border border-indigo-50 rounded-2xl p-5 text-center transition-colors hover:bg-indigo-50/50">
                                    <p className="text-[13px] text-gray-500 font-medium mb-3">
                                        Zaten hesabınız var mı?
                                    </p>
                                    <Link href="/login" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-purple-100 text-[#7B3FF2] text-[14px] font-bold rounded-xl shadow-sm hover:border-[#7B3FF2]/30 hover:text-[#6A32DE] hover:shadow-md transition-all">
                                        Panele Giriş Yap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-[#7B3FF2] uppercase tracking-wider flex items-center gap-2 border-b border-indigo-50 pb-2">
                                    <User className="w-4 h-4 text-[#7B3FF2]" /> Kişisel Bilgiler
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Ad Soyad</label>
                                        <input
                                            name="name" type="text" required value={formData.name} onChange={handleChange}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px]"
                                            placeholder="Örn: Ahmet Yılmaz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Telefon</label>
                                        <input
                                            name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px]"
                                            placeholder="(555) 555 55 55"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Email Adresi</label>
                                        <input
                                            name="email" type="email" required value={formData.email} onChange={handleChange}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px]"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Şifre</label>
                                        <input
                                            name="password" type="password" required value={formData.password} onChange={handleChange}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px] tracking-widest"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-[#7B3FF2] uppercase tracking-wider flex items-center gap-2 border-b border-indigo-50 pb-2">
                                    <Briefcase className="w-4 h-4 text-[#7B3FF2]" /> Firma Bilgileri
                                </h3>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Stüdyo / Firma Adı</label>
                                    <input
                                        name="studioName" type="text" required value={formData.studioName} onChange={handleChange}
                                        className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px]"
                                        placeholder="Weey Fotoğrafçılık"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Size Özel Web Adresi (Link)</label>
                                    <div className="flex items-center">
                                        <span className="px-3.5 py-3.5 bg-[#EDF0F7] border border-transparent border-r-0 rounded-l-2xl text-gray-500 text-[13px] whitespace-nowrap font-bold">
                                            weey.net/studio/
                                        </span>
                                        <input
                                            name="slug" type="text" required value={formData.slug}
                                            onChange={(e) => {
                                                const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                setFormData({ ...formData, slug: val, isSlugEdited: true });
                                            }}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-r-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-mono text-[14px] font-bold"
                                            placeholder="studyo-adi"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-2 ml-1">Firma Türü</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`flex items-center justify-center px-4 py-3.5 border-2 rounded-2xl cursor-pointer transition-all ${formData.companyType === 'individual' ? 'border-[#7B3FF2] bg-[#7B3FF2]/5 text-[#7B3FF2]' : 'border-gray-100 hover:bg-gray-50 hover:border-[#7B3FF2]/30'}`}>
                                            <input type="radio" name="companyType" value="individual" checked={formData.companyType === 'individual'} onChange={handleChange} className="hidden" />
                                            <span className="font-bold text-[13px]">Şahıs Şirketi</span>
                                        </label>
                                        <label className={`flex items-center justify-center px-4 py-3.5 border-2 rounded-2xl cursor-pointer transition-all ${formData.companyType === 'corporate' ? 'border-[#7B3FF2] bg-[#7B3FF2]/5 text-[#7B3FF2]' : 'border-gray-100 hover:bg-gray-50 hover:border-[#7B3FF2]/30'}`}>
                                            <input type="radio" name="companyType" value="corporate" checked={formData.companyType === 'corporate'} onChange={handleChange} className="hidden" />
                                            <span className="font-bold text-[13px]">Limited / A.Ş.</span>
                                        </label>
                                    </div>
                                </div>

                                {formData.companyType === 'individual' ? (
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">T.C. Kimlik No</label>
                                        <input
                                            name="identityNumber" type="text" required maxLength={11} value={formData.identityNumber}
                                            onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value.replace(/\D/g, '') })}
                                            className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium text-[14px]"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Vergi Dairesi</label>
                                            <input
                                                name="taxOffice" type="text" required value={formData.taxOffice} onChange={handleChange}
                                                className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium text-[14px]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Vergi No</label>
                                            <input
                                                name="taxNumber" type="text" required value={formData.taxNumber} onChange={handleChange}
                                                className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium text-[14px]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 ml-1">Adres</label>
                                    <textarea
                                        name="address" required rows={2} value={formData.address} onChange={handleChange}
                                        className="block w-full px-4 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] border border-transparent rounded-2xl focus:ring-4 focus:ring-[#7B3FF2]/10 focus:border-[#7B3FF2]/30 focus:bg-white text-gray-900 transition-all font-medium placeholder:font-normal placeholder:text-gray-400 text-[14px] resize-none"
                                        placeholder="Firma adresiniz..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3.5 bg-[#F4F6FB] hover:bg-[#EDF0F7] text-gray-700 font-bold rounded-2xl transition-all"
                                >
                                    Geri
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3.5 bg-[#7B3FF2] hover:bg-[#6A32DE] text-white text-[15px] font-bold rounded-2xl shadow-[0_8px_20px_-6px_rgba(123,63,242,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Hesabımı Oluştur <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
