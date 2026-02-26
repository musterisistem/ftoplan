'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Award, Globe, Check, ArrowRight, XCircle,
    Sparkles, Clock, Lock, Eye, EyeOff, Loader2,
    ShieldCheck, Star, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import CreativeLoader from '@/components/ui/CreativeLoader';

/* ─── Helpers ─────────────────────────────────────── */
const generateSlug = (text: string) =>
    text.toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `(${d.slice(0, 4)}) ${d.slice(4)}`;
    if (d.length < 9) return `(${d.slice(0, 4)}) ${d.slice(4, 7)} ${d.slice(7)}`;
    return `(${d.slice(0, 4)}) ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
};

/* ─── Package data ─────────────────────────────────── */
const PACKAGES = [
    {
        id: 'trial', name: 'Ücretsiz Deneme', price: 0,
        icon: Sparkles, iconBg: 'bg-amber-400', badge: null, highlight: false,
        tagline: '3 gün · Kredi kartı gerekmez',
        desc: 'Sistemimizi keşfetmeniz için tasarlanmış risksiz başlangıç planı.',
        features: [
            '500 MB Hızlı Bulut Depolama',
            '1 Aktif Müşteri Takibi',
            '30 Fotoğraflık Deneme Galerisi',
            'Randevu Sistemi Önizlemesi',
            'Mobil Uygulama Erişimi (iOS/Android)',
            'Online Cari Hesap Girişi',
            'Otomatik Fotoğraf Optimizasyonu'
        ],
        missing: ['Filigransız Fotoğraf', 'Özel Web Sitesi', '7/24 Destek'],
    },
    {
        id: 'standart', name: 'Standart Paket', price: 9499,
        icon: Award, iconBg: 'bg-[#5d2b72]', badge: 'En Popüler', highlight: true,
        tagline: '₺791/ay · Yıllık faturalandırma',
        desc: 'Büyüyen stüdyolar için tüm iş süreçlerini dijitalleştiren profesyonel çözüm.',
        features: [
            '10 GB Güvenli Bulut Arşivi',
            'Sınırsız Müşteri Kaydı & Yönetimi',
            'Sınırsız Fotoğraf Yükleme & Paylaşım',
            'Filigransız ve Şifreli Müşteri Galerileri',
            'Görsel Fotoğraf Seçim Arayüzü',
            'HIGHLIGHT: Otomatik Boyut Küçültme & Optimizasyon',
            'Otomatik Randevu SMS & Mail Hatırlatıcılar',
            'Gelişmiş Finansal Gelir-Gider Takibi',
            'Dijital Sözleşme İmzalama Altyapısı',
            'Tam Teşekküllü Mobil Uygulama Paneli'
        ],
        missing: ['Özel Web Sitesi'],
    },
    {
        id: 'kurumsal', name: 'Kurumsal Paket', price: 19999,
        icon: Globe, iconBg: 'bg-indigo-600', badge: 'Elite', highlight: false,
        tagline: '₺1.667/ay · Yıllık faturalandırma',
        desc: 'Markasını büyütmek ve premium bir deneyim sunmak isteyen stüdyolar için en üst seviye çözüm.',
        features: [
            '30 GB Genişletilebilir Depolama Alanı',
            'Stüdyonuza Özel Profesyonel Web Sitesi',
            'Özel Alan Adı Desteği (domain.com)',
            'Kurumsal İş E-posta Adresi (info@...)',
            'Markanıza Özel Arayüz Özelleştirmeleri',
            'HIGHLIGHT: Otomatik Boyut Küçültme & Optimizasyon',
            '--- EKSTRA ÖZELLİKLER ---',
            '7/24 VIP Müşteri ve Teknik Destek Hattı',
            'Çoklu Ekip & Asistan Yetkilendirme Sistemi',
            'Detaylı İş Analizi ve Performans Raporları',
            'Yapay Zeka Destekli Fotoğraf Tasnifleme',
            'Gelişmiş Müşteri Sadakat Programı Modülü',
            'Öncelikli Yeni Özellik Erişimi',
            'Tüm Standart Paket Özellikleri Dahildir'
        ],
        missing: [],
    },
];

/* ─── Registration Form ─────────────────────────────── */
function RegistrationForm({ pkgId, onSuccess }: { pkgId: string; onSuccess: () => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [companyType, setCompanyType] = useState<'individual' | 'corporate'>('individual');
    const [form, setForm] = useState({
        name: '', studioName: '', slug: '', isSlugEdited: false,
        email: '', phone: '', password: '',
        address: '', taxOffice: '', taxNumber: '', identityNumber: '',
    });

    const slugPreview = form.slug || generateSlug(form.studioName);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => {
            const u: any = { ...prev, [name]: value };
            if (name === 'phone') u.phone = formatPhone(value);
            if (name === 'studioName' && !prev.isSlugEdited) u.slug = generateSlug(value);
            if (name === 'slug') { u.slug = generateSlug(value); u.isSlugEdited = true; }
            return u;
        });
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
                    name: form.name, studioName: form.studioName, slug: slugPreview,
                    email: form.email, phone: form.phone, password: form.password,
                    address: form.address, selectedPackage: pkgId,
                    intendedAction: pkgId === 'trial' ? 'trial' : 'purchase',
                    billingInfo: {
                        companyType, address: form.address,
                        taxOffice: form.taxOffice, taxNumber: form.taxNumber,
                        identityNumber: form.identityNumber,
                    },
                }),
            });
            const data = await res.json();
            if (res.ok) {
                const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
                if (result?.ok) {
                    if (pkgId === 'trial') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push(`/checkout?package=${pkgId}`);
                    }
                } else {
                    router.push('/login?registered=1');
                }
            } else {
                setError(data.error || 'Kayıt tamamlanamadı.');
                setLoading(false);
            }
        } catch {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    const inp = "w-full px-4 py-3 text-[15px] text-slate-800 bg-[#f8faff] border border-slate-200 rounded-xl placeholder:text-slate-300 focus:outline-none focus:border-[#5d2b72] focus:ring-4 focus:ring-[#5d2b72]/6 transition-all font-[inherit]";

    return (
        <div className="h-full overflow-y-auto pr-0.5">
            <CreativeLoader isVisible={loading} message="Paneliniz Hazırlanıyor" subMessage="Bilgileriniz işleniyor, lütfen bekleyin... Sayfayı kapatmayın." />

            <form onSubmit={handleSubmit} className="space-y-5 py-1">

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium items-start">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ad Soyad */}
                <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Ad Soyad <span className="text-[#5d2b72]">*</span></label>
                    <input name="name" required value={form.name} onChange={handleChange} className={inp} placeholder="Adınız Soyadınız" />
                </div>

                {/* Stüdyo Adı */}
                <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Stüdyo / İşyeri Adı <span className="text-[#5d2b72]">*</span></label>
                    <input name="studioName" required value={form.studioName} onChange={handleChange} className={inp} placeholder="Örn: Elif Fotoğraf Stüdyosu" />
                    {form.studioName && (
                        <div className="mt-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">Müşteri adres:</span>
                            <span className="text-[12px] font-bold text-[#5d2b72] truncate">weey.net/{slugPreview}</span>
                        </div>
                    )}
                </div>

                {/* E-posta + Telefon */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">E-posta <span className="text-[#5d2b72]">*</span></label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange} className={inp} placeholder="ornek@email.com" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Telefon <span className="text-[#5d2b72]">*</span></label>
                        <input name="phone" required value={form.phone} onChange={handleChange} className={inp} placeholder="(555) 555 55 55" />
                    </div>
                </div>

                {/* Fatura Tipi */}
                <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-2">Fatura Tipi <span className="text-[#5d2b72]">*</span></label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {[{ val: 'individual', label: 'Şahıs Şirketi' }, { val: 'corporate', label: 'Limited / A.Ş.' }].map(opt => (
                            <button key={opt.val} type="button" onClick={() => setCompanyType(opt.val as any)}
                                className={`py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${companyType === opt.val
                                    ? 'bg-[#5d2b72] border-[#5d2b72] text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {companyType === 'individual' ? (
                            <motion.div key="i" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">TC Kimlik No <span className="text-[#5d2b72]">*</span></label>
                                    <input name="identityNumber" required value={form.identityNumber} onChange={handleChange} maxLength={11} className={inp} placeholder="11 haneli kimlik numaranız" />
                                    <p className="text-[11px] text-slate-400 mt-1 ml-0.5">Fatura düzenlemek için zorunludur.</p>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">İşletme Adresi <span className="text-[#5d2b72]">*</span></label>
                                    <input name="address" required value={form.address} onChange={handleChange} className={inp} placeholder="Mahalle, cadde, no, ilçe / il" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="c" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Vergi Dairesi <span className="text-[#5d2b72]">*</span></label>
                                        <input name="taxOffice" required value={form.taxOffice} onChange={handleChange} className={inp} placeholder="Örn: Kadıköy" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Vergi No <span className="text-[#5d2b72]">*</span></label>
                                        <input name="taxNumber" required value={form.taxNumber} onChange={handleChange} maxLength={11} className={inp} placeholder="Vergi numaranız" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Şirket Adresi <span className="text-[#5d2b72]">*</span></label>
                                    <input name="address" required value={form.address} onChange={handleChange} className={inp} placeholder="Mahalle, cadde, no, ilçe / il" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Şifre */}
                <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-1.5">Şifre <span className="text-[#5d2b72]">*</span></label>
                    <div className="relative">
                        <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange} className={`${inp} pr-11`} placeholder="En az 8 karakter" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Uyarı */}
                <div className="flex gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-amber-700 leading-relaxed">
                        Kayıt sonrası e-postanıza <strong>doğrulama linki</strong> gönderilecektir. Tüm bilgiler panelinize otomatik aktarılır.
                    </p>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold text-[15px] rounded-xl shadow-md shadow-purple-200 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Kayıt Ol ve Paneli Aç <ChevronRight className="w-5 h-5" /></>}
                </button>

                <p className="text-center text-[13px] text-slate-400">
                    Zaten hesabınız var mı?{' '}
                    <a href="/login" className="text-[#5d2b72] font-semibold hover:underline">Giriş yapın</a>
                </p>
            </form>
        </div>
    );
}

/* ─── Main ─────────────────────────────────────────── */
function PackagesContent() {
    const searchParams = useSearchParams();
    const initialPkg = searchParams.get('package') || null;
    const [selectedPkg, setSelectedPkg] = useState<string | null>(initialPkg);

    const activePkg = PACKAGES.find(p => p.id === selectedPkg);
    const formOpen = !!activePkg;

    return (
        <div className="min-h-screen bg-[#f8faff] text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 lg:pt-44 lg:pb-32">
                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
                    className="text-center mb-14 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                        <Zap className="w-3.5 h-3.5" /> Paket Seçin &amp; Hemen Başlayın
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                        Stüdyonuz İçin<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-purple-600">
                            En Doğru Plan
                        </span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Bir plan seçin — sağda açılan formu doldurun — paneliniz anında hazır olsun.
                    </p>
                </motion.div>

                {/* Split layout */}
                <div className={`flex gap-8 items-start transition-all duration-500 ${formOpen ? 'flex-col lg:flex-row' : 'flex-col'}`}>

                    {/* LEFT: Package Cards */}
                    <div className={`transition-all duration-500 ${formOpen ? 'w-full lg:w-[420px] shrink-0' : 'w-full max-w-5xl mx-auto'}`}>
                        <div className={`flex gap-5 ${formOpen ? 'flex-col' : 'grid md:grid-cols-3'}`}>
                            {PACKAGES.map((pkg, i) => {
                                const Icon = pkg.icon;
                                const isSelected = selectedPkg === pkg.id;
                                return (
                                    <motion.button key={pkg.id} onClick={() => setSelectedPkg(pkg.id)}
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: formOpen ? 0 : 0.07 * i }}
                                        className={`relative text-left w-full rounded-2xl border-2 transition-all duration-300 group overflow-hidden
                                            ${formOpen ? 'p-5' : 'p-7'}
                                            ${isSelected
                                                ? 'border-[#5d2b72] bg-white shadow-[0_4px_24px_rgba(93,43,114,0.12)]'
                                                : pkg.highlight && !formOpen
                                                    ? 'border-[#5d2b72]/20 bg-white shadow-[0_8px_40px_rgba(93,43,114,0.08)] md:-translate-y-3 hover:border-[#5d2b72]/40'
                                                    : 'border-slate-100 bg-white shadow-sm hover:border-[#5d2b72]/25 hover:shadow-md'}`}>

                                        {pkg.badge && !formOpen && (
                                            <span className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-b-2xl shadow-[0_4px_12px_rgba(93,43,114,0.3)] whitespace-nowrap z-10 animate-pulse">
                                                {pkg.badge}
                                            </span>
                                        )}

                                        <div className={`flex ${formOpen ? 'items-center gap-4' : 'flex-col'}`}>
                                            <div className={`${pkg.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform shrink-0
                                                ${formOpen ? 'w-10 h-10' : 'w-14 h-14 mb-6'}`}>
                                                <Icon className={formOpen ? 'w-5 h-5' : 'w-7 h-7'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`font-black text-slate-900 tracking-tight ${formOpen ? 'text-base' : 'text-2xl'}`}>{pkg.name}</p>
                                                    {isSelected && <CheckCircle className="w-6 h-6 text-[#5d2b72] shrink-0" />}
                                                </div>
                                                <p className={`font-bold text-[#5d2b72] ${formOpen ? 'text-[12px]' : 'text-lg mt-1'}`}>
                                                    {pkg.price === 0 ? 'Ücretsiz Başlangıç' : `₺${pkg.price.toLocaleString('tr-TR')}`}
                                                    {pkg.price > 0 && <span className="text-slate-400 text-sm font-medium ml-1">/yıl</span>}
                                                </p>
                                                {!formOpen && <p className="text-[13px] font-medium text-slate-400 mt-1">{pkg.tagline}</p>}
                                            </div>
                                        </div>

                                        {!formOpen && (
                                            <>
                                                <p className="text-[14px] text-slate-600 mt-6 mb-8 leading-relaxed font-medium">{pkg.desc}</p>
                                                <div className="space-y-4 mb-10">
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Neler Dahil?</p>
                                                    <ul className="space-y-3">
                                                        {pkg.features.map((f, fi) => {
                                                            const isHighlight = f.startsWith('HIGHLIGHT:');
                                                            const isDivider = f.startsWith('---');
                                                            const cleanF = f.replace('HIGHLIGHT:', '').replace('---', '').trim();

                                                            if (isDivider) {
                                                                return (
                                                                    <li key={fi} className="py-2 flex items-center gap-3">
                                                                        <div className="h-px bg-slate-100 flex-1" />
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2">{cleanF}</span>
                                                                        <div className="h-px bg-slate-100 flex-1" />
                                                                    </li>
                                                                );
                                                            }

                                                            return (
                                                                <motion.li
                                                                    key={fi}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.1 + fi * 0.05 }}
                                                                    className={`flex items-start gap-3 text-[14px] font-semibold leading-snug rounded-lg transition-colors
                                                                        ${isHighlight ? 'bg-emerald-50 p-2 text-emerald-700 ring-1 ring-emerald-100' : 'text-slate-700'}`}
                                                                >
                                                                    <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0
                                                                        ${isHighlight ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
                                                                        <Check className={`w-2.5 h-2.5 stroke-[3] ${isHighlight ? 'text-white' : 'text-emerald-500'}`} />
                                                                    </div>
                                                                    {cleanF}
                                                                </motion.li>
                                                            );
                                                        })}
                                                        {pkg.missing.map((f, fi) => (
                                                            <li key={fi} className="flex items-start gap-3 text-[14px] font-medium text-slate-300 leading-snug px-2">
                                                                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className={`w-full py-4 rounded-2xl text-[15px] font-black flex items-center justify-center gap-2 transition-all shadow-sm
                                                    ${pkg.highlight
                                                        ? 'bg-[#5d2b72] text-white shadow-[0_8px_25px_rgba(93,43,114,0.25)] group-hover:shadow-[0_12px_35px_rgba(93,43,114,0.35)] group-hover:-translate-y-0.5'
                                                        : 'bg-slate-50 text-slate-700 group-hover:bg-slate-100 group-hover:text-slate-900 group-hover:-translate-y-0.5'}`}>
                                                    Bu Planla Başla <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {formOpen && (
                            <button onClick={() => setSelectedPkg(null)} className="mt-4 text-[13px] text-slate-400 hover:text-slate-700 font-semibold transition-colors flex items-center gap-1">
                                ← Tüm planları göster
                            </button>
                        )}
                    </div>

                    {/* RIGHT: Registration Form */}
                    <AnimatePresence>
                        {formOpen && activePkg && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 32 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 32 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="flex-1 w-full"
                            >
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-8">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-black text-[#1a0b2e] mb-2 tracking-tight">Hesabınızı Oluşturun</h2>
                                        <p className="text-slate-500 text-base font-medium">Bilgilerinizi girerek panelinizi birkaç saniyede açın.</p>
                                    </div>
                                    <RegistrationForm pkgId={activePkg.id} onSuccess={() => { }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Trust badges */}
                {!formOpen && (
                    <div className="flex flex-wrap items-center justify-center gap-8 mt-10 opacity-50 hover:opacity-90 transition-opacity duration-500">
                        <span className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><ShieldCheck className="w-4 h-4 text-emerald-500" /> KVKK Uyumlu</span>
                        <span className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><Lock className="w-4 h-4 text-blue-500" /> SSL Şifreli</span>
                        <span className="flex items-center gap-2 text-slate-500 text-[12px] font-semibold"><Star className="w-4 h-4 text-amber-400" /> 500+ Stüdyo Kullanıyor</span>
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}

export default function PackagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8faff] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#5d2b72]" /></div>}>
            <PackagesContent />
        </Suspense>
    );
}
