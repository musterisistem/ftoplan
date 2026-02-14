import { useState, useEffect, useCallback } from 'react';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    userId: string;
    customerId?: {
        brideName: string;
        groomName: string;
    };
    relatedId?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/notifications');

            if (!res.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await res.json();
            setNotifications(data);
        } catch (err: any) {
            console.error('Error fetching notifications:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
            });

            if (!res.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state
            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
            });

            if (!res.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
}
