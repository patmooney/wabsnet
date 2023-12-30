import { appsManger } from "../../core";
import { IApp } from "../../managers/apps";
import { CommandExecFn, CommandManager } from "../../managers/commands";

const exec: CommandExecFn = () => {
    const apps = appsManger.listApps();
    const appList = apps
        .filter(app => app.isIndexed)
        .map(app => ({ name: app.name, label: app.label, description: app.description }));
    return appList;
};

const appsCommands = new CommandManager();
appsCommands.registerCommand("default", exec);

export const app: IApp = {
    name: "apps",
    label: "Apps",
    isIndexed: false,
    commands: appsCommands
};
