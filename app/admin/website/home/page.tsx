'use client';

import { useCorporateMembership } from '@/hooks/useCorporateMembership';
import CorporateMembershipRequired from '@/components/admin/CorporateMembershipRequired';
import { Loader2 } from 'lucide-react';

export default function WebsiteHomePage() {
    const { isCorporateMember, loading } = useCorporateMembership();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    if (!isCorporateMember) {
        return <CorporateMembershipRequired />;
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Ana Sayfa Ayarları</h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600 mb-4">
                        Web sitenizin ana sayfa içeriğini buradan düzenleyebilirsiniz.
                    </p>

                    {/* Ana sayfa ayarları form ve içerikleri buraya eklenecek */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">Ana sayfa düzenleme araçları yakında eklenecek...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
