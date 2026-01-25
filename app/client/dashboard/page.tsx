'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Calendar, Image, Clock, CreditCard, Camera, Heart, CheckCircle, Package, FileText } from 'lucide-react';
import Link from 'next/link';

interface CustomerData {
    _id: string;
    brideName: string;
    groomName: string;
    phone: string;
    email: string;
    weddingDate: string;
    status: string;
    appointmentStatus: string;
    albumStatus: string;
    photos: Array<{ url: string; filename: string; uploadedAt: string }>;
    isCorporateMember: boolean;
    corporateMembershipExpiry: string;
}

export default function ClientDashboard() {
    const { data: session } = useSession();
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.customerId) {
            fetchCustomerData();
        }
    }, [session]);

    const fetchCustomerData = async () => {
        try {
            const res = await fetch(`/api/customers/${session?.user?.customerId}`);
            if (res.ok) {
                const data = await res.json();
                setCustomer(data);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, { text: string; color: string }> = {
            'cekim_yapilmadi': { text: 'Çekim Bekleniyor', color: 'bg-yellow-100 text-yellow-700' },
            'cekim_yapildi': { text: 'Çekim Tamamlandı', color: 'bg-blue-100 text-blue-700' },
            'fotograflar_yuklendi': { text: 'Fotoğraflar Yüklendi', color: 'bg-purple-100 text-purple-700' },
            'fotograflar_secildi': { text: 'Seçim Tamamlandı', color: 'bg-green-100 text-green-700' },
            'album_bekleniyor': { text: 'Albüm Hazırlanıyor', color: 'bg-orange-100 text-orange-700' },
            'teslim_edildi': { text: 'Teslim Edildi', color: 'bg-emerald-100 text-emerald-700' },
        };
        return labels[status] || { text: 'Beklemede', color: 'bg-gray-100 text-gray-700' };
    };

    const getAlbumStatusLabel = (status: string) => {
        const labels: Record<string, { text: string; color: string }> = {
            'islem_yapilmadi': { text: 'İşlem Başlamadı', color: 'bg-gray-100 text-gray-700' },
            'tasarim_asamasinda': { text: 'Tasarım Aşamasında', color: 'bg-blue-100 text-blue-700' },
            'baskida': { text: 'Baskıda', color: 'bg-purple-100 text-purple-700' },
            'paketlemede': { text: 'Paketleniyor', color: 'bg-orange-100 text-orange-700' },
            'kargoda': { text: 'Kargoya Verildi', color: 'bg-cyan-100 text-cyan-700' },
            'teslimata_hazir': { text: 'Teslimata Hazır', color: 'bg-green-100 text-green-700' },
            'teslim_edildi': { text: 'Teslim Edildi', color: 'bg-emerald-100 text-emerald-700' },
        };
        return labels[status] || { text: 'Beklemede', color: 'bg-gray-100 text-gray-700' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Müşteri bilgisi bulunamadı</h2>
                <p className="text-gray-500">Lütfen fotoğrafçınızla iletişime geçin.</p>
            </div>
        );
    }

    const appointmentStatus = getStatusLabel(customer.appointmentStatus);
    const albumStatus = getAlbumStatusLabel(customer.albumStatus);
    const weddingDate = customer.weddingDate ? new Date(customer.weddingDate) : null;
    const daysUntilWedding = weddingDate ? Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Heart className="w-8 h-8" />
                        <span className="text-pink-100 text-sm">Özel Gününüz İçin</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Hoş Geldiniz, {customer.brideName}{customer.groomName ? ` & ${customer.groomName}` : ''}!
                    </h1>
                    <p className="text-pink-100 max-w-xl">
                        En özel anlarınız bizimle güvende. Bu panelden çekim durumunuzu, fotoğraflarınızı ve albüm sürecinizi takip edebilirsiniz.
                    </p>

                    {weddingDate && daysUntilWedding && daysUntilWedding > 0 && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Düğününüze {daysUntilWedding} gün kaldı!
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Camera className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-500">Çekim Durumu</span>
                    </div>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${appointmentStatus.color}`}>
                        {appointmentStatus.text}
                    </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-500">Albüm Durumu</span>
                    </div>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${albumStatus.color}`}>
                        {albumStatus.text}
                    </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                            <Image className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="text-sm text-gray-500">Fotoğraflar</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{customer.photos?.length || 0}</span>
                    <span className="text-sm text-gray-500 ml-1">adet</span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-500">Üyelik</span>
                    </div>
                    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${customer.isCorporateMember ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {customer.isCorporateMember ? 'Kurumsal Üye' : 'Standart'}
                    </span>
                </div>
            </div>

            {/* Photo Gallery Preview */}
            {customer.photos && customer.photos.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Image className="w-5 h-5 text-pink-600" />
                            Fotoğraflarınız
                        </h2>
                        <Link href="/client/galleries" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                            Tümünü Gör →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {customer.photos.slice(0, 6).map((photo, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={photo.url}
                                    alt={photo.filename}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>

                    {customer.photos.length > 6 && (
                        <p className="text-center text-sm text-gray-500 mt-4">
                            +{customer.photos.length - 6} fotoğraf daha
                        </p>
                    )}
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/client/galleries" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Image className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">Galeriler</h3>
                    <p className="text-sm text-gray-500">Tüm fotoğraflarınızı görüntüleyin</p>
                </Link>

                <Link href="/client/schedule" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">Randevular</h3>
                    <p className="text-sm text-gray-500">Çekim takvimini görüntüleyin</p>
                </Link>

                <Link href="/client/payments" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">Ödemeler</h3>
                    <p className="text-sm text-gray-500">Ödeme durumunuzu takip edin</p>
                </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">İletişim Bilgileriniz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Telefon:</span>
                        <span className="ml-2 text-gray-800 font-medium">{customer.phone}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-800 font-medium">{customer.email || '-'}</span>
                    </div>
                    {weddingDate && (
                        <div>
                            <span className="text-gray-500">Düğün Tarihi:</span>
                            <span className="ml-2 text-gray-800 font-medium">
                                {weddingDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
