export interface User {
    _id: string;
    email: string;
    role: 'admin' | 'couple';
    customerId?: string;
    createdAt: string;
}

export interface Customer {
    _id: string;
    brideName: string;
    groomName: string;
    phone: string;
    email?: string;
    weddingDate?: string;
    status: 'active' | 'completed' | 'archived';
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Shoot {
    _id: string;
    customerId: string | Customer;
    date: string;
    time: string;
    type: 'düğün' | 'dış çekim' | 'nişan' | 'kına' | 'save the date' | 'diğer';
    location: string;
    notes?: string;
    status: 'planned' | 'completed' | 'cancelled';
}

export interface Payment {
    _id: string;
    customerId: string;
    contractTotal: number;
    payments: {
        amount: number;
        date: string;
        type: 'kapora' | 'nakit' | 'havale' | 'kredi kartı';
        description?: string;
    }[];
    createdAt: string;
}

export interface Gallery {
    _id: string;
    customerId: string;
    shootId?: string;
    title: string;
    coverImage?: string;
    photos: {
        url: string;
        filename: string;
        uploadedAt: string;
    }[];
    createdAt: string;
}
