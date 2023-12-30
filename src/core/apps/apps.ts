import EventEmitter from "node:events";
import { appsManger } from "../../core";
import { IApp } from "../../managers/apps";

export const app: IApp = {
    name: "apps",
    label: "Apps",
    isIndexed: false,
    exec: (emitter: EventEmitter) => {
        const apps = appsManger.listApps();
        const appList = apps
            .filter(app => app.isIndexed)
            .map(app => ({ name: app.name, label: app.label, description: app.description }));
        emitter.emit("msg", JSON.stringify(appList));
        emitter.emit("end");
    }
};
