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
    Camera
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';

// Mock Data (In a real app, these would come from APIs)
const PACKAGES = [
    { id: '1', name: 'Gold Düğün Paketi', price: 15000 },
    { id: '2', name: 'Platin Dış Çekim', price: 8500 },
    { id: '3', name: 'Standart Video Klip', price: 5000 },
];

const CONTRACTS = [
    { id: '1', name: 'Dış Çekim Sözleşmesi (Standart)' },
    { id: '2', name: 'Video Çekim Sözleşmesi v2' },
    { id: '3', name: 'Düğün Hikayesi Sözleşmesi' },
];

export default function NewAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showAlert } = useAlert();

    // Form States
    const [customerType, setCustomerType] = useState<'new' | 'existing'>('new');
    const [pricingType, setPricingType] = useState<'package' | 'custom'>('package');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [noAppointment, setNoAppointment] = useState(false);
    const [contracts, setContracts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/contracts')
            .then(res => res.json())
            .then(data => setContracts(data))
            .catch(err => console.error('Failed to fetch contracts', err));
    }, []);

    // Credentials Modal State
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState<any>(null);

    // Customer Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

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

    // Pre-fill date from URL
    useEffect(() => {
        const urlDate = searchParams.get('date');
        if (urlDate) {
            setFormData(prev => ({ ...prev, shootDate: urlDate }));
        }
    }, [searchParams]);

    // Helpers
    const formatPhoneNumber = (value: string) => {
        // Remove all non-numeric chars
        const numbers = value.replace(/\D/g, '');

        // Limit to 11 digits (05XX XXX XX XX)
        // User asked for exactly 11 characters
        const clean = numbers.startsWith('0') ? numbers : '0' + numbers;
        const capped = clean.substring(0, 11);

        // If user wants raw 11 digits or formatted? 
        // User said: "telefon kutuları 11 karakterli olsun"
        // Formatted looks nicer but if they insist on length check...
        // Let's keep the mask but ensure underlying data handling is correct.
        // Mask format "(05XX) XXX XX XX" is 15 chars long.
        // If users means "11 digits of data", we are good.
        // If they mean "11 chars in input", they want unmasked.
        // Assuming they mean Data Length (11 digits).

        // We will stick to the mask for UX, but ensure the DATA is valid 11 digits.

        let result = '';
        if (capped.length > 0) result += '(' + capped.substring(0, 4);
        if (capped.length > 4) result += ') ' + capped.substring(4, 7);
        if (capped.length > 7) result += ' ' + capped.substring(7, 9);
        if (capped.length > 9) result += ' ' + capped.substring(9, 11);

        return result;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'phone1' | 'phone2') => {
        const val = e.target.value;
        // Allows user to delete
        if (val.length < formData[field].length) {
            setFormData(prev => ({ ...prev, [field]: val }));
            return;
        }

        const formatted = formatPhoneNumber(val);
        setFormData(prev => ({ ...prev, [field]: formatted }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleTcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 11);
        setFormData(prev => ({ ...prev, tcId: val }));
        if (errors.tcId) setErrors(prev => ({ ...prev, tcId: '' }));
    };

    // Customer Search Effect
    useEffect(() => {
        const searchCustomers = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await fetch(`/api/customers?search=${encodeURIComponent(searchTerm)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };
        const timer = setTimeout(searchCustomers, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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

    const handleCustomerSelect = (customer: any) => {
        setSelectedCustomer(customer);
        setFormData(prev => ({
            ...prev,
            brideName: customer.brideName || '',
            groomName: customer.groomName || '',
            phone1: customer.phone || '',
            email: customer.email || '',
        }));
        setSearchTerm('');
        setSearchResults([]);
        setErrors({});
    };

    const validateForm = (checkShoot = true) => {
        const newErrors: { [key: string]: string } = {};

        // Date/Time Check
        if (checkShoot) {
            if (!formData.shootDate) newErrors.shootDate = 'Çekim tarihi zorunludur.';
            if (!formData.shootTime) newErrors.shootTime = 'Çekim saati zorunludur.';
        }

        // Customer Logic
        if (customerType === 'new') {
            if (!formData.brideName || formData.brideName.length < 2) newErrors.brideName = 'Gelin adı gereklidir.';
            if (formData.shootType === 'wedding' || formData.shootType === 'engagement') {
                if (!formData.groomName || formData.groomName.length < 2) newErrors.groomName = 'Damat adı gereklidir.';
            }
            if (!formData.phone1) newErrors.phone1 = 'Telefon numarası zorunludur.';
            // The mask includes spaces/parens, so it's longer than 11. 
            // formatPhoneNumber makes it (0XXX) XXX XX XX -> roughly 14-16 chars.
            if (formData.phone1.replace(/\D/g, '').length < 10) newErrors.phone1 = 'Geçerli bir telefon numarası giriniz.';
        } else {
            if (!selectedCustomer) newErrors.customer = 'Lütfen bir müşteri seçiniz.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm(!noAppointment)) {
            showAlert('Lütfen formdaki hataları gideriniz.', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            let customerId = '';
            let newCustomerData = null;

            if (customerType === 'existing') {
                if (!selectedCustomer) {
                    showAlert('Lütfen bir müşteri seçiniz.', 'warning');
                    setIsSubmitting(false);
                    return;
                }
                customerId = selectedCustomer._id;
            } else {
                const customerRes = await fetch('/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        brideName: formData.brideName,
                        groomName: formData.groomName,
                        phone: formData.phone1,
                        email: formData.email,
                        weddingDate: formData.shootDate || null,
                        notes: `Müşteri Kaydı: ${formData.notes}`,
                        tcId: formData.tcId
                    })
                });

                if (!customerRes.ok) {
                    const errorData = await customerRes.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Müşteri oluşturulamadı');
                }

                newCustomerData = await customerRes.json();
                customerId = newCustomerData._id;
                if (newCustomerData.credentials) {
                    setCreatedCredentials(newCustomerData.credentials);
                }
            }

            // Only create appointment/shoot if noAppointment is false
            if (!noAppointment) {
                const shootRes = await fetch('/api/shoots', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerId,
                        date: new Date(`${formData.shootDate}T${formData.shootTime}`),
                        type: formData.shootType,
                        location: formData.location,
                        city: formData.city,
                        packageId: formData.packageId,
                        contractId: formData.contractId,
                        agreedPrice: formData.agreedPrice,
                        deposit: formData.deposit,
                        notes: formData.notes
                    })
                });

                if (!shootRes.ok) {
                    const errorData = await shootRes.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Randevu oluşturulamadı');
                }
            }

            if (customerType === 'new') {
                setShowCredentialsModal(true);
            } else {
                showAlert(noAppointment ? 'Müşteri başarıyla kaydedildi!' : 'Randevu başarıyla oluşturuldu!', 'success');
                router.push('/admin/appointments');
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            showAlert(`Bir hata oluştu: ${error.message || 'Lütfen tekrar deneyiniz.'}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 max-w-[1920px] mx-auto h-screen flex flex-col overflow-hidden">
            {/* Compact Header */}
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Yeni Randevu Oluştur</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50">Taslak</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 disabled:opacity-50">
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {/* Main Content - 3 Column Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-auto">

                {/* Column 1: Customer Info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" />
                            Müşteri Bilgileri
                        </h3>
                        <div className="flex bg-gray-200/50 p-0.5 rounded-md">
                            <button onClick={() => setCustomerType('new')} className={`px-2 py-1 text-xs font-medium rounded ${customerType === 'new' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>Yeni</button>
                            <button onClick={() => { setCustomerType('existing'); setNoAppointment(false); }} className={`px-2 py-1 text-xs font-medium rounded ${customerType === 'existing' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>Mevcut</button>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        {customerType === 'existing' ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 outline-none" placeholder="Telefon veya isim ile ara..." />
                                </div>
                                {searchResults.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                        {searchResults.map((customer) => (
                                            <button key={customer._id} onClick={() => handleCustomerSelect(customer)} className="w-full px-3 py-2 text-left hover:bg-indigo-50 border-b border-gray-100 last:border-0">
                                                <div className="text-sm font-medium text-gray-900">{customer.brideName} & {customer.groomName}</div>
                                                <div className="text-xs text-gray-500">{customer.phone}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {selectedCustomer && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-medium text-indigo-600">Seçili Müşteri</p>
                                                <p className="text-sm font-bold text-indigo-900">{selectedCustomer.brideName} & {selectedCustomer.groomName}</p>
                                                <p className="text-xs text-indigo-700 mt-1">{selectedCustomer.phone}</p>
                                            </div>
                                            <button onClick={() => { setSelectedCustomer(null); setFormData(prev => ({ ...prev, brideName: '', groomName: '', phone1: '', email: '' })); }} className="text-indigo-600 hover:text-indigo-800">
                                                <AlertCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Gelin Adı *</label>
                                        <input
                                            type="text"
                                            value={formData.brideName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, brideName: e.target.value });
                                                if (errors.brideName) setErrors(prev => ({ ...prev, brideName: '' }));
                                            }}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.brideName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
                                            placeholder="Ad Soyad"
                                        />
                                        {errors.brideName && <p className="text-xs text-red-500 mt-1">{errors.brideName}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Damat Adı</label>
                                        <input
                                            type="text"
                                            value={formData.groomName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, groomName: e.target.value });
                                                if (errors.groomName) setErrors(prev => ({ ...prev, groomName: '' }));
                                            }}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.groomName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
                                            placeholder="Ad Soyad"
                                        />
                                        {errors.groomName && <p className="text-xs text-red-500 mt-1">{errors.groomName}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Telefon 1 *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone1}
                                            onChange={(e) => handlePhoneChange(e, 'phone1')}
                                            maxLength={16}
                                            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.phone1 ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
                                            placeholder="(05XX) XXX XX XX"
                                        />
                                        {errors.phone1 && <p className="text-xs text-red-500 mt-1">{errors.phone1}</p>}
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Telefon 2</label>
                                        <input
                                            type="tel"
                                            value={formData.phone2}
                                            onChange={(e) => handlePhoneChange(e, 'phone2')}
                                            maxLength={16}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                            placeholder="(05XX) XXX XX XX"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">E-Posta</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">TC / Pasaport (11 Haneli)</label>
                                    <input
                                        type="text"
                                        value={formData.tcId}
                                        onChange={handleTcChange}
                                        maxLength={11}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none"
                                        placeholder="Kimlik No"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-0.5">Sadece rakam giriniz (Max 11 karakter)</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Column 2: Shoot Details */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-indigo-500" />
                            Çekim Detayları
                        </h3>
                        {/* No Appointment Toggle */}
                        <div className="flex items-center gap-2">
                            {customerType === 'existing' && (
                                <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded text-[9px] font-bold border border-amber-100 animate-in fade-in slide-in-from-right-2">
                                    <AlertCircle className="w-2.5 h-2.5" />
                                    MEVCUT MÜŞTERİYE RANDEVU ŞARTTIR
                                </div>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${customerType === 'existing' ? 'text-gray-300' : 'text-gray-400'}`}>Randevu Yok</span>
                            <button
                                onClick={() => customerType === 'new' && setNoAppointment(!noAppointment)}
                                disabled={customerType === 'existing'}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${noAppointment ? 'bg-indigo-600' : 'bg-gray-200'} ${customerType === 'existing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={customerType === 'existing' ? 'Mevcut müşteriler için randevu oluşturulmalıdır' : ''}
                            >
                                <span
                                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${noAppointment ? 'translate-x-4.5' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                    <div className={`p-4 space-y-3 transition-opacity duration-300 ${noAppointment ? 'opacity-40 pointer-events-none grayscale-[0.5]' : 'opacity-100'}`}>
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
                                    max="2035-12-31"
                                    value={formData.shootDate}
                                    onChange={(e) => {
                                        setFormData({ ...formData, shootDate: e.target.value });
                                        if (errors.shootDate) setErrors(prev => ({ ...prev, shootDate: '' }));
                                    }}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.shootDate ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
                                />
                                {errors.shootDate && <p className="text-xs text-red-500 mt-1">{errors.shootDate}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Saat *</label>
                                <input
                                    type="time"
                                    value={formData.shootTime}
                                    onChange={(e) => {
                                        setFormData({ ...formData, shootTime: e.target.value });
                                        if (errors.shootTime) setErrors(prev => ({ ...prev, shootTime: '' }));
                                    }}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${errors.shootTime ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`}
                                />
                                {errors.shootTime && <p className="text-xs text-red-500 mt-1">{errors.shootTime}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Lokasyon</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="Atatürk Arboretumu" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Şehir</label>
                            <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none">
                                <option value="İstanbul">İstanbul</option>
                                <option value="Ankara">Ankara</option>
                                <option value="İzmir">İzmir</option>
                                <option value="Antalya">Antalya</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Notlar</label>
                            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none resize-none" rows={2} placeholder="Ek notlar..." />
                        </div>
                    </div>
                </div>

                {/* Column 3: Financial & Contract */}
                <div className="space-y-4">
                    {/* Financial Card */}
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
                                <select value={formData.packageId} onChange={handlePackageChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none">
                                    <option value="">Paket Seçiniz</option>
                                    {PACKAGES.map(pkg => (<option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price.toLocaleString()} TL</option>))}
                                </select>
                            )}
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Anlaşma Ücreti</label>
                                <div className="relative">
                                    <input type="number" value={formData.agreedPrice || ''} onChange={(e) => handlePriceChange('agreedPrice', e.target.value)} className="w-full px-3 py-2 text-sm font-bold border border-gray-200 rounded-lg focus:border-indigo-500 outline-none" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">TL</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Kapora</label>
                                    <input type="number" value={formData.deposit || ''} onChange={(e) => handlePriceChange('deposit', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="0" />
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

                    {/* Contract Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-500" />
                                Sözleşme
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <select value={formData.contractId} onChange={(e) => setFormData({ ...formData, contractId: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-indigo-500 outline-none">
                                <option value="">Sözleşme Seçiniz</option>
                                {contracts.map((c: any) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                            </select>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <input type="checkbox" className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300" />
                                <span className="text-xs text-gray-600">Müşteri sözleşmeyi onayladı</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credentials Modal */}
            {showCredentialsModal && createdCredentials && createdCredentials.displayUsername && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Müşteri Oluşturuldu</h2>
                            <p className="text-sm text-gray-500 mt-1">Giriş bilgilerini not alınız.</p>
                        </div>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase">Kullanıcı Adı</label>
                                <div className="text-lg font-mono font-medium text-gray-900 select-all">{createdCredentials.displayUsername}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase">Şifre</label>
                                <div className="text-lg font-mono font-bold text-indigo-600 select-all">{createdCredentials.password}</div>
                            </div>
                        </div>
                        <button onClick={() => { setShowCredentialsModal(false); setCreatedCredentials(null); router.push('/admin/appointments'); }} className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 text-sm">
                            Tamam
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
