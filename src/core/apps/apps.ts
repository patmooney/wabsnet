import { appsManger } from "../../core";
import { IApp } from "../../managers/apps";
import { cat } from "../../utils/cat";

export const app: IApp = {
    name: "apps",
    label: "Apps",
    isIndexed: false,
    exec: () => {
        const apps = appsManger.listApps();
        const text = apps
            .filter(app => app.isIndexed)
            .map(app => `${app.name}              ${app.description ?? '-'}`)
            .join("\n");
        console.log("\n\nList of available applications...");
        return cat(text);
    }
};
