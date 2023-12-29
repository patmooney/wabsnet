import { AppsManager, IApp } from "./managers/apps";

import { app as help } from "./core/apps/help";
import { app as apps } from "./core/apps/apps";
import { app as boobs } from "./core/apps/boobs";
import { app as news } from "./core/apps/news";
import { NetworkManager } from "./managers/network";

// Init apps
export const appsManger = new AppsManager();
const coreApps = [
    help,
    apps,
    boobs,
    news
];
coreApps.forEach(
    (app: IApp) => appsManger.addApp(app.name, app)
);

export const networkManager = new NetworkManager();
