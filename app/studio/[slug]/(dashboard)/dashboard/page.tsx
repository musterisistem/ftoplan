'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Image, Calendar, Package, Camera, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CustomerData {
    brideName: string;
    groomName: string;
    weddingDate: string;
    appointmentStatus: string;
    albumStatus: string;
    photos: Array<{ url: string; filename: string }>;
}

export default function StudioDashboardPage() {
    const { data: session } = useSession();
    const params = useParams();
    const slug = params.slug as string;
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.customerId) {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}`);
            if (res.ok) {
                setCustomer(await res.json());
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        const statuses: Record<string, { text: string; icon: string; color: string }> = {
            'cekim_yapilmadi': { text: 'Çekim Bekleniyor', icon: '📅', color: 'bg-yellow-100 text-yellow-700' },
            'cekim_yapildi': { text: 'Çekim Yapıldı', icon: '✅', color: 'bg-blue-100 text-blue-700' },
            'fotograflar_yuklendi': { text: 'Fotoğraflar Hazır', icon: '📸', color: 'bg-purple-100 text-purple-700' },
            'fotograflar_secildi': { text: 'Seçim Yapıldı', icon: '🎯', color: 'bg-green-100 text-green-700' },
            'album_bekleniyor': { text: 'Albüm Hazırlanıyor', icon: '📖', color: 'bg-orange-100 text-orange-700' },
            'teslim_edildi': { text: 'Teslim Edildi', icon: '🎉', color: 'bg-emerald-100 text-emerald-700' },
        };
        return statuses[status] || { text: 'Beklemede', icon: '⏳', color: 'bg-gray-100 text-gray-700' };
    };

    const getAlbumStatusInfo = (status: string) => {
        const statuses: Record<string, { text: string; progress: number }> = {
            'islem_yapilmadi': { text: 'İşlem Başlamadı', progress: 0 },
            'tasarim_asamasinda': { text: 'Tasarım', progress: 25 },
            'baskida': { text: 'Baskı', progress: 50 },
            'paketlemede': { text: 'Paketleme', progress: 75 },
            'kargoda': { text: 'Kargoda', progress: 90 },
            'teslimata_hazir': { text: 'Teslimata Hazır', progress: 95 },
            'teslim_edildi': { text: 'Teslim Edildi', progress: 100 },
        };
        return statuses[status] || { text: 'Beklemede', progress: 0 };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-20">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Bilgi bulunamadı</p>
            </div>
        );
    }

    const shootStatus = getStatusInfo(customer.appointmentStatus);
    const albumStatus = getAlbumStatusInfo(customer.albumStatus);
    const photoCount = customer.photos?.length || 0;

    return (
        <div className="space-y-6">
            {/* Photo Count Card */}
            <Link
                href={`/studio/${slug}/galleries`}
                className="block bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-500/30"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm">Toplam Fotoğraf</p>
                        <p className="text-4xl font-bold mt-1">{photoCount}</p>
                        <p className="text-white/70 text-sm mt-2">Fotoğrafları görüntüle →</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Image className="w-8 h-8" />
                    </div>
                </div>
            </Link>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Shoot Status */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{shootStatus.icon}</span>
                        <span className="text-sm text-gray-500">Çekim</span>
                    </div>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${shootStatus.color}`}>
                        {shootStatus.text}
                    </span>
                </div>

                {/* Album Status */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📖</span>
                        <span className="text-sm text-gray-500">Albüm</span>
                    </div>
                    <div className="mb-2">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                                style={{ width: `${albumStatus.progress}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{albumStatus.text}</span>
                </div>
            </div>

            {/* Photo Preview */}
            {photoCount > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Son Fotoğraflar</h3>
                        <Link
                            href={`/studio/${slug}/galleries`}
                            className="text-sm text-pink-600 font-medium flex items-center gap-1"
                        >
                            Tümü <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {customer.photos.slice(0, 6).map((photo, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {photoCount > 6 && (
                        <Link
                            href={`/studio/${slug}/galleries`}
                            className="block text-center text-sm text-gray-500 mt-4 py-2 bg-gray-50 rounded-xl"
                        >
                            +{photoCount - 6} fotoğraf daha
                        </Link>
                    )}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link
                    href={`/studio/${slug}/galleries`}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <Camera className="w-8 h-8 text-purple-500 mb-3" />
                    <h4 className="font-semibold text-gray-900">Galeriye Git</h4>
                    <p className="text-sm text-gray-500 mt-1">Fotoğraflarınızı görüntüleyin</p>
                </Link>
                <Link
                    href={`/studio/${slug}/schedule`}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <Calendar className="w-8 h-8 text-blue-500 mb-3" />
                    <h4 className="font-semibold text-gray-900">Randevular</h4>
                    <p className="text-sm text-gray-500 mt-1">Çekim takviminiz</p>
                </Link>
            </div>
        </div>
    );
}
