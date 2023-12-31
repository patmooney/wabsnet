import { AppsManager } from "./managers/apps";

import { NetworkManager } from "./managers/network";
import { EmailManager } from "./managers/email";
import { EventManager } from "./managers/events";

// Init Default Apps
import apps from "./core/apps";
export const appsManager = new AppsManager();
appsManager.addApp("help", apps.help);
appsManager.addApp("apps", apps.apps);

export const networkManager = new NetworkManager();
export const emailManager = new EmailManager();
export const eventManager = new EventManager();

console.log("Loading events");
eventManager.loadEvents();

setInterval(() => {
    console.log("Pruning network resources");
    networkManager.prune();
    console.log("Saving state");
    eventManager.saveEvents();
}, 60000);
