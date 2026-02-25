'use client';

import { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Camera, MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const CONTACT_INFO = [
    { icon: <MapPin className="w-5 h-5" />, color: 'bg-[#ead5f5] text-[#5d2b72]', label: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:123 Kat:8, 34394 Şişli / İstanbul' },
    { icon: <Phone className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600', label: 'Telefon', value: '+90 (212) 555 00 00' },
    { icon: <Mail className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', label: 'E-posta', value: 'destek@weey.net' },
    { icon: <Clock className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600', label: 'Çalışma Saatleri', value: 'Pzt – Cuma: 09:00 – 18:00' },
];

export default function IletisimPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1200)); // Simulate send
        setSent(true);
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Hero */}
            <section className="relative pt-44 pb-20 px-6 bg-gradient-to-br from-[#f7eefa] via-white to-[#f7eefa] overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ead5f5]/50 rounded-full blur-[130px] pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ead5f5] border border-[#d4aae8] text-[#4a2260] text-[13px] font-bold mb-8">
                        <Mail className="w-4 h-4" /> İletişim
                    </span>
                    <h1 className="text-5xl font-black tracking-tight mb-5">
                        Bize <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-[#5d2b72]">Ulaşın</span>
                    </h1>
                    <p className="text-lg text-gray-500">Sorularınız, önerileriniz veya teknik destek talepleriniz için buradayız. En kısa sürede geri döneceğiz.</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
                    {/* Form */}
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Mesaj Gönderin</h2>

                        {sent ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Mesajınız Alındı!</h3>
                                <p className="text-gray-500 max-w-xs">En geç 1 iş günü içinde size geri döneceğiz.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ad Soyad</label>
                                        <input
                                            type="text" required
                                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7a3a94]/30 focus:border-[#9e5bb8] transition-all"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Telefon</label>
                                        <input
                                            type="tel"
                                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7a3a94]/30 focus:border-[#9e5bb8] transition-all"
                                            placeholder="+90 (___) ___ __ __"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">E-posta</label>
                                    <input
                                        type="email" required
                                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7a3a94]/30 focus:border-[#9e5bb8] transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Konu</label>
                                    <select
                                        value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-[15px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7a3a94]/30 focus:border-[#9e5bb8] transition-all"
                                    >
                                        <option value="">Konu seçin...</option>
                                        <option>Teknik Destek</option>
                                        <option>Paket & Fiyatlandırma</option>
                                        <option>Kurumsal Çözüm</option>
                                        <option>Genel Bilgi</option>
                                        <option>Diğer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mesajınız</label>
                                    <textarea
                                        required rows={5}
                                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7a3a94]/30 focus:border-[#9e5bb8] transition-all resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5d2b72] to-[#5d2b72] text-white font-black text-[15px] shadow-lg shadow-[#7a3a94]/25 hover:from-[#4a2260] hover:to-[#4a2260] hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {sending ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Gönder</>}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">İletişim Bilgileri</h2>
                        <div className="space-y-4 mb-10">
                            {CONTACT_INFO.map((c, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>{c.icon}</div>
                                    <div>
                                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                                        <p className="text-[15px] font-semibold text-gray-900">{c.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="w-full h-48 rounded-3xl bg-gradient-to-br from-[#ead5f5] to-[#ead5f5] border border-[#d4aae8] flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-8 h-8 text-[#7a3a94] mx-auto mb-2" />
                                <p className="text-[13px] font-semibold text-[#4a2260]">Şişli, İstanbul</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
