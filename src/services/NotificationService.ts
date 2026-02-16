import { Notification } from '../models';

class NotificationService {
    private STORAGE_KEY = 'camping_management_notifications';

    private getNotifications(): Notification[] {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            const initialNotifications: Notification[] = [
                {
                    id: 'n1',
                    title: 'Welcome!',
                    message: 'Welcome to the management system.',
                    type: 'info',
                    isRead: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'n2',
                    title: 'First Project!',
                    message: 'You have been assigned to your first project.',
                    type: 'success',
                    isRead: false,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveNotifications(initialNotifications);
            return initialNotifications;
        }
        return JSON.parse(stored);
    }

    private saveNotifications(notifications: Notification[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    }

    public getAll(): Notification[] {
        return this.getNotifications();
    }

    public markAsRead(id: string): void {
        const notifications = this.getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].isRead = true;
            this.saveNotifications(notifications);
        }
    }

    public markAllAsRead(): void {
        const notifications = this.getNotifications().map(n => ({ ...n, isRead: true }));
        this.saveNotifications(notifications);
    }

    public addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void {
        const notifications = this.getNotifications();
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            isRead: false,
            createdAt: new Date().toISOString()
        };
        notifications.unshift(newNotification);
        this.saveNotifications(notifications);
    }

    public deleteNotification(id: string): void {
        const notifications = this.getNotifications().filter(n => n.id !== id);
        this.saveNotifications(notifications);
    }
}

export const notificationService = new NotificationService();
