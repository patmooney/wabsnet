export interface INotification {
    appName: string;
    expiresOn?: number;
    content: string;
}

const NOTIFICATION_TTL = 10 * 60 * 1000;

export class NotificationManager {
    private notificationSet: Set<INotification>;

    constructor() {
        this.reset();
    }

    reset() {
        this.notificationSet = new Set<INotification>();
    }


    getNotifications() {
        const notifications = Array.from(this.notificationSet)
            .map((notification) => ({
                ...notification,
                expiresOn: notification.expiresOn ?? Date.now() + NOTIFICATION_TTL
            }))
            .filter((notification) => notification.expiresOn > Date.now());
        this.notificationSet = new Set<INotification>(notifications);
        return notifications;
    }

    createNotification(appName: string, content: string, expiresOn?: number) {
        this.notificationSet.add({ appName, content, expiresOn });
    }
}

