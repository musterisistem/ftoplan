import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutFailPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ödeme Başarısız</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Maalesef ödeme işleminiz gerçekleştirilemedi. Lütfen kredi kartı bilgilerinizi veya limitinizi kontrol ederek tekrar deneyin.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/packages"
                        className="inline-block w-full py-4 bg-gradient-to-r from-[#5d2b72] to-purple-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Paketlere Dön ve Tekrar Dene
                    </Link>
                    <Link
                        href="/iletisim"
                        className="inline-block w-full py-3 bg-white text-gray-600 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Destek Ekibine Ulaş
                    </Link>
                </div>
            </div>
        </div>
    );
}
