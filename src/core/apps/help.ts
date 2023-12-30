import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";
import { CommandExecFn, CommandManager } from "../../managers/commands";

const exec: CommandExecFn = async (emitter: EventEmitter) => {
    emitter.emit("msg", JSON.stringify({ help: await catFile("apps/help/help.txt") }));
};

const helpCommands = new CommandManager();
helpCommands.registerCommand("default", exec);

export const app: IApp = {
    name: "help",
    label: "Help",
    isIndexed: false,
    commands: helpCommands
};
