'use client';

import { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTACT_INFO = [
    { icon: MapPin, color: 'bg-[#5d2b72]', label: 'Adres', value: 'Levent Mah. Büyükdere Cad. No:123 Kat:8, 34394 Şişli / İstanbul' },
    { icon: Phone, color: 'bg-emerald-500', label: 'Telefon', value: '+90 (212) 555 00 00' },
    { icon: Mail, color: 'bg-blue-500', label: 'E-posta', value: 'destek@weey.net' },
    { icon: Clock, color: 'bg-amber-500', label: 'Çalışma Saatleri', value: 'Pzt – Cuma: 09:00 – 18:00' },
];

export default function IletisimPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1200));
        setSent(true);
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-[#f8faff] text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Floating Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 lg:pt-44 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Hero */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                            <Mail className="w-3.5 h-3.5" /> İletişim
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                            Bize{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] via-purple-600 to-purple-800">
                                Ulaşın
                            </span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed font-medium">
                            Sorularınız, önerileriniz veya teknik destek talepleriniz için buradayız.
                            En kısa sürede geri döneceğiz.
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
                        {CONTACT_INFO.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 * i, duration: 0.5 }}
                                    className="group bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-12 h-12 ${c.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{c.label}</p>
                                    <p className="text-[14px] font-semibold text-slate-800 leading-snug">{c.value}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Form + Map grid */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6">Mesaj Gönderin</h2>

                            {sent ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Mesajınız Alındı!</h3>
                                    <p className="text-slate-500 max-w-xs text-sm">En geç 1 iş günü içinde size geri döneceğiz.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5">Ad Soyad</label>
                                            <input
                                                type="text" required
                                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-[#f8faff] border border-slate-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5">Telefon</label>
                                            <input
                                                type="tel"
                                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-[#f8faff] border border-slate-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
                                                placeholder="+90 (___) ___ __ __"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5">E-posta</label>
                                        <input
                                            type="email" required
                                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-[#f8faff] border border-slate-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5">Konu</label>
                                        <select
                                            value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-[#f8faff] border border-slate-200 rounded-2xl font-medium text-[15px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] transition-all"
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
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1.5">Mesajınız</label>
                                        <textarea
                                            required rows={5}
                                            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-[#f8faff] border border-slate-200 rounded-2xl font-medium text-[15px] focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-[#5d2b72] shadow-sm resize-none"
                                            placeholder="Mesajınızı buraya yazın..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5d2b72] to-purple-800 text-white font-black text-[15px] shadow-[0_8px_25px_rgba(93,43,114,0.25)] hover:shadow-[0_12px_35px_rgba(93,43,114,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                                    >
                                        {sending
                                            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <><Send className="w-4 h-4" /> Mesajı Gönder</>
                                        }
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Right side: extra info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Map placeholder */}
                            <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex-1 min-h-[200px] flex items-center justify-center">
                                <div className="text-center p-10">
                                    <div className="w-16 h-16 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-[#5d2b72]" />
                                    </div>
                                    <p className="font-black text-slate-800 mb-1">Şişli, İstanbul</p>
                                    <p className="text-sm text-slate-400">Levent Mah. Büyükdere Cad. No:123</p>
                                </div>
                            </div>

                            {/* Quick contact card */}
                            <div className="bg-gradient-to-br from-[#5d2b72] via-purple-700 to-purple-800 rounded-[32px] p-8 text-white shadow-2xl shadow-purple-200">
                                <h3 className="text-lg font-black mb-2">Hızlı Destek</h3>
                                <p className="text-purple-200 text-sm mb-6">Mesai saatleri içinde 30 dakika içinde geri dönüyoruz.</p>
                                <a
                                    href="mailto:destek@weey.net"
                                    className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/10 mb-3"
                                >
                                    <Mail className="w-5 h-5 text-purple-200" />
                                    <div>
                                        <p className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">E-posta</p>
                                        <p className="font-bold text-white text-sm">destek@weey.net</p>
                                    </div>
                                </a>
                                <a
                                    href="tel:+902125550000"
                                    className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/10"
                                >
                                    <Phone className="w-5 h-5 text-purple-200" />
                                    <div>
                                        <p className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">Telefon</p>
                                        <p className="font-bold text-white text-sm">+90 (212) 555 00 00</p>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <PublicFooter />
        </div>
    );
}
