import { randomUUID } from "node:crypto";
import type { IEmail } from "./email"
import { deserialize, serialize } from "node:v8";
import fs from "node:fs/promises";

import eventsJson from "../core/content/events/events.json";
const events = eventsJson as unknown as { [key: string]: IEvent };

import { appsManager, emailManager } from "../core";

export enum EventType {
    email,
    app_installed,
    app_removed
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

export type IEvent = IEvent_Email | IEvent_AppInstall | IEvent_AppRemove;

const SAVE_LOCATION = "./sav.dat";

export class EventManager {
    private eventSet: Set<IEvent>;
    
    constructor() {
        this.eventSet = new Set<IEvent>();
    }

    triggerEventId(eventId: keyof typeof events) { 
        const event = events[eventId];
        if (!event) {
            throw new Error(`Unknown event ${eventId}`);
        }
        return this.triggerEvent(event);
    }

    triggerEvent(event: IEvent) {
        const eventType = event.type;
        switch(eventType) {
            case EventType.email:
                emailManager.addEmail(event.content);
                break;
            case EventType.app_installed:
                appsManager.installApp(event.content.appName);
                break;
            case EventType.app_removed:
                appsManager.removeApp(event.content.appName);
                break;
            default:
                throw new Error(`Unknown event type "${eventType}"`);
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
            console.error("Unable to load save", err);
        }
    }
}
