import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";
import { CommandExecFn, CommandManager } from "../../managers/commands";
import { appsManager } from "../../core";

const exec: CommandExecFn = async () => catFile("apps/help/help.txt");
const listCommands: CommandExecFn = () => {
    return appsManager.listInstalled().flatMap(
        (app) => app.commands.listCommands().map(c => `${app.name}${c === "default" ? "" : ` ${c}`}`)
    );
}
const listApps: CommandExecFn = () => {
    return appsManager.listInstalled().map(app => ({
        name: app.name,
        description: app.description
    }));
};

const helpCommands = new CommandManager();
helpCommands.registerCommand("default", exec);
helpCommands.registerCommand("list-commands", listCommands);
helpCommands.registerCommand("list-apps", listApps);

export const app: IApp = {
    name: "help",
    label: "Help",
    isIndexed: false,
    commands: helpCommands
};
