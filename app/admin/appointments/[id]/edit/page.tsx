'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Mail,
    Calendar,
    MapPin,
    CreditCard,
    FileText,
    ChevronLeft,
    Save,
    Search,
    Package as PackageIcon,
    AlertCircle,
    CheckCircle2,
    Camera,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

// Mock Data (In a real app, these would come from APIs)
const PACKAGES = [
    { id: '1', name: 'Gold Düğün Paketi', price: 15000 },
    { id: '2', name: 'Platin Dış Çekim', price: 8500 },
    { id: '3', name: 'Standart Video Klip', price: 5000 },
];

export default function EditAppointmentPage() {
    const router = useRouter();
    const params = useParams();
    const shootId = params.id;

    // Form States
    const [pricingType, setPricingType] = useState<'package' | 'custom'>('package');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Form Data
    const [formData, setFormData] = useState({
        brideName: '',
        groomName: '',
        phone1: '',
        phone2: '',
        email: '',
        tcId: '',
        shootType: 'wedding',
        shootDate: '',
        shootTime: '',
        location: '',
        city: 'İstanbul',
        packageId: '',
        contractId: '',
        listPrice: 0,
        discount: 0,
        agreedPrice: 0,
        deposit: 0,
        notes: ''
    });

    // Calculations
    const remainingPayment = (formData.agreedPrice || 0) - (formData.deposit || 0);

    // Fetch Contracts and Shoot Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch contracts
                const contractsRes = await fetch('/api/contracts');
                if (contractsRes.ok) {
                    const contractsData = await contractsRes.json();
                    setContracts(contractsData);
                }

                // Fetch shoot details
                const shootRes = await fetch(`/api/shoots/${shootId}`);
                if (shootRes.ok) {
                    const shoot = await shootRes.json();

                    // Parse date and time
                    const dateObj = new Date(shoot.date);
                    const dateStr = dateObj.toISOString().split('T')[0];
                    const timeStr = dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                    setFormData({
                        brideName: shoot.customerId?.brideName || '',
                        groomName: shoot.customerId?.groomName || '',
                        phone1: shoot.customerId?.phone || '',
                        phone2: '', // API support needed if keeping 2 phones
                        email: shoot.customerId?.email || '',
                        tcId: shoot.customerId?.tcId || '',
                        shootType: shoot.type || 'wedding',
                        shootDate: dateStr,
                        shootTime: timeStr,
                        location: shoot.location || '',
                        city: shoot.city || 'İstanbul',
                        packageId: shoot.packageId || '',
                        contractId: shoot.contractId || '',
                        listPrice: 0, // Logic needed from package
                        discount: 0,
                        agreedPrice: shoot.agreedPrice || 0,
                        deposit: shoot.deposit || 0,
                        notes: shoot.notes || ''
                    });

                    if (shoot.packageId) {
                        setPricingType('package');
                    } else {
                        setPricingType('custom');
                    }
                } else {
                    alert('Randevu bulunamadı!');
                    router.push('/admin/appointments');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (shootId) fetchData();
    }, [shootId, router]);

    // Handlers
    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pkgId = e.target.value;
        const pkg = PACKAGES.find(p => p.id === pkgId);
        if (pkg) {
            setFormData(prev => ({ ...prev, packageId: pkgId, listPrice: pkg.price, agreedPrice: pkg.price }));
        } else {
            setFormData(prev => ({ ...prev, packageId: '' }));
        }
    };

    const handlePriceChange = (field: 'agreedPrice' | 'deposit' | 'discount', value: string) => {
        const numValue = parseFloat(value) || 0;
        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'phone1' | 'phone2') => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.shootDate) newErrors.shootDate = 'Çekim tarihi zorunludur.';
        if (!formData.shootTime) newErrors.shootTime = 'Çekim saati zorunludur.';
        if (!formData.brideName || formData.brideName.length < 2) newErrors.brideName = 'Gelin adı gereklidir.';
        if ((formData.shootType === 'wedding' || formData.shootType === 'engagement') && (!formData.groomName || formData.groomName.length < 2)) {
            newErrors.groomName = 'Damat adı gereklidir.';
        }
        if (!formData.phone1) newErrors.phone1 = 'Telefon numarası zorunludur.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert('Lütfen formdaki hataları gideriniz.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/shoots/${shootId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: new Date(`${formData.shootDate}T${formData.shootTime}`),
                    type: formData.shootType,
                    location: formData.location,
                    city: formData.city,
                    packageId: formData.packageId,
                    contractId: formData.contractId,
                    agreedPrice: formData.agreedPrice,
                    deposit: formData.deposit,
                    notes: formData.notes,
                    // Customer info update
                    customerData: {
                        brideName: formData.brideName,
                        groomName: formData.groomName,
                        phone: formData.phone1,
                        email: formData.email,
                        tcId: formData.tcId
                    }
                })
            });

            if (res.ok) {
                alert('Randevu başarıyla güncellendi!');
                router.push('/admin/calendar'); // Go back to calendar or list
            } else {
                throw new Error('Güncelleme başarısız');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Bir hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    return (
        <div className="p-4 lg:p-6 max-w-[1920px] mx-auto h-screen flex flex-col overflow-hidden">
            {/* Compact Header */}
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Randevuyu Düzenle</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 disabled:opacity-50">
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}
                    </button>
                </div>
            </div>

            {/* Main Content - 3 Column Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-auto">

                {/* Column 1: Customer Info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            Müşteri Bilgileri
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Gelin Adı *</label>
                                <input
                                    type="text"
                                    value={formData.brideName}
                                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.brideName ? 'border-red-500' : 'border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Damat Adı</label>
                                <input
                                    type="text"
                                    value={formData.groomName}
                                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.groomName ? 'border-red-500' : 'border-gray-200'}`}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Telefon 1 *</label>
                                <input
                                    type="tel"
                                    value={formData.phone1}
                                    onChange={(e) => handlePhoneChange(e, 'phone1')}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.phone1 ? 'border-red-500' : 'border-gray-200'}`}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">E-Posta</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">TC Kimlik No</label>
                            <input
                                type="text"
                                value={formData.tcId}
                                onChange={(e) => setFormData({ ...formData, tcId: e.target.value })}
                                maxLength={11}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Shoot Details */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-indigo-500" />
                            Çekim Detayları
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Çekim Türü</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[{ id: 'wedding', label: 'Düğün' }, { id: 'engagement', label: 'Nişan' }, { id: 'saveTheDate', label: 'Save The Date' }, { id: 'personal', label: 'Kişisel' }].map(type => (
                                    <button key={type.id} onClick={() => setFormData({ ...formData, shootType: type.id })} className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${formData.shootType === type.id ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Tarih *</label>
                                <input
                                    type="date"
                                    value={formData.shootDate}
                                    onChange={(e) => setFormData({ ...formData, shootDate: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Saat *</label>
                                <input
                                    type="time"
                                    value={formData.shootTime}
                                    onChange={(e) => setFormData({ ...formData, shootTime: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Lokasyon</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Şehir</label>
                            <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
                                <option value="İstanbul">İstanbul</option>
                                <option value="Ankara">Ankara</option>
                                <option value="İzmir">İzmir</option>
                                <option value="Antalya">Antalya</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Notlar</label>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none resize-none" rows={2} />
                        </div>
                    </div>
                </div>

                {/* Column 3: Financial & Contract */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-500" />
                                Ödeme
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-gray-100 p-0.5 rounded-lg flex">
                                <button onClick={() => { setPricingType('package'); setFormData(prev => ({ ...prev, packageId: '' })); }} className={`flex-1 py-1.5 text-xs font-medium rounded-md ${pricingType === 'package' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Paket</button>
                                <button onClick={() => { setPricingType('custom'); setFormData(prev => ({ ...prev, packageId: '', agreedPrice: 0 })); }} className={`flex-1 py-1.5 text-xs font-medium rounded-md ${pricingType === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>Özel</button>
                            </div>
                            {pricingType === 'package' && (
                                <select value={formData.packageId} onChange={handlePackageChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
                                    <option value="">Paket Seçiniz</option>
                                    {PACKAGES.map(pkg => (<option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price.toLocaleString()} TL</option>))}
                                </select>
                            )}
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Anlaşma Ücreti</label>
                                <div className="relative">
                                    <input type="number" value={formData.agreedPrice || ''} onChange={(e) => handlePriceChange('agreedPrice', e.target.value)} className="w-full px-3 py-2 text-sm font-bold border border-gray-200 rounded-lg outline-none" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">TL</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Kapora</label>
                                    <input type="number" value={formData.deposit || ''} onChange={(e) => handlePriceChange('deposit', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Kalan</label>
                                    <div className="px-3 py-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
                                        {remainingPayment.toLocaleString()} TL
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-500" />
                                Sözleşme
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <select value={formData.contractId} onChange={(e) => setFormData({ ...formData, contractId: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none">
                                <option value="">Sözleşme Seçiniz</option>
                                {contracts.map((c: any) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
