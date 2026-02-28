import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Ödeme Başarılı!</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Ödemeniz başarıyla alındı. Hesabınız arka planda aktifleştiriliyor. Hoş geldin e-postanız ile birlikte giriş linkiniz kısa süre içinde e-posta adresinize iletilecektir.
                </p>
                <Link
                    href="/login"
                    className="inline-block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all text-lg"
                >
                    Panele Giriş Yap
                </Link>
            </div>
        </div>
    );
}
