'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Camera, ArrowRight, ArrowLeft,
    Check, CheckCircle, Zap, CreditCard,
    Building, Shield, HardDrive, Sparkles, Globe,
    Loader2, Eye, EyeOff, ChevronRight, Clock
} from 'lucide-react';
import { signIn } from 'next-auth/react';

/* ─── Helpers ───────────────────────────────────── */
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

/* ─── Components ──────────────────────────────── */

function Nav() {
    return (
        <nav className="fixed top-0 inset-x-0 z-[100] px-6 py-6 bg-white/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logoweey.png" alt="Weey Logo" className="h-8" />
                    <span className="font-bold text-lg text-slate-900">Weey.NET</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Home</Link>
                    <Link href="/login" className="text-sm font-bold text-slate-900">Giriş Yap</Link>
                </div>
            </div>
        </nav>
    );
}

function SuccessPopup({ packageName, email, password }: { packageName: string; email: string; password: string }) {
    const [countdown, setCountdown] = useState(20);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                const next = prev - 1;
                setProgress(((20 - next) / 20) * 100);
                if (next <= 0) {
                    clearInterval(interval);
                    signIn('credentials', { email, password, redirect: true, callbackUrl: '/admin/dashboard' });
                }
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [email, password]);

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white rounded-[40px] p-10 text-center shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black mb-2">Harika!</h2>
                <p className="text-slate-500 mb-8 font-medium">
                    <span className="text-[#B066FE] font-bold">{packageName}</span> paneliniz hazırlanıyor.
                </p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-[#B066FE] to-[#8E54E9] transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" /> Panelinize {countdown}sn kaldı...
                </div>
            </div>
        </div>
    );
}

/* ─── Main Content ────────────────────────────── */

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPackage = searchParams.get('package') || 'trial';

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [packagesData, setPackagesData] = useState<any[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string>(initialPackage);
    const [successData, setSuccessData] = useState<{ packageName: string; email: string; password: string } | null>(null);

    // Form
    const [formData, setFormData] = useState({
        name: '', studioName: '', slug: '', isSlugEdited: false,
        email: '', phone: '', password: '', companyType: 'individual',
        address: '', taxOffice: '', taxNumber: '', identityNumber: '',
    });

    useEffect(() => {
        fetch('/api/packages').then(r => r.ok ? r.json() : []).then(setPackagesData).catch(() => { });
    }, []);

    const selectedPkgData = packagesData.find(p => p.id === selectedPackage) || null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let updated: any = { ...formData, [name]: value };
        if (name === 'phone') updated.phone = formatPhone(value);
        if (name === 'studioName' && !formData.isSlugEdited) updated.slug = generateSlug(value);
        setFormData(updated);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    intendedAction: selectedPackage === 'trial' ? 'trial' : 'purchase',
                    selectedPackage,
                    billingInfo: formData
                }),
            });
            const data = await res.json();
            if (res.ok) {
                if (selectedPackage === 'trial') {
                    const result = await signIn('credentials', { email: formData.email, password: formData.password, redirect: false });
                    router.push(result?.ok ? '/admin/dashboard' : '/login');
                } else {
                    setStep(3);
                }
            } else { setError(data.error || 'Kayıt başarısız.'); }
        } catch { setError('Sistem hatası.'); } finally { setLoading(false); }
    };

    const inputClasses = "w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-400 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#B066FE] focus:bg-white transition-all";

    if (successData) return <SuccessPopup {...successData} />;

    return (
        <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans antialiased">
            <Nav />

            <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-[-10%] w-[350px] h-[350px] bg-green-50/30 rounded-full blur-[80px] -z-10" />

            <div className="max-w-6xl mx-auto px-6 pt-40 pb-20">

                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-20 max-w-sm mx-auto p-2 bg-white rounded-full shadow-sm border border-slate-100">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-black text-white' : 'bg-slate-50 text-slate-300'}`}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 mx-2 rounded-full ${step > s ? 'bg-black' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Package */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose your plan</h1>
                            <p className="text-slate-500 font-medium">Start growing your studio today.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { id: 'trial', name: 'Ücretsiz Deneme', price: 0, icon: <Zap className="text-amber-500" />, desc: '14 gün deneme' },
                                { id: 'standart', name: 'Standart Paket', price: 2499, icon: <HardDrive className="text-blue-500" />, desc: '/ yıl' },
                                { id: 'kurumsal', name: 'Kurumsal Paket', price: 4999, icon: <Globe className="text-purple-600" />, desc: '/ yıl', best: true }
                            ].map((pkg) => (
                                <button key={pkg.id} onClick={() => { setSelectedPackage(pkg.id); setStep(2); }}
                                    className={`relative text-left bg-white p-10 rounded-[40px] border-[3px] transition-all hover:scale-[1.02] shadow-xl shadow-slate-200/50 ${selectedPackage === pkg.id ? 'border-[#B066FE]' : 'border-white hover:border-slate-100'}`}>
                                    {pkg.best && <div className="absolute top-6 right-6 px-3 py-1 bg-purple-100 text-[#B066FE] rounded-full text-[10px] font-black uppercase">Popüler</div>}
                                    <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-8">{pkg.icon}</div>
                                    <h3 className="text-slate-400 font-black uppercase text-[11px] tracking-widest mb-2">{pkg.name}</h3>
                                    <div className="text-5xl font-black mb-4 font-mono">₺{pkg.price.toLocaleString()}</div>
                                    <p className="text-slate-500 text-sm font-medium mb-10">{pkg.desc}</p>
                                    <div className="w-full py-4 rounded-2xl bg-slate-50 text-slate-800 font-bold group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center gap-2">
                                        Seç ve Devam Et <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Form */}
                {step === 2 && (
                    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-white/40">
                            <button onClick={() => setStep(1)} className="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2 hover:text-slate-900 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Geri Dön
                            </button>
                            <h2 className="text-3xl font-bold mb-2">Hesap Bilgileri</h2>
                            <p className="text-slate-500 font-medium mb-10">Stüdyonuzu sisteme kaydedin.</p>

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ad Soyad</label>
                                        <input name="name" required value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Ad Soyad" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">GSM No</label>
                                        <input name="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="(555) 555 55 55" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">E-Posta</label>
                                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClasses} placeholder="eposta@email.com" />
                                    </div>
                                    <div className="col-span-2">
                                        <input name="studioName" required value={formData.studioName} onChange={handleChange} className={inputClasses} placeholder="Stüdyo Adı" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Şifre</label>
                                        <div className="relative">
                                            <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className={inputClasses} placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Devam Et <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <footer className="py-20 text-center border-t border-slate-100">
                <img src="/logoweey.png" alt="Logo" className="h-6 mx-auto mb-4 opacity-30" />
                <p className="text-slate-400 text-sm font-medium">© 2026 Weey Digital. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-[#B066FE]" /></div>}>
            <RegisterContent />
        </Suspense>
    );
}
