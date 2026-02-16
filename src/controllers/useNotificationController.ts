import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../models';
import { notificationService } from '../services/NotificationService';

export const useNotificationController = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(() => {
        const all = notificationService.getAll();
        setNotifications(all);
        setUnreadCount(all.filter(n => !n.isRead).length);
    }, []);

    useEffect(() => {
        fetchNotifications();
        // In a real app, we might use a websocket or polling here
    }, [fetchNotifications]);

    const markAsRead = (id: string) => {
        notificationService.markAsRead(id);
        fetchNotifications();
    };

    const markAllAsRead = () => {
        notificationService.markAllAsRead();
        fetchNotifications();
    };

    const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        notificationService.addNotification(notif);
        fetchNotifications();
    };

    const deleteNotification = (id: string) => {
        notificationService.deleteNotification(id);
        fetchNotifications();
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        refreshNotifications: fetchNotifications
    };
};
