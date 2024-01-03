export interface IEmail {
    id: string;
    sender: string;
    text: string;
    date: Date;
    isRead: boolean;
}

export class EmailManager {
    private emailMap: Map<string, IEmail>;

    constructor() {
        this.reset();
    }

    reset() {
        this.emailMap = new Map<string, IEmail>();
    }

    list() {
        return Array.from(this.emailMap.values())
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    addEmail(newEmail: Omit<IEmail, "date"> & { date?: Date }) {
        if (!this.emailMap.get(newEmail.id)) {
            const email: IEmail = {
                ...newEmail,
                date: newEmail.date ?? new Date()
            };
            this.emailMap.set(email.id, email);
        }
    }
}
