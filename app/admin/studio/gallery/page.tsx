'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Image as ImageIcon, Plus, X } from 'lucide-react';

export default function GalleryPage() {
    const { data: session, status } = useSession();
    const [portfolioPhotos, setPortfolioPhotos] = useState<Array<{ url: string; title: string }>>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/admin/studio-settings').then(r => r.json()).then(data => {
                if (!data.error) setPortfolioPhotos(data.portfolioPhotos || []);
            });
        }
    }, [status]);

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch('/api/admin/studio-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portfolioPhotos }) });
        setSaving(false);
        setMessage(res.ok ? 'Kaydedildi!' : 'Hata');
        setTimeout(() => setMessage(''), 3000);
    };

    const addPhoto = () => {
        const url = prompt('Fotoğraf URL\'si girin:');
        if (url) setPortfolioPhotos([...portfolioPhotos, { url, title: '' }]);
    };

    const removePhoto = (index: number) => {
        setPortfolioPhotos(portfolioPhotos.filter((_, i) => i !== index));
    };

    if (status === 'loading') {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Galeri</h1>
                    <p className="text-gray-500">Portfolio fotoğraflarınızı yönetin</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={addPhoto} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200">
                        <Plus className="w-4 h-4" /> Fotoğraf Ekle
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message && <div className={`mb-4 p-4 rounded-xl ${message.includes('Hata') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}

            <div className="grid grid-cols-3 gap-4">
                {portfolioPhotos.map((photo, index) => (
                    <div key={index} className="relative group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <img src={photo.url} alt="" className="w-full h-48 object-cover" />
                        <button onClick={() => removePhoto(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {portfolioPhotos.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Henüz fotoğraf eklenmedi</p>
                    <button onClick={addPhoto} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl">Fotoğraf Ekle</button>
                </div>
            )}
        </div>
    );
}
