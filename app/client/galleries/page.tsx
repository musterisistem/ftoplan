'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Image as ImageIcon, Download, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface Photo {
    url: string;
    filename: string;
    uploadedAt: string;
    size: number;
}

interface CustomerData {
    brideName: string;
    groomName: string;
    photos: Photo[];
}

export default function ClientGalleriesPage() {
    const { data: session } = useSession();
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

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
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (selectedPhoto !== null && customer?.photos) {
            setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : customer.photos.length - 1);
        }
    };

    const handleNext = () => {
        if (selectedPhoto !== null && customer?.photos) {
            setSelectedPhoto(selectedPhoto < customer.photos.length - 1 ? selectedPhoto + 1 : 0);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!customer || !customer.photos || customer.photos.length === 0) {
        return (
            <div className="text-center py-20">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Henüz fotoğraf yok</h2>
                <p className="text-gray-500">Fotoğraflarınız yüklendikten sonra burada görünecektir.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-pink-500" />
                        Fotoğraflarınız
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {customer.brideName}{customer.groomName ? ` & ${customer.groomName}` : ''} • {customer.photos.length} fotoğraf
                    </p>
                </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {customer.photos.map((photo, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedPhoto(index)}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group relative"
                    >
                        <img
                            src={photo.url}
                            alt={photo.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-gray-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto !== null && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Image */}
                    <div className="max-w-[90vw] max-h-[90vh] relative">
                        <img
                            src={customer.photos[selectedPhoto].url}
                            alt={customer.photos[selectedPhoto].filename}
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <p className="text-white/70 text-sm">
                                {selectedPhoto + 1} / {customer.photos.length}
                            </p>
                        </div>
                    </div>

                    {/* Download Button */}
                    <a
                        href={customer.photos[selectedPhoto].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        <span>İndir</span>
                    </a>
                </div>
            )}
        </div>
    );
}
