'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { Upload, X, CheckCircle, AlertCircle, FileImage, Loader2, HardDrive, Trash2 } from 'lucide-react'; // Added Trash2

interface PhotoUploadProps {
    customerId: string;
    onUploadComplete?: () => void;
    initialPhotos?: any[];
}

interface UploadFile extends File {
    preview?: string;
}

interface UploadStatus {
    id: string; // Use file name as ID for simplicity
    status: 'pending' | 'compressing' | 'uploading' | 'success' | 'error';
    progress: number;
    error?: string;
    compressedSize?: number;
}

export default function PhotoUpload({ customerId, onUploadComplete, initialPhotos }: PhotoUploadProps) {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter(); // For refreshing
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<any[]>(initialPhotos || []);
    const [uploadStatuses, setUploadStatuses] = useState<Record<string, UploadStatus>>({});
    const [isGlobalUploading, setIsGlobalUploading] = useState(false);

    // Selection for Deletion
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]); // Store filenames
    const [isDeleting, setIsDeleting] = useState(false);

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastUploadTotalSize, setLastUploadTotalSize] = useState(0);

    // Sync state with props when data is refreshed
    useEffect(() => {
        // Always update if initialPhotos is provided (even if empty, it might be a clear operation)
        if (initialPhotos !== undefined) {
            setExistingPhotos(initialPhotos);
        }
    }, [initialPhotos]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setFiles(prev => [...prev, ...newFiles]);

        // Initialize status for new files
        const newStatuses: Record<string, UploadStatus> = {};
        newFiles.forEach(file => {
            newStatuses[file.name] = {
                id: file.name,
                status: 'pending',
                progress: 0
            };
        });
        setUploadStatuses(prev => ({ ...prev, ...newStatuses }));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        }
    });

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        setUploadStatuses(prev => {
            const next = { ...prev };
            delete next[fileName];
            return next;
        });
    };

    const toggleSelection = (filename: string) => {
        setSelectedPhotos(prev =>
            prev.includes(filename)
                ? prev.filter(f => f !== filename)
                : [...prev, filename]
        );
    };


    const handleDeleteSelected = async () => {
        console.log('[FRONTEND] Delete button clicked');
        console.log('[FRONTEND] Selected photos:', selectedPhotos);
        console.log('[FRONTEND] Existing photos:', existingPhotos);

        if (selectedPhotos.length === 0) {
            alert('Lütfen silmek için fotoğraf seçin.');
            return;
        }

        const confirmMessage = `${selectedPhotos.length} fotoğrafı silmek istediğinize emin misiniz?`;
        console.log('[FRONTEND] Showing confirm:', confirmMessage);

        if (!window.confirm(confirmMessage)) {
            console.log('[FRONTEND] User cancelled');
            return;
        }

        console.log('[FRONTEND] User confirmed, starting delete...');
        setIsDeleting(true);

        try {
            // Find size info for quota update
            const photosToDelete = existingPhotos
                .filter(p => selectedPhotos.includes(p.filename))
                .map(p => ({ filename: p.filename, size: p.size }));

            console.log('[FRONTEND] Photos to delete:', photosToDelete);
            console.log('[FRONTEND] Calling API...');

            const apiUrl = `/api/customers/${customerId}/photos`;
            console.log('[FRONTEND] API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photos: photosToDelete }),
            });

            console.log('[FRONTEND] API Response status:', response.status);
            const responseData = await response.json();
            console.log('[FRONTEND] API Response data:', responseData);

            if (response.ok) {
                console.log('[FRONTEND] Delete successful!');
                // Remove from local state
                setExistingPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.filename)));
                setSelectedPhotos([]);

                alert(`✅ ${photosToDelete.length} fotoğraf başarıyla silindi!`);

                // Reload page to refresh all data
                console.log('[FRONTEND] Reloading page...');
                window.location.reload();
            } else {
                console.error('[FRONTEND] Delete failed:', responseData);
                alert(`❌ Silme işlemi başarısız: ${responseData.error || 'Bilinmeyen hata'}`);
            }
        } catch (error) {
            console.error('[FRONTEND] Delete error:', error);
            alert(`❌ Silme işlemi sırasında hata oluştu: ${error}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
            initialQuality: 0.7,
            fileType: 'image/jpeg'
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error('Compression error:', error);
            throw error;
        }
    };

    const handleUploadAll = async () => {
        const usage = session?.user?.storageUsage || 0;
        const limit = session?.user?.storageLimit || 21474836480;

        const pendingFiles = files.filter(f => {
            const status = uploadStatuses[f.name]?.status;
            return !status || status === 'pending' || status === 'error';
        });

        const estimatedTotalSize = pendingFiles.reduce((acc, file) => acc + file.size, 0);

        if (usage + estimatedTotalSize > limit) {
            alert('Depolama kotanız yetersiz. Lütfen alan açın veya daha az fotoğraf yükleyin.');
            return;
        }

        setIsGlobalUploading(true);
        let currentBatchSize = 0;

        for (const file of pendingFiles) {
            const updateStatus = (updates: Partial<UploadStatus>) => {
                setUploadStatuses(prev => ({
                    ...prev,
                    [file.name]: { ...prev[file.name], ...updates }
                }));
            };

            try {
                updateStatus({ status: 'compressing', progress: 10 });
                const compressedFile = await compressImage(file);
                updateStatus({ status: 'uploading', progress: 30 });

                const formData = new FormData();
                formData.append('file', compressedFile, file.name);
                formData.append('customerId', customerId);

                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/upload/bunny');

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = 30 + (event.loaded / event.total) * 70;
                        updateStatus({ progress: percentComplete });
                    }
                };

                const promise = new Promise<{ url: string, size?: number }>((resolve, reject) => {
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                resolve(JSON.parse(xhr.responseText));
                            } catch (e) {
                                resolve({ url: '' });
                            }
                        } else {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                reject(new Error(response.error || `Upload failed (${xhr.status})`));
                            } catch (e) {
                                reject(new Error(`Upload failed (${xhr.status}): ${xhr.statusText}`));
                            }
                        }
                    };
                    xhr.onerror = () => reject(new Error('Network error'));
                });

                xhr.send(formData);

                const result = await promise;
                const uploadedSize = result.size || compressedFile.size;
                currentBatchSize += uploadedSize;

                updateStatus({
                    status: 'success',
                    progress: 100,
                    compressedSize: uploadedSize
                });

                // Add to existing photos for immediate display
                setExistingPhotos(prev => [...prev, {
                    url: result.url,
                    filename: file.name,
                    size: uploadedSize,
                    uploadedAt: new Date().toISOString()
                }]);

                // Remove from pending files list to avoid duplicate display or confusion
                setFiles(prev => prev.filter(f => f.name !== file.name));

            } catch (error: any) {
                console.error('Upload failed for', file.name, error);
                updateStatus({ status: 'error', error: error.message || 'Hata oluştu' });
            }
        }

        setIsGlobalUploading(false);
        setLastUploadTotalSize(currentBatchSize);
        setShowSuccessModal(true);

        // Update session to refresh storage quota in sidebar
        console.log('[UPLOAD] Updating session...');
        if (updateSession) {
            try {
                await updateSession();
                console.log('[UPLOAD] Session updated successfully');
            } catch (error) {
                console.error('[UPLOAD] Session update failed:', error);
            }
        } else {
            console.warn('[UPLOAD] updateSession not available');
        }

        if (onUploadComplete) onUploadComplete();

        router.refresh();
    };

    const totalFiles = files.length;
    const completedFiles = Object.values(uploadStatuses).filter(s => s.status === 'success').length;
    const isAllCompleted = totalFiles > 0 && totalFiles === completedFiles;

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Control Bar for Deletion */}
            {selectedPhotos.length > 0 && (
                <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-red-900">{selectedPhotos.length} fotoğraf seçildi</span>
                    </div>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Seçilenleri Sil
                    </button>
                </div>
            )}

            {/* Drag & Drop Zone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-base font-medium text-gray-700">Fotoğrafları buraya sürükleyin</p>
                        <p className="text-xs text-gray-500 mt-1">veya tıklayın</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className="text-[10px] px-2 py-1 bg-gray-100 rounded text-gray-600">JPG, PNG</span>
                        <span className="text-[10px] px-2 py-1 bg-gray-100 rounded text-gray-600">Max 1000px</span>
                    </div>
                </div>
            </div>

            {/* Actions Bar for New Uploads & Stats */}
            {(existingPhotos.length > 0 || files.length > 0) && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-4 z-10 mb-4">
                    <div className="flex items-center gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-700">Albüm Fotoğrafları</h3>
                            <p className="text-xs text-gray-500">
                                {existingPhotos.length + files.length} fotoğraf
                            </p>
                        </div>

                        {/* Total Size Display */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
                            <HardDrive className="w-4 h-4 text-indigo-600" />
                            <div>
                                <p className="text-[10px] text-indigo-600 font-medium">Toplam Boyut</p>
                                <p className="text-xs font-bold text-indigo-700">
                                    {formatSize(existingPhotos.reduce((acc, p) => acc + (p.size || 0), 0) + files.reduce((acc, f) => acc + f.size, 0))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Delete All Button */}
                        {existingPhotos.length > 0 && (
                            <button
                                onClick={async () => {
                                    if (!confirm('TÜM albüm fotoğraflarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;

                                    setIsDeleting(true);
                                    try {
                                        const photosToDelete = existingPhotos.map(p => ({ filename: p.filename, size: p.size }));

                                        const res = await fetch(`/api/customers/${customerId}/photos`, {
                                            method: 'DELETE',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ photos: photosToDelete }),
                                        });

                                        if (res.ok) {
                                            setExistingPhotos([]);
                                            setSelectedPhotos([]);
                                            if (onUploadComplete) {
                                                onUploadComplete();
                                            }
                                            alert('Tüm fotoğraflar silindi!');
                                        } else {
                                            alert('Silme işlemi başarısız oldu.');
                                        }
                                    } catch (error) {
                                        console.error('Delete error:', error);
                                        alert('Hata oluştu.');
                                    } finally {
                                        setIsDeleting(false);
                                    }
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Tümünü Sil
                            </button>
                        )}

                        {/* Upload All Button */}
                        {!isAllCompleted && files.length > 0 && (
                            <button
                                onClick={handleUploadAll}
                                disabled={isGlobalUploading || totalFiles === 0}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm
                                    ${isGlobalUploading
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'}`}
                            >
                                {isGlobalUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Bunları Yükle
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Combined Gallery View */}
            {(existingPhotos.length > 0 || files.length > 0) && (
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2">
                    {/* Existing Photos */}
                    {existingPhotos.map((photo, index) => (
                        <div
                            key={`existing-${index}`}
                            className={`group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer ${selectedPhotos.includes(photo.filename) ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-200'}`}
                            onClick={() => toggleSelection(photo.filename)}
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />

                                {/* Selection Checkbox */}
                                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPhotos.includes(photo.filename) ? 'bg-red-500 border-red-500' : 'bg-white/50 border-white group-hover:border-gray-300'}`}>
                                    {selectedPhotos.includes(photo.filename) && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>

                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                    <span className="text-[8px] text-white/90 truncate block">{formatSize(photo.size)}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pending Upload Files */}
                    {files.map(file => {
                        const status = uploadStatuses[file.name] || { status: 'pending', progress: 0 };
                        return (
                            <div key={file.name} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden opacity-80">
                                <div className="aspect-square bg-gray-100 relative">
                                    {file.preview ? (
                                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <FileImage className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    )}

                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                                        className="absolute top-1 right-1 p-0.5 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    {/* Uploading Overlay */}
                                    {(status.status === 'compressing' || status.status === 'uploading') && (
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                                            <Loader2 className="w-5 h-5 text-white animate-spin mb-1" />
                                            <span className="text-[8px] text-white font-medium">{status.progress.toFixed(0)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Albümünüz başarı ile yüklenmiştir</h3>
                            <div className="bg-gray-50 rounded-lg py-2 px-4 mb-6 border border-gray-100">
                                <p className="text-sm text-gray-500 font-medium">Gönderilen albüm toplam boyut</p>
                                <p className="text-lg font-bold text-indigo-600">{formatSize(lastUploadTotalSize)}</p>
                            </div>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Harika!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
