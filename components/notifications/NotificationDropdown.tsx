'use client';

import { useEffect, useRef } from 'react';
import NotificationItem from './NotificationItem';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClose: () => void;
    isOpen: boolean;
}

export default function NotificationDropdown({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClose,
    isOpen,
}: NotificationDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#ff4081]/5 to-blue-500/5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                        Bildirimler
                        {unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-[#ff4081] text-white px-2 py-0.5 rounded-full">
                                {unreadCount} yeni
                            </span>
                        )}
                    </h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-[#ff4081] hover:text-[#ff4081]/80 font-medium transition-colors"
                        >
                            Tümünü okundu işaretle
                        </button>
                    )}
                </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <div className="text-gray-400 text-sm">
                            <svg
                                className="mx-auto h-12 w-12 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <p className="font-medium">Bildirim yok</p>
                            <p className="text-xs mt-1">Yeni bildirimler burada görünecek</p>
                        </div>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
                    <button className="text-xs text-gray-600 hover:text-[#ff4081] transition-colors">
                        Tüm bildirimleri görüntüle
                    </button>
                </div>
            )}
        </div>
    );
}
