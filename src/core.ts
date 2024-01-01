import { AppsManager } from "./managers/apps";

import { NetworkManager } from "./managers/network";
import { EmailManager } from "./managers/email";
import { EventManager } from "./managers/events";
import { NotificationManager } from "./managers/notifications";

export const appsManager = new AppsManager();
export const networkManager = new NetworkManager();
export const emailManager = new EmailManager();
export const eventManager = new EventManager();
export const notificationManager = new NotificationManager();

const PERIODIC_FREQUENCY = 60_000;
let loopId: NodeJS.Timeout;
export const startLoop = () => {
    loopId = setInterval(() => execPeriodicActions(), PERIODIC_FREQUENCY)
};

export const haltLoop = () => {
    clearInterval(loopId);
    return execPeriodicActions();
};

export const execPeriodicActions = async () => {
    console.log("Pruning network resources");
    networkManager.prune();
    console.log("Saving state");
    await eventManager.saveEvents();
}
