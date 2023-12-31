import { appsManager } from "../../core";
import { IApp } from "../../managers/apps";
import { CommandExecFn, CommandManager } from "../../managers/commands";

const appsCommands = new CommandManager();

const help = `Apps

Repository for installable applications

USAGE: apps [sub-command] [args?]

Commands:

    list    Returns a public list of applications available for installation
`;

const list: CommandExecFn = () => {
    const apps = appsManager.listApps();
    const appList = apps
        .filter(app => app.isIndexed)
        .map(app => ({ name: app.name, label: app.label, description: app.description }));
    return appList;
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
    "list",
    list,
    `apps list

Returns a public list of applications available for installation.

Usage: apps list [args?]

Args:

    search    String, optional. Returns apps which have a descripion or name which contains this.
`
);


