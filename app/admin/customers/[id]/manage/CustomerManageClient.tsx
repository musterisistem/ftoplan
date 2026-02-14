'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Phone,
    MapPin,
    Mail,
    Calendar,
    Package,
    CreditCard,
    FileText,
    Settings,
    User,
    Upload,
    ChevronDown,
    ChevronRight,
    X,
    Check,
    Copy,
    Camera,
    Album,
    Send,
    Sparkles,
    History,
    Download,
    CheckCircle2,
    FileImage,
    Layout,
    Image as ImageIcon,
    Info,
    Clock,
    Lock,
    Unlock,
    Activity,
    Globe,
    ShieldCheck,
    ShieldX,
    User as UserIcon,
    MessageCircle,
    Save,
    AlertCircle
} from 'lucide-react';
import PhotoUpload from '@/components/admin/PhotoUpload';
import { useAlert } from '@/context/AlertContext';

interface Customer {
    _id: string;
    brideName: string;
    groomName: string;
    phone: string;
    email?: string;
    tcId?: string;
    weddingDate?: string;
    status: string;
    appointmentStatus: string;
    albumStatus: string;
    createdAt: string;
    userId?: string;
    plainPassword?: string;
    plainUsername?: string;
    user?: {
        email: string;
        plainPassword?: string;
        plainUsername?: string;
        isActive?: boolean;
    };
    selectionLimits: {
        album: number;
        cover: number;
        poster: number;
    };
    selectionCompleted?: boolean;
    canDownload?: boolean;
    lastLoginAt?: string;
    lastLoginIp?: string;
    lastLoginPlatform?: string;
    photographerSlug?: string;
    photos: Array<{
        url: string;
        filename: string;
        size: number;
        uploadedAt: string;
    }>;
    selectedPhotos?: {
        url: string;
        type: 'album' | 'cover' | 'poster';
    }[];
    contractId?: string;
    photographerPackageType?: string;
    photographerSubscriptionExpiry?: string;
    photographerName?: string;
    photographerStudioName?: string;
}

type TabType = 'summary' | 'package' | 'appointments' | 'payments' | 'contract' | 'album-settings' | 'send-album' | 'approved-album' | 'account';

const TABS = [
    { id: 'summary', label: 'Özet', icon: User },
    { id: 'package', label: 'Paket Bilgileri', icon: Package },
    { id: 'appointments', label: 'Randevular', icon: Calendar },
    { id: 'payments', label: 'Ödeme Bilgileri', icon: CreditCard },
    { id: 'contract', label: 'Sözleşme', icon: FileText },
    { id: 'album-settings', label: 'Albüm Onay Ayarları', icon: Settings },
    { id: 'send-album', label: 'Albüm Gönder', icon: Upload },
    { id: 'approved-album', label: 'Onaylanan Albüm', icon: CheckCircle2 },
    { id: 'account', label: 'Üye Hesap Ayarları', icon: User },
] as const;

const APPOINTMENT_STATUSES = [
    { value: 'cekim_yapilmadi', label: 'Çekim Yapılmadı', color: 'bg-gray-500' },
    { value: 'cekim_yapildi', label: 'Çekim Yapıldı', color: 'bg-blue-500' },
    { value: 'fotograflar_yuklendi', label: 'Fotoğraflar Yüklendi', color: 'bg-amber-500' },
    { value: 'fotograflar_secildi', label: 'Fotoğraflar Seçildi', color: 'bg-purple-500' },
    { value: 'album_bekleniyor', label: 'Albüm Bekleniyor', color: 'bg-orange-500' },
    { value: 'teslim_edildi', label: 'Teslim Edildi', color: 'bg-green-500' },
];

const ALBUM_STATUSES = [
    { value: 'islem_yapilmadi', label: 'İşlem Yapılmadı', color: 'bg-gray-500' },
    { value: 'tasarim_asamasinda', label: 'Tasarım Aşamasında', color: 'bg-blue-500' },
    { value: 'baskida', label: 'Baskıda', color: 'bg-purple-500' },
    { value: 'paketlemede', label: 'Paketlemede', color: 'bg-amber-500' },
    { value: 'kargoda', label: 'Kargoda', color: 'bg-orange-500' },
    { value: 'teslimata_hazir', label: 'Teslimata Hazır', color: 'bg-teal-500' },
    { value: 'teslim_edildi', label: 'Teslim Edildi', color: 'bg-green-500' },
];

export default function CustomerManageClient({ customerId }: { customerId: string }) {
    const { showAlert } = useAlert();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('summary');

    // Status states
    const [appointmentStatus, setAppointmentStatus] = useState('cekim_yapilmadi');
    const [albumStatus, setAlbumStatus] = useState('islem_yapilmadi');
    const [pendingAppointmentStatus, setPendingAppointmentStatus] = useState<string | null>(null);
    const [pendingAlbumStatus, setPendingAlbumStatus] = useState<string | null>(null);
    const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
    const [showAlbumDropdown, setShowAlbumDropdown] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [savedStatusType, setSavedStatusType] = useState<'appointment' | 'album' | null>(null);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`/api/customers/${customerId}`, { cache: 'no-store' });
            const data = await res.json();

            if (res.ok) {
                setCustomer(data);
                if (data.appointmentStatus) setAppointmentStatus(data.appointmentStatus);
                if (data.albumStatus) setAlbumStatus(data.albumStatus);
            } else {
                setError(data.error || 'Müşteri getirilemedi');
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) fetchCustomer();
    }, [customerId]);



    const selectStatus = (type: 'appointment' | 'album', value: string) => {
        if (type === 'appointment') {
            setPendingAppointmentStatus(value);
            setShowAppointmentDropdown(false);
        } else {
            setPendingAlbumStatus(value);
            setShowAlbumDropdown(false);
        }
    };

    const saveStatus = async (type: 'appointment' | 'album') => {
        try {
            const updateData: any = {};

            if (type === 'appointment' && pendingAppointmentStatus) {
                updateData.appointmentStatus = pendingAppointmentStatus;
            } else if (type === 'album' && pendingAlbumStatus) {
                updateData.albumStatus = pendingAlbumStatus;
            }

            // Call API to save status
            const res = await fetch(`/api/customers/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (res.ok) {
                // Update local state after successful save
                if (type === 'appointment' && pendingAppointmentStatus) {
                    setAppointmentStatus(pendingAppointmentStatus);
                    setPendingAppointmentStatus(null);
                } else if (type === 'album' && pendingAlbumStatus) {
                    setAlbumStatus(pendingAlbumStatus);
                    setPendingAlbumStatus(null);
                }
                setSavedStatusType(type);
                setShowSuccessModal(true);
            } else {
                showAlert('Durum güncellenirken hata oluştu', 'error');
            }
        } catch (error) {
            console.error('Status update error:', error);
            showAlert('Durum güncellenirken hata oluştu', 'error');
        }
    };

    const cancelPendingStatus = (type: 'appointment' | 'album') => {
        if (type === 'appointment') {
            setPendingAppointmentStatus(null);
        } else {
            setPendingAlbumStatus(null);
        }
    };

    const getAppointmentStatusInfo = (value?: string) => APPOINTMENT_STATUSES.find(s => s.value === (value || appointmentStatus)) || APPOINTMENT_STATUSES[0];
    const getAlbumStatusInfo = (value?: string) => ALBUM_STATUSES.find(s => s.value === (value || albumStatus)) || ALBUM_STATUSES[0];

    const currentAppointmentDisplay = pendingAppointmentStatus ? getAppointmentStatusInfo(pendingAppointmentStatus) : getAppointmentStatusInfo();
    const currentAlbumDisplay = pendingAlbumStatus ? getAlbumStatusInfo(pendingAlbumStatus) : getAlbumStatusInfo();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">!</span>
                    </div>
                    <p className="text-gray-900 font-semibold mb-2">Müşteri Bulunamadı</p>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <Link href="/admin/customers" className="text-indigo-600 hover:underline font-medium">
                        ← Müşterilere Dön
                    </Link>
                </div>
            </div>
        );
    }

    const customerName = `${customer.brideName}${customer.groomName ? ` & ${customer.groomName}` : ''}`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success Modal - Center of Screen */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Müşteri Bilgilendirildi!
                        </h2>

                        {/* Email Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">E-posta gönderildi</span>
                            </div>
                            <p className="text-indigo-600 font-semibold">{customer.email || 'E-posta adresi yok'}</p>
                        </div>

                        {/* Status Changed Info */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>
                                {savedStatusType === 'appointment' ? 'Randevu durumu' : 'Albüm durumu'} başarıyla güncellendi
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30"
                        >
                            Tamam
                        </button>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <Link href="/admin/customers" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Müşterilere Dön</span>
                </Link>
            </div>

            {/* Sticky Profile Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-[1920px] mx-auto px-6 py-5">
                    <div className="flex items-start justify-between gap-6">
                        {/* Left: Avatar + Info */}
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image src="/images/default-avatar.png" alt={customerName} width={80} height={80} className="object-cover" />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${customer.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-1">{customerName}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    {customer.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-4 h-4" />
                                            <span>{customer.phone}</span>
                                        </div>
                                    )}
                                    {customer.email && (
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-4 h-4" />
                                            <span>{customer.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Center: User Credentials - Compact Horizontal */}
                        {customer.user && (
                            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs font-semibold text-gray-600">Giriş:</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">Kullanıcı:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        {customer.user?.plainUsername || customer.user?.email || '—'}
                                    </span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">Şifre:</span>
                                    <span className="font-mono font-bold text-indigo-600 text-sm">
                                        {customer.user?.plainPassword || '—'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        const username = customer.user?.plainUsername || customer.user?.email || '';
                                        const password = customer.user?.plainPassword || 'Şifre kaydedilmemiş';
                                        const text = `Kullanıcı adı: ${username}\nŞifre: ${password}`;
                                        navigator.clipboard.writeText(text);
                                        showAlert('Giriş bilgileri kopyalandı!', 'success');
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-all ml-2"
                                    title="Kopyala"
                                >
                                    <Copy className="w-3 h-3" />
                                    Kopyala
                                </button>
                                <button
                                    onClick={() => {
                                        const username = customer.user?.plainUsername || customer.user?.email || '';
                                        const password = customer.user?.plainPassword || 'Şifre kaydedilmemiş';
                                        const message = `Değerli kullanıcı, sistemden fotoğraf seçmeniz için kullanıcı adı ve şifreniz:\n\nKullanıcı Adı: ${username}\nŞifre: ${password}`;

                                        // Format phone number: Remove non-digits, replace leading 0 with 90
                                        let phone = customer.phone.replace(/\D/g, '');
                                        if (phone.startsWith('0')) {
                                            phone = '90' + phone.substring(1);
                                        } else if (phone.length === 10) {
                                            phone = '90' + phone;
                                        }

                                        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-[#25D366] hover:bg-[#128C7E] text-white rounded text-xs font-medium transition-all ml-2"
                                    title="WhatsApp ile Gönder"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    WhatsApp
                                </button>
                            </div>
                        )}

                        {/* Right: Status Dropdowns */}
                        <div className="flex items-start gap-4">
                            {/* Randevu Durumu */}
                            <div className="relative">
                                <div className="text-xs text-gray-500 font-medium mb-1.5">Randevu Durumu</div>
                                <button
                                    onClick={() => { setShowAppointmentDropdown(!showAppointmentDropdown); setShowAlbumDropdown(false); }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium min-w-[180px] justify-between ${currentAppointmentDisplay.color} ${pendingAppointmentStatus ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        {currentAppointmentDisplay.label}
                                    </div>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showAppointmentDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                                        {APPOINTMENT_STATUSES.map((status) => (
                                            <button
                                                key={status.value}
                                                onClick={() => selectStatus('appointment', status.value)}
                                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${(pendingAppointmentStatus || appointmentStatus) === status.value ? 'bg-gray-100' : ''}`}
                                            >
                                                <span>{status.label}</span>
                                                {(pendingAppointmentStatus || appointmentStatus) === status.value && <Check className="w-4 h-4 text-amber-500" />}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Save/Cancel Buttons */}
                                {pendingAppointmentStatus && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => saveStatus('appointment')}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Kaydet
                                        </button>
                                        <button
                                            onClick={() => cancelPendingStatus('appointment')}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Albüm Durumu */}
                            <div className="relative">
                                <div className="text-xs text-gray-500 font-medium mb-1.5">Albüm Durumu</div>
                                <button
                                    onClick={() => { setShowAlbumDropdown(!showAlbumDropdown); setShowAppointmentDropdown(false); }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium min-w-[180px] justify-between ${currentAlbumDisplay.color} ${pendingAlbumStatus ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Album className="w-4 h-4" />
                                        {currentAlbumDisplay.label}
                                    </div>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showAlbumDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                                        {ALBUM_STATUSES.map((status) => (
                                            <button
                                                key={status.value}
                                                onClick={() => selectStatus('album', status.value)}
                                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-gray-50 ${(pendingAlbumStatus || albumStatus) === status.value ? 'bg-gray-100' : ''}`}
                                            >
                                                <span>{status.label}</span>
                                                {(pendingAlbumStatus || albumStatus) === status.value && <Check className="w-4 h-4 text-pink-500" />}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Save/Cancel Buttons */}
                                {pendingAlbumStatus && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => saveStatus('album')}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            Kaydet
                                        </button>
                                        <button
                                            onClick={() => cancelPendingStatus('album')}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-t border-gray-200 bg-gray-50">
                    <div className="max-w-[1920px] mx-auto px-6">
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${isActive
                                            ? 'border-indigo-600 text-indigo-600 bg-white'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {
                (showAppointmentDropdown || showAlbumDropdown) && (
                    <div className="fixed inset-0 z-10" onClick={() => { setShowAppointmentDropdown(false); setShowAlbumDropdown(false); }} />
                )
            }

            {/* Tab Content */}
            <div className="max-w-[1920px] mx-auto px-6 py-8 overflow-x-hidden">
                {activeTab === 'summary' && <SummaryTab customer={customer} appointmentStatus={getAppointmentStatusInfo()} albumStatus={getAlbumStatusInfo()} />}
                {activeTab === 'package' && <PackageTab customerId={customerId} />}
                {activeTab === 'appointments' && <AppointmentsTab customerId={customerId} />}
                {activeTab === 'payments' && <PaymentsTab customerId={customerId} />}
                {activeTab === 'contract' && <ContractTab customerId={customerId} onTabChange={(tab) => setActiveTab(tab)} />}
                {activeTab === 'album-settings' && <AlbumSettingsTab customer={customer} onUpdate={fetchCustomer} />}
                {activeTab === 'send-album' && <SendAlbumTab customerId={customerId} initialPhotos={customer.photos || []} onPhotosUpdated={fetchCustomer} />}
                {activeTab === 'approved-album' && <ApprovedAlbumTab customer={customer} />}
                {activeTab === 'account' && <AccountTab customer={customer} onUpdate={fetchCustomer} onTabChange={(tab) => setActiveTab(tab)} />}
            </div>
        </div>
    );
}
function AlbumSettingsTab({ customer, onUpdate }: { customer: Customer; onUpdate: () => void }) {
    const { showAlert } = useAlert();
    const [limits, setLimits] = useState(customer.selectionLimits || { album: 22, cover: 1, poster: 1 });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/customers/${customer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectionLimits: limits })
            });

            if (res.ok) {
                showAlert('Limitler güncellendi!', 'success');
                onUpdate();
            } else {
                showAlert('Güncelleme başarısız.', 'error');
            }
        } catch (error) {
            console.error(error);
            showAlert('Hata oluştu.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                Albüm Onay Ayarları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Albüm Fotoğraf Sayısı</label>
                    <input
                        type="number"
                        value={limits.album}
                        onChange={(e) => setLimits({ ...limits, album: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Fotoğraf Sayısı</label>
                    <input
                        type="number"
                        value={limits.cover}
                        onChange={(e) => setLimits({ ...limits, cover: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Poster Sayısı</label>
                    <input
                        type="number"
                        value={limits.poster}
                        onChange={(e) => setLimits({ ...limits, poster: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                    Ayarları Kaydet
                </button>
            </div>
        </div>
    );
}

// Update ApprovedAlbumTab Component
// Update ApprovedAlbumTab Component
// Update ApprovedAlbumTab Component
function ApprovedAlbumTab({ customer }: { customer: Customer }) {
    const [copyFeedback, setCopyFeedback] = useState('');

    if (!customer.selectedPhotos || customer.selectedPhotos.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileImage className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Seçim Yapılmadı</h3>
                <p className="text-gray-500">Müşteri henüz fotoğraf seçimi yapmamış veya onaylamamış.</p>
            </div>
        );
    }

    // Group photos by type
    const grouped = {
        album: customer.selectedPhotos.filter(p => p.type === 'album'),
        cover: customer.selectedPhotos.filter(p => p.type === 'cover'),
        poster: customer.selectedPhotos.filter(p => p.type === 'poster'),
    };

    const copyToClipboard = (text: string, platform: 'Windows' | 'Mac') => {
        navigator.clipboard.writeText(text);
        setCopyFeedback(`${platform} formatında kopyalandı!`);
        setTimeout(() => setCopyFeedback(''), 3000);
    };

    const renderGroup = (title: string, photos: typeof customer.selectedPhotos, colorClass: string, icon: any) => {
        if (!photos || photos.length === 0) return null;

        const distinctFilenames = photos.map(p => {
            const name = (p as any).filename || p.url.split('/').pop() || 'bilinmeyen-dosya';
            try { return decodeURIComponent(name); } catch { return name; }
        });

        // Generate Strings
        const winString = distinctFilenames.map(f => `"${f}"`).join(' OR ');
        const macString = distinctFilenames.join(' OR ');

        const Icon = icon;
        const bgColor = colorClass.replace('text-', 'bg-').replace('600', '100');

        return (
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                {/* Header */}
                <div className={`${bgColor} border-b border-gray-200 p-4`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${colorClass}`} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{title}</h4>
                            <p className="text-xs text-gray-600">{photos.length} fotoğraf seçildi</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white p-4 space-y-3">
                    {/* Copy Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => copyToClipboard(winString, 'Windows')}
                            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                            <Copy className="w-4 h-4" />
                            Windows Kopyala
                        </button>
                        <button
                            onClick={() => copyToClipboard(macString, 'Mac')}
                            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                        >
                            <Copy className="w-4 h-4" />
                            Mac Kopyala
                        </button>
                    </div>

                    {/* Photo Gallery */}
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        {photos.slice(0, 12).map((photo, idx) => (
                            <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        {photos.length > 12 && (
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">+{photos.length - 12}</span>
                            </div>
                        )}
                    </div>

                    {/* Filename Preview - Collapsible */}
                    <details className="group">
                        <summary className="cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 py-2 select-none">
                            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                            Dosya İsimlerini Göster ({distinctFilenames.length} dosya)
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                            <code className="text-[10px] text-gray-700 break-all leading-relaxed">
                                {winString}
                            </code>
                        </div>
                    </details>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Onaylanan Seçimler</h3>
                            <p className="text-sm text-gray-500">Fotoğraf dosyalarını kopyala</p>
                        </div>
                    </div>
                    {copyFeedback && (
                        <span className="text-sm text-green-600 font-semibold animate-in fade-in flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                            <Check className="w-4 h-4" />
                            {copyFeedback}
                        </span>
                    )}
                </div>

                {/* Help - Moved to top */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Nasıl Kullanılır?</p>
                        <p className="text-blue-800">İşletim sisteminize uygun butona tıklayın. Bilgisayarınızdaki fotoğraf klasöründe arama kutusuna yapıştırarak sadece seçilen fotoğrafları görüntüleyebilirsiniz.</p>
                    </div>
                </div>

                {/* Approval Timestamp Info - Always visible */}
                <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <History className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Seçim Onay Zamanı</h4>
                        {(customer as any).selectionApprovedAt ? (
                            <p className="text-sm text-indigo-700">
                                Müşteri fotoğraf seçimini{' '}
                                <span className="font-bold">
                                    {new Date((customer as any).selectionApprovedAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                                {' '}tarihinde, saat{' '}
                                <span className="font-bold">
                                    {new Date((customer as any).selectionApprovedAt).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                {' '}olarak onayladı.
                            </p>
                        ) : (
                            <p className="text-sm text-indigo-700">
                                Seçim onay tarihi henüz kaydedilmedi. Müşteri yeni bir seçim yaptığında tarih otomatik olarak kaydedilecektir.
                            </p>
                        )}
                    </div>
                </div>

                {/* Groups */}
                <div className="space-y-4">
                    {renderGroup('Albüm Fotoğrafları', grouped.album, 'text-emerald-600', Album)}
                    {renderGroup('Kapak Fotoğrafları', grouped.cover, 'text-violet-600', Layout)}
                    {renderGroup('Poster Fotoğrafları', grouped.poster, 'text-amber-600', ImageIcon)}
                </div>
            </div>
        </div>
    );
}

// ... other existing exports ...

// Tab Components
function SummaryTab({ customer, appointmentStatus, albumStatus }: { customer: Customer; appointmentStatus: any; albumStatus: any }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Müşteri Özeti</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <div className="text-sm text-indigo-600 font-medium mb-1">Durum</div>
                        <div className="text-xl font-bold text-indigo-900 capitalize">{customer.status}</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="text-sm text-green-600 font-medium mb-1">Kayıt Tarihi</div>
                        <div className="text-xl font-bold text-green-900">{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="text-sm text-amber-600 font-medium mb-1">Randevu</div>
                        <div className="text-lg font-bold text-amber-900">{appointmentStatus.label}</div>
                    </div>
                    <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
                        <div className="text-sm text-pink-600 font-medium mb-1">Albüm</div>
                        <div className="text-lg font-bold text-pink-900">{albumStatus.label}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PackageTab({ customerId }: { customerId: string }) {
    const [shoots, setShoots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShoots = async () => {
            try {
                const res = await fetch(`/api/shoots?customerId=${customerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setShoots(data);
                }
            } catch (error) {
                console.error('Failed to fetch shoots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchShoots();
    }, [customerId]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                    <div className="h-32 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    // Find shoot with package info
    const shootWithPackage = shoots.find(s => s.packageName);

    if (!shootWithPackage) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Paket Bilgisi Yok</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Henüz çekim yapılmamış veya paket tanımlanmamış. Paket bilgilerini görmek için önce çekim randevusu oluşturun.
                </p>
                <Link
                    href={`/admin/appointments/new?customer=${customerId}`}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                    <Calendar className="w-5 h-5" />
                    Çekim Randevusu Oluştur
                </Link>
            </div>
        );
    }

    const SHOOT_TYPE_LABELS: Record<string, string> = {
        wedding: 'Düğün Çekimi',
        engagement: 'Nişan Çekimi',
        saveTheDate: 'Save The Date',
        personal: 'Kişisel Çekim',
        other: 'Diğer'
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Paket Bilgileri</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Package Name Card */}
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-600 font-medium">Paket Adı</p>
                                <p className="text-lg font-bold text-indigo-900">{shootWithPackage.packageName || 'Belirtilmemiş'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shoot Type Card */}
                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-medium">Çekim Türü</p>
                                <p className="text-lg font-bold text-purple-900">{SHOOT_TYPE_LABELS[shootWithPackage.type] || shootWithPackage.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Agreed Price Card */}
                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-medium">Anlaşılan Ücret</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {shootWithPackage.agreedPrice?.toLocaleString('tr-TR') || '0'} ₺
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Card */}
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-amber-600 font-medium">Alınan Kapora</p>
                                <p className="text-2xl font-bold text-amber-900">
                                    {shootWithPackage.deposit?.toLocaleString('tr-TR') || '0'} ₺
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Çekim Tarihi</p>
                        <p className="font-semibold text-gray-900">{new Date(shootWithPackage.date).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Lokasyon</p>
                        <p className="font-semibold text-gray-900">{shootWithPackage.location || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Kalan Ödeme</p>
                        <p className="font-semibold text-red-600">
                            {((shootWithPackage.agreedPrice || 0) - (shootWithPackage.deposit || 0)).toLocaleString('tr-TR')} ₺
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AppointmentsTab({ customerId }: { customerId: string }) {
    const [shoots, setShoots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShoot, setSelectedShoot] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchShoots = async () => {
            try {
                const res = await fetch(`/api/shoots?customerId=${customerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setShoots(data);
                }
            } catch (error) {
                console.error('Failed to fetch shoots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchShoots();
    }, [customerId]);

    const SHOOT_TYPE_LABELS: Record<string, string> = {
        wedding: 'Düğün',
        engagement: 'Nişan',
        saveTheDate: 'Save The Date',
        personal: 'Kişisel',
        other: 'Diğer'
    };

    const handleShootClick = (shoot: any) => {
        setSelectedShoot(shoot);
        setShowDetailModal(true);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-100 rounded-xl"></div>
                        <div className="h-16 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Detail Modal */}
            {showDetailModal && selectedShoot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Randevu Detayları</h3>
                                    <p className="text-sm text-white/80">{SHOOT_TYPE_LABELS[selectedShoot.type] || selectedShoot.type}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-white/80 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${selectedShoot.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    selectedShoot.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                    {selectedShoot.status === 'completed' ? 'Tamamlandı' : selectedShoot.status === 'cancelled' ? 'İptal Edildi' : 'Planlandı'}
                                </span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date */}
                                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-600 font-medium mb-1">Tarih</p>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(selectedShoot.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                {selectedShoot.time && (
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <History className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-purple-600 font-medium mb-1">Saat</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {selectedShoot.location && (
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-green-600 font-medium mb-1">Lokasyon</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* City */}
                                {selectedShoot.city && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-600 font-medium mb-1">Şehir</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Package */}
                                {selectedShoot.packageName && (
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                                <Package className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-amber-600 font-medium mb-1">Paket</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.packageName}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Agreed Price */}
                                {selectedShoot.agreedPrice > 0 && (
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-emerald-600 font-medium mb-1">Anlaşılan Ücret</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.agreedPrice.toLocaleString('tr-TR')} ₺</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Deposit */}
                                {selectedShoot.deposit > 0 && (
                                    <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-teal-600 font-medium mb-1">Kapora</p>
                                                <p className="font-semibold text-gray-900">{selectedShoot.deposit.toLocaleString('tr-TR')} ₺</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            {selectedShoot.notes && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="text-xs text-gray-600 font-medium mb-2">Notlar</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedShoot.notes}</p>
                                </div>
                            )}

                            {/* Created Date */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Oluşturulma: {new Date(selectedShoot.createdAt).toLocaleDateString('tr-TR')} {new Date(selectedShoot.createdAt).toLocaleTimeString('tr-TR')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Randevular</h2>
                    <Link
                        href={`/admin/appointments/new?customer=${customerId}`}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                        <Calendar className="w-4 h-4" />
                        Yeni Randevu
                    </Link>
                </div>

                {shoots.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Henüz randevu yok.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {shoots.map((shoot) => (
                            <button
                                key={shoot._id}
                                onClick={() => handleShootClick(shoot)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors">
                                        <Calendar className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {SHOOT_TYPE_LABELS[shoot.type] || shoot.type}
                                            {shoot.packageName && <span className="ml-2 text-indigo-600">• {shoot.packageName}</span>}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(shoot.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            {shoot.time && ` • ${shoot.time}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shoot.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        shoot.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {shoot.status === 'completed' ? 'Tamamlandı' : shoot.status === 'cancelled' ? 'İptal' : 'Planlandı'}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
function PaymentsTab({ customerId }: { customerId: string }) {
    const { showAlert } = useAlert();
    const [shoots, setShoots] = useState<any[]>([]);
    const [payments, setPayments] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showExtraModal, setShowExtraModal] = useState(false);
    const [isDebit, setIsDebit] = useState(true);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('nakit');
    const [paymentDesc, setPaymentDesc] = useState('');
    const [extraName, setExtraName] = useState('');
    const [extraAmount, setExtraAmount] = useState('');
    const [extraDesc, setExtraDesc] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const shootsRes = await fetch(`/api/shoots?customerId=${customerId}`);
            if (shootsRes.ok) setShoots(await shootsRes.json());
            const paymentsRes = await fetch(`/api/payments?customerId=${customerId}`);
            if (paymentsRes.ok) setPayments(await paymentsRes.json());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [customerId]);

    const handleAddPayment = async () => {
        if (!paymentAmount) return;
        setSaving(true);
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId, actionType: 'payment', amount: Number(paymentAmount), type: paymentType, description: paymentDesc })
            });
            if (res.ok) { setShowPaymentModal(false); setPaymentAmount(''); setPaymentDesc(''); fetchData(); }
        } catch (error) { showAlert('Ödeme eklenirken hata oluştu', 'error'); }
        finally { setSaving(false); }
    };

    const handleAddExtra = async () => {
        if (!extraName || !extraAmount) return;
        setSaving(true);
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId, actionType: 'extra', name: extraName, amount: Number(extraAmount), isDebit, description: extraDesc })
            });
            if (res.ok) { setShowExtraModal(false); setExtraName(''); setExtraAmount(''); setExtraDesc(''); fetchData(); }
        } catch (error) { showAlert('Ekstra eklenirken hata oluştu', 'error'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}</div>
                </div>
            </div>
        );
    }

    const shootWithPackage = shoots.find(s => s.packageName);
    const baseTotal = shoots.reduce((sum, s) => sum + (s.agreedPrice || 0), 0);
    const totalDeposit = shoots.reduce((sum, s) => sum + (s.deposit || 0), 0);
    const extrasDebit = payments?.extras?.filter((e: any) => e.isDebit).reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
    const extrasCredit = payments?.extras?.filter((e: any) => !e.isDebit).reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
    const totalAgreed = baseTotal + extrasDebit - extrasCredit;
    const paymentsMade = payments?.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
    const totalPaid = totalDeposit + paymentsMade;
    const remainingBalance = totalAgreed - totalPaid;

    return (
        <div className="space-y-6">
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Ödeme Ekle</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺)</label><input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="0" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Türü</label><select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl"><option value="nakit">Nakit</option><option value="havale">Havale/EFT</option><option value="kredi kartı">Kredi Kartı</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label><input type="text" value={paymentDesc} onChange={(e) => setPaymentDesc(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Opsiyonel..." /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">İptal</button>
                            <button onClick={handleAddPayment} disabled={saving || !paymentAmount} className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Ödeme Ekle'}</button>
                        </div>
                    </div>
                </div>
            )}
            {showExtraModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">{isDebit ? 'Hesaba Ekle' : 'Hesaptan Düş'}</h3>
                            <button onClick={() => setShowExtraModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Hizmet/Ürün Adı</label><input type="text" value={extraName} onChange={(e) => setExtraName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Örn: Ekstra Albüm..." /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺)</label><input type="number" value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="0" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label><input type="text" value={extraDesc} onChange={(e) => setExtraDesc(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="Opsiyonel..." /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowExtraModal(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">İptal</button>
                            <button onClick={handleAddExtra} disabled={saving || !extraName || !extraAmount} className={`flex-1 px-4 py-3 text-white rounded-xl font-medium disabled:opacity-50 ${isDebit ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>{saving ? 'Kaydediliyor...' : (isDebit ? 'Hesaba Ekle' : 'Hesaptan Düş')}</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100/50 transition-all duration-300 rounded-2xl p-5 border border-indigo-100/50 shadow-sm group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-indigo-500" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">Paket + Ekstra</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAgreed.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white hover:from-amber-100/50 transition-all duration-300 rounded-2xl p-5 border border-amber-100/50 shadow-sm group">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">Kapora</p>
                    <p className="text-2xl font-bold text-gray-900">{totalDeposit.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100/50 transition-all duration-300 rounded-2xl p-5 border border-emerald-100/50 shadow-sm group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">Toplam Ödenen</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 transition-all duration-300 rounded-2xl p-5 border border-gray-100 shadow-sm group">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CreditCard className={`w-6 h-6 ${remainingBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
                    </div>
                    <p className="text-gray-500 text-xs font-medium">Kalan Bakiye</p>
                    <p className={`text-2xl font-bold ${remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{remainingBalance.toLocaleString('tr-TR')} ₺</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    <CreditCard className="w-5 h-5" />
                    Ödeme Al
                </button>
                <button
                    onClick={() => { setIsDebit(true); setShowExtraModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Package className="w-5 h-5" />
                    Hesaba Ekle (Ekstra)
                </button>
                <button
                    onClick={() => { setIsDebit(false); setShowExtraModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    <Package className="w-5 h-5" />
                    Hesaptan Düş (İndirim)
                </button>
            </div>
            {shootWithPackage && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" />
                        Paket Detayları
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 transition-colors hover:bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">Paket</p>
                            <p className="font-semibold text-gray-900">{shootWithPackage.packageName}</p>
                        </div>
                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 transition-colors hover:bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">Paket Ücreti</p>
                            <p className="font-semibold text-gray-900">{baseTotal.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div className="bg-rose-50/30 rounded-xl p-4 border border-rose-100 transition-colors hover:bg-rose-50/50">
                            <p className="text-xs text-rose-600/80 mb-1">Ekstralar</p>
                            <p className="font-semibold text-rose-600">+{extrasDebit.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100 transition-colors hover:bg-emerald-50/50">
                            <p className="text-xs text-emerald-600/80 mb-1">İndirimler</p>
                            <p className="font-semibold text-emerald-600">-{extrasCredit.toLocaleString('tr-TR')} ₺</p>
                        </div>
                    </div>
                </div>
            )}
            {payments?.extras?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        Ekstralar & İndirimler
                    </h3>
                    <div className="space-y-3">
                        {payments.extras.map((extra: any, index: number) => (
                            <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-gray-50 ${extra.isDebit ? 'border-rose-100 bg-rose-50/10' : 'border-emerald-100 bg-emerald-50/10'}`}>
                                <div>
                                    <p className="font-semibold text-gray-900">{extra.name}</p>
                                    {extra.description && <p className="text-sm text-gray-500">{extra.description}</p>}
                                    <p className="text-xs text-gray-400 mt-1">{new Date(extra.date).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <p className={`text-lg font-bold ${extra.isDebit ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {extra.isDebit ? '+' : '-'}{extra.amount.toLocaleString('tr-TR')} ₺
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    Ödeme Geçmişi
                </h3>
                <div className="space-y-3">
                    {totalDeposit > 0 && (
                        <div className="flex items-center justify-between p-4 bg-amber-50/30 rounded-xl border border-amber-100 hover:bg-amber-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Kapora</p>
                                    <p className="text-sm text-gray-500">Randevu oluşturulurken alındı</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-amber-600">+{totalDeposit.toLocaleString('tr-TR')} ₺</p>
                        </div>
                    )}
                    {payments?.payments?.map((payment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {payment.type === 'nakit' ? 'Nakit' : payment.type === 'havale' ? 'Havale/EFT' : 'Kredi Kartı'}
                                    </p>
                                    {payment.description && <p className="text-sm text-gray-500">{payment.description}</p>}
                                    <p className="text-xs text-gray-400 mt-1">{new Date(payment.date).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-emerald-600">+{payment.amount.toLocaleString('tr-TR')} ₺</p>
                        </div>
                    ))}
                    {!totalDeposit && !payments?.payments?.length && (
                        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Henüz ödeme kaydı yok.</p>
                            <p className="text-sm text-gray-400 mt-1">Ödeme almak için yukarıdaki butonları kullanabilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div><p className="text-gray-400 text-sm mb-1">Cari Bakiye Özeti</p><p className="text-3xl font-bold">{remainingBalance > 0 ? `${remainingBalance.toLocaleString('tr-TR')} ₺ Kalan` : '✓ Ödeme Tamamlandı'}</p></div>
                    <div className="text-right space-y-1"><p className="text-gray-400 text-sm">Toplam Borç: <span className="text-white font-semibold">{totalAgreed.toLocaleString('tr-TR')} ₺</span></p><p className="text-gray-400 text-sm">Toplam Ödeme: <span className="text-green-400 font-semibold">{totalPaid.toLocaleString('tr-TR')} ₺</span></p></div>
                </div>
            </div>
        </div>
    );
}

function ContractTab({ customerId, onTabChange }: { customerId: string; onTabChange?: (tab: TabType) => void }) {
    const { showAlert } = useAlert();
    const [contract, setContract] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<any>(null);
    const [approved, setApproved] = useState(false);

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                // Fetch customer to get details
                const custRes = await fetch(`/api/customers/${customerId}`);
                const custData = await custRes.json();
                setCustomer(custData);

                // Fetch both shoots and contracts
                const [shootsRes, contractsRes] = await Promise.all([
                    fetch(`/api/shoots?customerId=${customerId}`),
                    fetch('/api/contracts')
                ]);

                const shootsData = await shootsRes.json();
                const contractsData = await contractsRes.json();

                // Priority: Use the direct contractId on the customer model if it exists
                let effectiveContractId = custData.contractId;
                let isDirectLink = !!custData.contractId;

                // Fallback: Check shoots if no direct contract is linked
                if (!effectiveContractId) {
                    const shootsRes = await fetch(`/api/shoots?customerId=${customerId}`);
                    const shootsData = await shootsRes.json();
                    const validShoot = shootsData.find((s: any) =>
                        s.contractId && contractsData.some((c: any) => c._id === s.contractId)
                    );
                    if (validShoot) {
                        effectiveContractId = validShoot.contractId;
                    }
                }

                if (effectiveContractId) {
                    const msgContract = contractsData.find((c: any) => c._id === effectiveContractId);

                    if (msgContract) {
                        setContract({
                            ...msgContract,
                            // If it's a shoot-based contract, we might have an approval status there
                            // For direct links, we'll assume pending unless we add a status field to Customer later
                            approved: false,
                            date: new Date().toISOString()
                        });
                    }
                }
            } catch (error) {
                console.error("Contract fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContractData();
    }, [customerId]);

    const handleApprove = () => {
        if (confirm("Müşteriye onay SMS'i gönderilecek ve sözleşme 'Onay Bekliyor' durumuna geçecek. Devam edilsin mi?")) {
            showAlert("Onay talebi gönderildi!", 'success');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    if (!contract) return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center print:hidden">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sözleşme Bulunamadı</h3>
            <p className="text-gray-500 max-w-md mx-auto">Bu müşteriye atanmış bir sözleşme bulunmuyor.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @media print {
                    @page { margin: 12mm; size: A4 portrait; }
                    html, body { 
                        height: 100%; 
                        width: 100%;
                    }
                    body { 
                        visibility: hidden; 
                        background: white !important; 
                        -webkit-print-color-adjust: exact;
                        font-family: 'Times New Roman', Times, serif;
                        color: #000;
                    }
                    .print-area { 
                        visibility: visible; 
                        position: relative;
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        height: 100vh;
                        padding: 0;
                        margin: 0;
                        display: flex !important;
                        flex-direction: column;
                        page-break-after: always;
                    }
                    .print-area:last-child {
                        page-break-after: avoid;
                    }
                    .print-area * { visibility: visible; }
                    .print-hidden { display: none !important; }
                    
                    /* Show hidden copies on print */
                    .print-only { display: flex !important; }

                    /* Header - Kompakt */
                    .print-header { 
                        text-align: center;
                        margin-bottom: 12px;
                        border-bottom: 1px solid #000;
                        padding-bottom: 8px;
                    }
                    .print-header h1 { font-size: 16pt !important; font-weight: bold; margin: 0 0 4px 0 !important; }
                    .print-header p { font-size: 9pt !important; margin: 0 !important; color: #333; }

                    /* Content - Daha küçük font */
                    .print-content { 
                        font-size: 10px !important;
                        line-height: 1.3 !important; 
                        text-align: justify;
                        flex-grow: 1;
                        flex-shrink: 1;
                        overflow: hidden;
                        margin-bottom: 8px;
                    }
                    
                    /* Footer - Kompakt */
                    .print-footer { 
                        margin-top: auto;
                        padding-top: 12px;
                        border-top: 1px solid #000;
                    }
                    .print-footer .grid { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: flex-end;
                    }
                    .print-footer .col { width: 45%; text-align: center; }
                    .print-footer p { font-size: 8pt !important; margin: 1px 0; }
                    .print-footer strong { font-weight: bold; }
                    
                    /* Signature - Küçültülmüş */
                    .signature-circle {
                        width: 60px; height: 60px; 
                        border: 2px solid #000; 
                        border-radius: 50%; 
                        margin: 6px auto; 
                        display: flex; align-items: center; justify-content: center;
                        transform: rotate(-10deg);
                    }
                }
            `}</style>

            {/* Actions Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm print-hidden">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${approved ? 'bg-green-100' : 'bg-amber-100'}`}>
                        {approved ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <History className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${approved ? 'text-green-800' : 'text-amber-800'}`}>
                            {approved ? 'Onaylandı' : 'Onay Bekliyor'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        PDF / Yazdır
                    </button>
                    {!approved && (
                        <button onClick={handleApprove} className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-bold rounded-lg transition-colors">
                            Onay İste
                        </button>
                    )}
                </div>
            </div>

            {/* Word Document Preview */}
            {/* Word Document Preview - Rendered key={1} on screen, [1,2] for print */}
            {[1, 2].map((copyNum) => (
                <div
                    key={copyNum}
                    className={`print-area mx-auto max-w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[12mm] relative text-black ${copyNum > 1 ? 'hidden print:flex' : ''}`}
                >
                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-900 pb-6 mb-8 print-header">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{contract.name}</h1>
                        <p className="text-sm font-serif text-gray-500 uppercase tracking-widest">Sözleşme No: {contract._id.substring(0, 8)}</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none font-serif text-justify text-gray-900 leading-relaxed whitespace-pre-wrap mb-12 print-content">
                        {contract.content}
                    </div>

                    {/* Signatures Footer */}
                    {/* Signatures Footer - Clean Layout */}
                    <div className="print-footer">
                        <div className="grid">
                            {/* Company Signature */}
                            <div className="col">
                                <p><strong>HİZMET SAĞLAYICI</strong></p>
                                <div className="signature-circle">
                                    <div className="text-center">
                                        <p className="font-bold text-[10px] uppercase truncate px-1">
                                            {customer?.photographerStudioName || 'STÜDYO'}
                                        </p>
                                        <p className="text-[8px] uppercase">DİJİTAL ONAY</p>
                                    </div>
                                </div>
                                <p className="font-serif">{customer?.photographerStudioName || 'Fotoğraf Stüdyonuz'}</p>
                                <p className="text-[10px] text-gray-500">{customer?.photographerName || 'Yetkili İmza'}</p>
                            </div>

                            {/* Customer Signature */}
                            <div className="col">
                                <p><strong>MÜŞTERİ</strong></p>

                                <div className="text-left bg-gray-50 print:bg-transparent p-2 rounded border border-gray-200 print:border-black my-2">
                                    <p className="font-bold text-sm mb-1 uppercase">
                                        {customer?.brideName} {customer?.groomName && `& ${customer.groomName}`}
                                    </p>
                                    <p>TC: <span className="font-mono">{customer?.tcId || '___________'}</span></p>
                                    <p>Tel: <span className="font-mono">{customer?.phone}</span></p>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-left mt-2 border border-gray-300 print:border-black rounded p-2">
                                    <div className={`w-4 h-4 border border-black flex items-center justify-center ${approved ? 'bg-black text-white' : ''}`}>
                                        {approved && <Check className="w-3 h-3" />}
                                    </div>
                                    <p className="text-[9px] leading-tight">
                                        Okudum, anladım, kabul ediyorum.<br />
                                        <span className="text-gray-500">IP: 192.168.1.1</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-[8px] text-gray-400 font-serif">
                                {customer?.photographerStudioName || 'Stüdyonuz'} • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SendAlbumTab({ customerId, initialPhotos, onPhotosUpdated }: { customerId: string, initialPhotos: any[], onPhotosUpdated: () => void }) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Albüm Fotoğrafları Gönder</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Otomatik Sıkıştırma Aktif
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                    Yüklediğiniz fotoğraflar otomatik olarak mobile uygun boyuta (maks. 1000px) küçültülecek ve <span className="font-bold">~200KB</span> seviyesine düşürülecektir. Orijinal kadraj (crop yok) korunur.
                </p>
            </div>

            <PhotoUpload
                customerId={customerId}
                initialPhotos={initialPhotos}
                onUploadComplete={onPhotosUpdated}
            />
        </div>
    );
}

function AccountTab({ customer, onUpdate, onTabChange }: { customer: Customer; onUpdate: () => void; onTabChange: (tab: TabType) => void }) {
    const { showAlert } = useAlert();
    const [saving, setSaving] = useState(false);
    const [contractTemplates, setContractTemplates] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        plainUsername: customer.user?.plainUsername || customer.plainUsername || '',
        plainPassword: customer.user?.plainPassword || customer.plainPassword || '',
        isActive: customer.user?.isActive !== undefined ? customer.user.isActive : true,
        canDownload: customer.canDownload !== undefined ? customer.canDownload : true,
        selectionCompleted: customer.selectionCompleted || false,
        albumLimit: customer.selectionLimits?.album || 22,
        coverLimit: customer.selectionLimits?.cover || 1,
        posterLimit: customer.selectionLimits?.poster || 1,
        contractId: customer.contractId || '',
    });

    const isTrial = customer.photographerPackageType === 'trial';
    const trialExpiry = customer.photographerSubscriptionExpiry ? new Date(customer.photographerSubscriptionExpiry) : null;
    const daysLeft = trialExpiry ? Math.max(0, Math.ceil((trialExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch('/api/contracts');
                if (res.ok) {
                    const data = await res.json();
                    setContractTemplates(data);
                }
            } catch (error) {
                console.error("Contract templates fetch error", error);
            }
        };
        fetchTemplates();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/customers/${customer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plainUsername: formData.plainUsername,
                    plainPassword: formData.plainPassword,
                    isActive: formData.isActive,
                    canDownload: formData.canDownload,
                    selectionCompleted: formData.selectionCompleted,
                    selectionLimits: {
                        album: formData.albumLimit,
                        cover: formData.coverLimit,
                        poster: formData.posterLimit,
                    },
                    contractId: formData.contractId || null
                })
            });

            if (res.ok) {
                showAlert('Ayarlar başarıyla kaydedildi!', 'success');
                onUpdate();
            } else {
                const data = await res.json();
                showAlert(data.error || 'Kaydedilemedi', 'error');
            }
        } catch (error) {
            console.error(error);
            showAlert('Bir hata oluştu', 'error');
        } finally {
            setSaving(false);
        }
    };

    const shareOnWhatsApp = () => {
        const baseUrl = window.location.origin;
        const selectionUrl = isTrial
            ? `${baseUrl}/selection/trial/${customer._id}`
            : `${baseUrl}/studio/${customer.photographerSlug}/selection`;

        const text = `Merhaba! Fotoğraf seçimleriniz için giriş bilgileriniz:\n\nPanel: ${selectionUrl}\nKullanıcı Adı: ${formData.plainUsername}\nŞifre: ${formData.plainPassword}\n\nKeyifli seçimler dileriz!`;
        const url = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Identity & Access */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            Kimlik & Erişim Kontrolü
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Kullanıcı Adı</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.plainUsername}
                                        onChange={(e) => setFormData({ ...formData, plainUsername: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Giriş Şifresi</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.plainPassword}
                                        onChange={(e) => setFormData({ ...formData, plainPassword: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${formData.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {formData.isActive ? <Globe className="w-5 h-5 text-green-600" /> : <ShieldX className="w-5 h-5 text-red-600" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Hesap Durumu</p>
                                            <p className="text-xs text-gray-500">{formData.isActive ? 'Müşteri sisteme giriş yapabilir' : 'Müşterinin girişi engellendi'}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="hidden" />
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            Aktivite Kayıtları
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Son Giriş:</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                    {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString('tr-TR') : 'Hiç giriş yapmadı'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Son IP:</span>
                                </div>
                                <span className="text-sm font-mono text-gray-900">{customer.lastLoginIp || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Gallery & Permissions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-500" />
                            Galeri & Yetkiler
                        </h3>
                        <div className="space-y-6">
                            <label className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl cursor-pointer group hover:bg-indigo-50 transition-colors border border-indigo-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <Download className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">İndirme İzni</p>
                                        <p className="text-xs text-gray-500">Orijinal fotoğrafları indirebilme</p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.canDownload ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <input type="checkbox" checked={formData.canDownload} onChange={(e) => setFormData({ ...formData, canDownload: e.target.checked })} className="hidden" />
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.canDownload ? 'right-1' : 'left-1'}`} />
                                </div>
                            </label>

                            <label className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl cursor-pointer group hover:bg-amber-50 transition-colors border border-amber-100/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.selectionCompleted ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                        {formData.selectionCompleted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Seçim Kilidi</p>
                                        <p className="text-xs text-gray-500">{formData.selectionCompleted ? 'Seçimler tamamlandı ve kilitlendi' : 'Müşteri seçim yapabilir'}</p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.selectionCompleted ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                    <input type="checkbox" checked={formData.selectionCompleted} onChange={(e) => setFormData({ ...formData, selectionCompleted: e.target.checked })} className="hidden" />
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.selectionCompleted ? 'right-1' : 'left-1'}`} />
                                </div>
                            </label>

                            <div className="pt-4 border-t border-gray-50 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seçim Limitlerini Güncelle</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Albüm</label>
                                        <input type="number" value={formData.albumLimit} onChange={(e) => setFormData({ ...formData, albumLimit: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Kapak</label>
                                        <input type="number" value={formData.coverLimit} onChange={(e) => setFormData({ ...formData, coverLimit: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Poster</label>
                                        <input type="number" value={formData.posterLimit} onChange={(e) => setFormData({ ...formData, posterLimit: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Sözleşme Bilgileri
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Atanan Sözleşme</label>
                            <select
                                value={formData.contractId}
                                onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                            >
                                <option value="">Sözleşme Seçilmemiş</option>
                                {contractTemplates.map((template) => (
                                    <option key={template._id} value={template._id}>
                                        {template.name} ({template.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!formData.contractId && (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-800">Sözleşme Atanmamış</p>
                                    <p className="text-xs text-amber-600/80">Bu müşteriye henüz bir sözleşme atanmadı. Lütfen yukarıdan bir şablon seçin.</p>
                                </div>
                            </div>
                        )}

                        {formData.contractId && (
                            <button
                                onClick={() => onTabChange('contract')}
                                className="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-indigo-900">Sözleşmeyi İncele</p>
                                        <p className="text-xs text-indigo-600">Sözleşme detaylarına git</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                    <MessageCircle className="w-5 h-5" />
                    Bilgileri WhatsApp ile Gönder
                </button>
                <div className="flex flex-col items-end">
                    {isTrial && (
                        <p className="text-[10px] text-amber-600 font-bold mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Deneme Sürümü: {daysLeft} gün kaldı
                        </p>
                    )}
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 active:scale-95"
                        >
                            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                            Ayarları Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
