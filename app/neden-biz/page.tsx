'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Award, Zap, Shield, MessageSquare, ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const WHY = [
    {
        icon: Award,
        title: 'Tek İlgilendiğimiz Sektör: Fotoğrafçılık',
        body: 'Muhasebe yazılımı da değil, genel randevu sistemi de değiliz. Sadece fotoğrafçıların iş akışını anlıyor, sadece fotoğrafçılara yazıyoruz.',
        color: 'from-purple-50 to-[#f7eefa]',
        border: 'border-purple-100',
        iconBg: 'bg-[#5d2b72]',
    },
    {
        icon: Shield,
        title: 'Verileriniz Size Ait, Kimseyle Paylaşılmaz',
        body: 'Her stüdyo için ayrı ve izole altyapı. Müşteri bilgilerinize, fotoğraflarınıza, alacaklarınıza başkası erişemez. Hiç.',
        color: 'from-blue-50 to-indigo-50',
        border: 'border-blue-100',
        iconBg: 'bg-indigo-600',
    },
    {
        icon: Zap,
        title: 'Siz İstedikçe Biz Geliştiriyoruz',
        body: 'Her güncelleme, bir müşterimizin gerçek ihtiyacından doğuyor. Geri bildiriminiz doğrudan yazılıma yansır. Özel yazılımcınız gibiyiz.',
        color: 'from-amber-50 to-orange-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-500',
    },
    {
        icon: MessageSquare,
        title: 'Gerçek Kişi Desteği',
        body: 'Sorun yaşadığınızda boş ticket sistemleriyle değil, gerçek bir kişiyle muhatap olursunuz. Cevapsız bırakmıyoruz.',
        color: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-100',
        iconBg: 'bg-emerald-500',
    },
];

const FAQS = [
    {
        q: '3 günlük deneme süresi bittikten sonra ne olur?',
        a: 'Deneme süreniz bittiğinde hesabınız otomatik olarak pasif duruma geçer. Herhangi bir ücret kesilmez, kredi kartı da istenmez. İstediğiniz zaman ücretli plana geçerek hizmete devam edebilirsiniz.',
    },
    {
        q: 'Online ödeme ve kapora sistemi nasıl çalışıyor?',
        a: 'Müşteriniz randevu oluştururken belirlediğiniz kapora tutarını kredi kartıyla öder. Ödeme direkt olarak belirlediğiniz banka hesabınıza aktarılır. Taksit seçeneklerini siz belirlersiniz.',
    },
    {
        q: 'Dijital sözleşme yasal olarak geçerli mi?',
        a: 'Evet. Müşterinin ekran üzerinde imzaladığı dijital sözleşmeler, 5070 sayılı Elektronik İmza Kanunu kapsamında hukuki geçerliliğe sahiptir. Her imzalanmış sözleşme tarih ve IP bilgisiyle arşivlenir.',
    },
    {
        q: 'Mevcut müşteri verilerimi sisteme aktarabilir miyim?',
        a: 'Evet. Destek ekibimiz Excel veya CSV formatındaki müşteri listelerinizi sisteme aktarmanıza yardımcı olur. Ücretsiz veri göçü desteği sunuyoruz.',
    },
    {
        q: 'Birden fazla fotoğrafçı veya stüdyo için kullanabilir miyim?',
        a: 'Kurumsal planımızda birden fazla kullanıcı ekleyebilirsiniz. Her kullanıcıya farklı yetki seviyeleri tanımlayabilirsiniz (yönetici, fotoğrafçı, resepsiyonist).',
    },
    {
        q: 'Müşterim fotoğraf seçimini nasıl yapıyor?',
        a: 'Çekimi tamamlanan müşterinize özel bir galeri linki SMS/e-posta ile gönderilir. Müşteri bu link üzerinden fotoğraflarını önizleyip favorilediği görselleri seçer. Seçimler anlık olarak sizin paneline yansır.',
    },
    {
        q: 'Kendi domain adımla kullanabilir miyim?',
        a: 'Evet. Kurumsal planımızda kendi domain adınızı (ör. www.stüdyoadınız.com) sisteme bağlayabilirsiniz. Standart planda ise size özel bir alt alan adı tanımlanır.',
    },
    {
        q: 'Mobil uygulama var mı?',
        a: 'Evet. iOS ve Android için native uygulamamız mevcuttur. Randevu takvimi, müşteri yönetimi, ödeme takibi ve galeri paylaşımını telefonunuzdan rahatlıkla yönetebilirsiniz.',
    },
    {
        q: 'Teknik sorun yaşarsam nasıl destek alabilirim?',
        a: 'Canlı sohbet, WhatsApp ve e-posta üzerinden destek sunuyoruz. Mesai saatleri içinde 30 dakika içinde, mesai sonrası 4 saat içinde geri dönüyoruz. Kurumsal müşteriler için öncelikli destek hattı ayrıca tanımlanır.',
    },
    {
        q: 'Fotoğraf galerisi ne kadar depolama sunuyor?',
        a: 'Deneme paketinde 500 MB, Standart pakette 10 GB, Kurumsal pakette ise 30 GB depolama sunulmaktadır. Tüm fotoğraflar güvenli bulut altyapısında saklanır.',
    },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.4 }}
            className={`rounded-2xl border bg-white overflow-hidden transition-all duration-300 ${open ? 'border-[#5d2b72]/20 shadow-[0_4px_20px_rgba(93,43,114,0.08)]' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
        >
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
            >
                <span className={`font-bold text-[15px] leading-snug transition-colors ${open ? 'text-[#5d2b72]' : 'text-slate-800'}`}>
                    {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-all duration-300 ${open ? 'rotate-180 text-[#5d2b72]' : 'text-slate-400'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 text-[14px] text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function NedenBizPage() {
    return (
        <div className="min-h-screen bg-[#f8faff] text-gray-900 font-sans antialiased">
            <PublicHeader />

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm">
                        <Award className="w-3.5 h-3.5" /> Neden Biz?
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                        Sıradan Bir Takvim<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d2b72] to-purple-600">
                            Uygulaması Değiliz.
                        </span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Yüzlerce stüdyo sahibi ile konuştuk, her birinin aynı sorunları
                        yaşadığını gördük. Çözümü sadece fotoğrafçılar için tasarladık.
                    </p>
                </motion.div>
            </section>

            {/* Why cards */}
            <section className="pb-20 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {WHY.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className={`p-8 rounded-[28px] border bg-gradient-to-br ${item.color} ${item.border} hover:-translate-y-1 transition-transform duration-300`}
                            >
                                <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-[18px] font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-[14px] text-slate-600 leading-relaxed">{item.body}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Before / After Comparison */}
            <section className="py-10 px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 rounded-[36px] overflow-hidden shadow-2xl shadow-slate-200/80 border border-slate-100">
                    <div className="bg-gradient-to-br from-[#1a0b2e] to-slate-900 text-white p-10 md:p-12">
                        <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-6">Şu An Nerede Duruyorsunuz?</p>
                        <ul className="space-y-4">
                            {[
                                "Randevuları WhatsApp'tan alıyor, kağıda yazıyorsunuzdur",
                                'Ödeme almak için müşteriyi aramak zorunda kalıyorsunuzdur',
                                'Sözleşme yazdırıp elden imzalatıyorsunuzdur',
                                'Hangi müşteride ne kadar alacak var bilmiyorsunuzdur',
                            ].map((t, i) => (
                                <li key={i} className="flex items-start gap-3 text-[15px] text-slate-400">
                                    <span className="text-red-500 shrink-0 font-black">✗</span>
                                    <span className="line-through decoration-red-500/50">{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-[#5d2b72] to-purple-800 text-white p-10 md:p-12 flex flex-col justify-between">
                        <div>
                            <p className="text-purple-200 text-xs font-black uppercase tracking-widest mb-6">Platforma Geçtikten Sonra</p>
                            <ul className="space-y-4 mb-10">
                                {[
                                    'Müşteri kendi randevusunu web sitenizden oluşturur',
                                    'Kaparayı randevu anında online tahsil edersiniz',
                                    "Sözleşme SMS'le gönderilir, ekranda imzalanır",
                                    'Her müşterinin alacak durumu tek ekranda görünür',
                                ].map((t, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[15px] text-purple-100">
                                        <span className="text-emerald-300 shrink-0 font-black">✓</span>
                                        <span className="font-medium">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link
                            href="/packages"
                            className="text-center py-4 bg-white text-[#4a2260] rounded-full font-black text-[15px] hover:bg-gray-50 transition-all shadow-lg"
                        >
                            Hemen Ücretsiz Başla →
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-100 rounded-full text-[#5d2b72] text-[12px] font-black uppercase tracking-[0.15em] mb-6 shadow-sm">
                            <HelpCircle className="w-3.5 h-3.5" /> Sıkça Sorulan Sorular
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 mb-4">
                            Aklınızdaki Sorular
                        </h2>
                        <p className="text-slate-500 text-lg font-medium">
                            En çok merak edilen soruların yanıtları burada.
                            Bulamazsanız bize yazın.
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <FAQItem key={i} faq={faq} index={i} />
                        ))}
                    </div>

                    {/* CTA below FAQ */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-16 p-10 rounded-[32px] bg-gradient-to-br from-[#5d2b72] via-purple-700 to-indigo-700 text-white text-center shadow-2xl shadow-purple-200"
                    >
                        <h3 className="text-2xl font-black mb-3">Başka sorunuz mu var?</h3>
                        <p className="text-purple-200 mb-8 text-base">Destek ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/iletisim"
                                className="px-8 py-3.5 bg-white text-[#4a2260] rounded-full font-black hover:bg-gray-50 transition-all shadow-lg"
                            >
                                İletişime Geç
                            </Link>
                            <Link
                                href="/packages"
                                className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all"
                            >
                                Ücretsiz Dene <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
