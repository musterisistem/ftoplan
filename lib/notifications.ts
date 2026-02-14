import dbConnect from './mongodb';
import Notification, { NotificationType, NotificationTypeValue } from '@/models/Notification';

interface CreateNotificationParams {
    type: NotificationTypeValue;
    userId: string; // Photographer ID
    customerId?: string;
    relatedId?: string;
    customerName?: string;
    shootDate?: Date;
    shootType?: string;
}

/**
 * Create a notification for a photographer
 */
export async function createNotification(params: CreateNotificationParams) {
    await dbConnect();

    const { type, userId, customerId, relatedId, customerName, shootDate, shootType } = params;

    let title = '';
    let message = '';

    // Generate title and message based on notification type
    switch (type) {
        case NotificationType.PHOTO_SELECTION:
            title = '📸 Fotoğraf Seçimi Tamamlandı';
            message = `${customerName} fotoğraf seçimini tamamladı ve onayladı.`;
            break;

        case NotificationType.NEW_APPOINTMENT:
            title = '📅 Yeni Randevu Oluşturuldu';
            const formattedDate = shootDate
                ? new Date(shootDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
                : 'Belirtilmemiş';
            const typeText = shootType ? ` (${getShootTypeText(shootType)})` : '';
            message = `${customerName} için ${formattedDate} tarihinde yeni randevu oluşturuldu${typeText}.`;
            break;

        case NotificationType.UPCOMING_SHOOT:
            title = '⏰ Yaklaşan Çekim Randevusu';
            const upcomingDate = shootDate
                ? new Date(shootDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'Yakında';
            message = `${customerName} ile ${upcomingDate} tarihinde çekim randevunuz var.`;
            break;

        default:
            title = 'Bildirim';
            message = 'Yeni bir bildiriminiz var.';
    }

    // Create notification
    const notification = await Notification.create({
        type,
        title,
        message,
        userId,
        customerId: customerId || null,
        relatedId: relatedId || null,
        isRead: false,
    });

    console.log('✅ Notification created:', notification._id, '-', title);
    return notification;
}

/**
 * Get user-friendly shoot type text in Turkish
 */
function getShootTypeText(type: string): string {
    const typeMap: Record<string, string> = {
        'wedding': 'Düğün',
        'engagement': 'Nişan',
        'saveTheDate': 'Save The Date',
        'personal': 'Kişisel Çekim',
        'other': 'Diğer',
    };
    return typeMap[type] || type;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
    await dbConnect();
    return await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
    );
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
    await dbConnect();
    return await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string, limit: number = 50) {
    await dbConnect();
    return await Notification.find({ userId })
        .populate('customerId', 'brideName groomName')
        .sort({ createdAt: -1 })
        .limit(limit);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string) {
    await dbConnect();
    return await Notification.countDocuments({ userId, isRead: false });
}
