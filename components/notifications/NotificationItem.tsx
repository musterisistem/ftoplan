'use client';

import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Camera, Calendar, Clock, CheckCircle } from 'lucide-react';

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'PHOTO_SELECTION':
                return <Camera className="h-5 w-5 text-[#ff4081]" />;
            case 'NEW_APPOINTMENT':
                return <Calendar className="h-5 w-5 text-blue-500" />;
            case 'UPCOMING_SHOOT':
                return <Clock className="h-5 w-5 text-orange-500" />;
            default:
                return <CheckCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: tr,
    });

    return (
        <button
            onClick={() => onMarkAsRead(notification._id)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${!notification.isRead ? 'bg-blue-50/50' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-[#ff4081] rounded-full mt-1.5"></span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {timeAgo}
                    </p>
                </div>
            </div>
        </button>
    );
}
