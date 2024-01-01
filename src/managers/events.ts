import { randomUUID } from "node:crypto";
import type { IEmail } from "./email"
import { deserialize, serialize } from "node:v8";
import fs from "node:fs/promises";
import { loadJSON } from "../utils/resource";

const events = loadJSON<{ [key: string]: IEvent }>("events/events.json");

import { appsManager, emailManager, logManager, notificationManager } from "../core";
import { INotification } from "./notifications";

export enum EventType {
    email,
    app_installed,
    app_removed,
    notification
}

export type IEvent_Email = {
    id: string;
    type: EventType.email;
    content: IEmail;
};

export type IEvent_AppInstall = {
    id: string;
    type: EventType.app_installed;
    content: { appName: string }
};

export type IEvent_AppRemove = Omit<IEvent_AppInstall, "type"> & { type: EventType.app_removed };

export type IEvent_Notification = {
    id: string;
    type: EventType.notification;
    content: INotification;
}

export type IEvent = IEvent_Email | IEvent_AppInstall | IEvent_AppRemove | IEvent_Notification;

const SAVE_LOCATION = "./sav.dat";

export class EventManager {
    private eventSet: Set<IEvent>;
    
    constructor() {
        this.eventSet = new Set<IEvent>();
    }

    async triggerEventId(eventId: string) { 
        const event = (await events)[eventId];
        if (!event) {
            throw new Error(`Unknown event ${eventId}`);
        }
        return this.triggerEvent(event);
    }

    triggerEvent(event: IEvent) {
        const { type, content } = event;
        switch(type) {
            case EventType.email:
                emailManager.addEmail(content);
                break;
            case EventType.app_installed:
                appsManager.installApp(content.appName);
                break;
            case EventType.app_removed:
                appsManager.removeApp(content.appName);
                break;
            case EventType.notification:
                notificationManager.createNotification(content.appName, content.content, content.expiresOn);
                break;
            default:
                throw new Error(`Unknown event type "${type}"`);
        }
        this.eventSet.add(event);
    }

    createEvent<T>(event: Omit<IEvent, "id"> & { id?: string }): T {
        return {
            ...event,
            id: event.id ?? randomUUID()
        } as T;
    }

    saveEvents() {
        // serialise active events to file
        return fs.writeFile(SAVE_LOCATION, serialize(this.eventSet));
    }

    async loadEvents() {
        try {
            // load active events from save file and replay
            const data = await fs.readFile(SAVE_LOCATION);
            const eventSet: IEvent[] = deserialize(data);

            Array.from(eventSet).forEach(
                (evt) => this.triggerEvent(evt)
            );
        } catch (err) {
            logManager.fatal(`Unable to load save: ${err}`);
        }
    }
}
