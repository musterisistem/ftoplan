'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertModal from '@/components/AlertModal';

type AlertType = 'info' | 'success' | 'error' | 'warning';

interface AlertContextType {
    showAlert: (message: string, type?: AlertType, title?: string) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alert, setAlert] = useState<{
        isOpen: boolean;
        message: string;
        type: AlertType;
        title?: string;
    }>({
        isOpen: false,
        message: '',
        type: 'info',
    });

    const showAlert = useCallback((message: string, type: AlertType = 'info', title?: string) => {
        setAlert({ isOpen: true, message, type, title });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <AlertModal
                isOpen={alert.isOpen}
                onClose={hideAlert}
                message={alert.message}
                type={alert.type}
                title={alert.title}
            />
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}
