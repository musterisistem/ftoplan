'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CustomerUser {
    id: string;
    name: string;
    photographerId: string;
    username: string;
    role: 'customer';
}

interface CustomerAuthContextType {
    customer: CustomerUser | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<CustomerUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verify session on mount
    useEffect(() => {
        verifySession();
    }, []);

    const verifySession = async () => {
        try {
            const res = await fetch('/api/auth/customer/verify');

            if (res.ok) {
                const data = await res.json();
                setCustomer(data.customer);
            } else {
                setCustomer(null);
            }
        } catch (error) {
            console.error('Session verification failed:', error);
            setCustomer(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const res = await fetch('/api/auth/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCustomer(data.customer);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Giriş başarısız' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Bağlantı hatası' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/customer/logout', { method: 'POST' });
            setCustomer(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <CustomerAuthContext.Provider value={{ customer, isLoading, login, logout }}>
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
    }
    return context;
}
