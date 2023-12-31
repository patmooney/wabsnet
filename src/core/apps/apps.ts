import { appsManager, eventManager } from "../../core";
import { IApp, IData } from "../../managers/apps";
import { CommandExecFn, CommandManager } from "../../managers/commands";
import { EventType, IEvent_AppInstall } from "../../managers/events";
import apps from "./";

const appsCommands = new CommandManager();

const help = `Apps

Repository for installable applications

USAGE: apps [sub-command] [args?]

Commands:

    list       Returns a public list of applications available for installation.
    install    Install an app.
`;

const list: CommandExecFn = () => {
    const appList = Object.values(apps)
        .filter(app => app.isIndexed)
        .map(app => ({ name: app.name, label: app.label, description: app.description }));
    return appList;
};

const install: CommandExecFn = (data: IData) => {
    const { appName } = data.options;
    if (!appName) {
        throw new Error("appName is required");
    }
    if (appsManager.listApps().find(app => app.name === appName)) {
        throw new Error(`${appName} already installed`);
    }
    eventManager.triggerEvent(
        eventManager.createEvent<IEvent_AppInstall>({
            type: EventType.app_installed,
            content: { appName }
        })
    );
    return `${appName} installed`;
};

export const app: IApp = {
    name: "apps",
    label: "Apps",
    isIndexed: false,
    commands: appsCommands,
    help
};

/* REGISTER COMMANDS + HELP */

appsCommands.registerCommand(
    "list", list,
    `apps list

Returns a public list of applications available for installation.

Usage: apps list [args?]

Args:

    search    String, optional. Returns apps which have a descripion or name which contains this.
`);

appsCommands.registerCommand(
    "install", install,
    `apps install

Install given app.

Usage: apps install {"appName": "news"}

Args:

    appName    String, required. Name of app to install.
`)
