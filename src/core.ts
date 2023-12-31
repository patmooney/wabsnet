import { AppsManager, IApp } from "./managers/apps";

import { app as help } from "./core/apps/help";
import { app as apps } from "./core/apps/apps";
import { app as news } from "./core/apps/news";
import { app as chat } from "./core/apps/chat";
import { app as netstat } from "./core/apps/netstat";
import { app as file } from "./core/apps/file";

import { NetworkManager } from "./managers/network";

// Init apps
export const appsManager = new AppsManager();
const coreApps = [
    help,
    apps,
    news,
    chat,
    netstat,
    file
];
coreApps.forEach(
    (app: IApp) => appsManager.addApp(app.name, app)
);

export const networkManager = new NetworkManager();

setInterval(() => {
    console.log("Pruning network resources");
    networkManager.prune();
}, 60000)
