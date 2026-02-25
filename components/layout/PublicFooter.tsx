import Link from 'next/link';
import { Lock } from 'lucide-react';

const COL_PLATFORM = [
    { href: '/ozellikler', label: 'Özellikler' },
    { href: '/neden-biz', label: 'Neden Biz?' },
    { href: '/paketler', label: 'Paketler' },
    { href: '/yorumlar', label: 'Yorumlar' },
    { href: '/sss', label: 'SSS' },
];

const COL_COMPANY = [
    { href: '/kurumsal', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/login', label: 'Giriş Yap' },
    { href: '/register', label: 'Üye Ol' },
];

const COL_LEGAL = [
    { href: '#', label: 'Gizlilik Politikası' },
    { href: '#', label: 'Kullanım Şartları' },
    { href: '#', label: 'KVKK' },
];

export default function PublicFooter() {
    return (
        <footer className="bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-6 xl:px-8 pt-16 pb-8">
                {/* Top row */}
                <div className="grid md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-5">
                            <img
                                src="/logoweey.png"
                                alt="Weey.NET"
                                style={{ height: '80px' }}
                                className="w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Türkiye&apos;nin fotoğraf stüdyolarına özel dijital yönetim platformu.
                        </p>
                        {/* Newsletter */}
                        <div className="flex bg-white/5 border border-white/10 rounded-full overflow-hidden">
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="bg-transparent px-4 py-2.5 text-[13px] outline-none flex-1 placeholder:text-gray-600 text-white"
                            />
                            <button className="bg-[#5d2b72] text-white text-[12px] font-bold px-4 py-2.5 hover:bg-[#7a3a94] transition-colors shrink-0">
                                Abone Ol
                            </button>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-bold text-sm mb-5 text-gray-200">Platform</h4>
                        <nav className="space-y-3">
                            {COL_PLATFORM.map(l => (
                                <Link key={l.href} href={l.href} className="block text-[14px] text-gray-400 hover:text-white transition-colors">
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-sm mb-5 text-gray-200">Şirket</h4>
                        <nav className="space-y-3">
                            {COL_COMPANY.map(l => (
                                <Link key={l.href} href={l.href} className="block text-[14px] text-gray-400 hover:text-white transition-colors">
                                    {l.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-sm mb-5 text-gray-200">Yasal</h4>
                        <nav className="space-y-3">
                            {COL_LEGAL.map(l => (
                                <a key={l.label} href={l.href} className="block text-[14px] text-gray-400 hover:text-white transition-colors">
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-[13px]">
                        © {new Date().getFullYear()} Weey.NET. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-gray-500 text-[12px]">256-bit SSL şifreleme ile korunmaktadır</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
