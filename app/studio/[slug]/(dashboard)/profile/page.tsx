'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Phone, Mail, Calendar, Heart, Crown } from 'lucide-react';

interface CustomerData {
    brideName: string;
    groomName: string;
    phone: string;
    email: string;
    weddingDate: string;
    isCorporateMember: boolean;
    corporateMembershipExpiry: string;
}

export default function StudioProfilePage() {
    const { data: session } = useSession();
    const params = useParams();
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
                <p className="text-gray-500">Bilgi bulunamadı</p>
            </div>
        );
    }

    const weddingDate = customer.weddingDate ? new Date(customer.weddingDate) : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Profilim</h1>
                <p className="text-sm text-gray-500">Hesap bilgileriniz</p>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">
                            {customer.brideName}{customer.groomName ? ` & ${customer.groomName}` : ''}
                        </h2>
                        {customer.isCorporateMember && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400/20 rounded text-yellow-200 text-xs mt-1">
                                <Crown className="w-3 h-3" />
                                Kurumsal Üye
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
                {customer.phone && (
                    <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Telefon</p>
                            <p className="font-medium text-gray-900">{customer.phone}</p>
                        </div>
                    </div>
                )}

                {customer.email && (
                    <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{customer.email}</p>
                        </div>
                    </div>
                )}

                {weddingDate && (
                    <div className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Düğün Tarihi</p>
                            <p className="font-medium text-gray-900">
                                {weddingDate.toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Membership Info */}
            {customer.isCorporateMember && customer.corporateMembershipExpiry && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-3">
                        <Crown className="w-6 h-6 text-yellow-600" />
                        <div>
                            <p className="font-medium text-gray-900">Kurumsal Üyelik</p>
                            <p className="text-sm text-gray-600">
                                Geçerlilik: {new Date(customer.corporateMembershipExpiry).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
