import { appsManager, eventManager, logManager } from "./core";

import { app as apps } from "./core/apps/apps";
import { app as chat } from "./core/apps/chat";
import { app as file } from "./core/apps/file";
import { app as help } from "./core/apps/help";
import { app as netstat } from "./core/apps/netstat";
import { app as news } from "./core/apps/news";
import { app as log } from "./core/apps/log";

export const setup = () => {
    logManager.info("Loading apps");
    appsManager.addApp(apps);
    appsManager.addApp(chat);
    appsManager.addApp(file);
    appsManager.addApp(help);
    appsManager.addApp(netstat);
    appsManager.addApp(news);
    appsManager.addApp(log);

    appsManager.installApp("apps");
    appsManager.installApp("help");

    logManager.info("Loading events");
    eventManager.loadEvents();
};
