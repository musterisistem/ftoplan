'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Home } from 'lucide-react';

export default function HomepagePage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
    }, [status, router]);

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa Ayarları</h1>
                    <p className="text-gray-500">Hero ve özellik alanlarını düzenleyin</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ana Sayfa Özelleştirmesi</h2>
                <p className="text-gray-500 mb-4">Ana sayfa düzenleme özelliği yakında eklenecek.</p>
                <p className="text-sm text-gray-400">Şimdilik ana sayfa içeriği tema tarafından otomatik oluşturulmaktadır.</p>
            </div>
        </div>
    );
}
