/*
 * Command manager, you can register commands with this to make it accessible to the app
 */

import EventEmitter from "node:events";
import { CommandNotFoundError, SubCommandNotSuppliedError } from "../errors";
import { IData } from "./apps";

export const isCommandExecFn = (fn: CommandManager | CommandExecFn): fn is CommandExecFn => {
    return !(fn instanceof CommandManager);
};

export type CommandExecFn = (emitter: EventEmitter, data: IData) => Promise<void> | void;

export class CommandManager {
    private commandMap: Map<string, CommandManager | CommandExecFn>;

    constructor() {
        this.commandMap = new Map<string, CommandManager | CommandExecFn>();
    }

    // exec can be a function or another CommandManager
    public registerCommand (commandName: string, exec: CommandManager | CommandExecFn) {
        this.commandMap.set(commandName, exec);
    }

    public exec(commandName: string, data: IData, emitter: EventEmitter): Promise<void> | void {
        const fn = this.commandMap.get(commandName);
        if (!fn) {
            throw new CommandNotFoundError(commandName);
        }
        if (isCommandExecFn(fn)) {
            return fn(emitter, data);
        }
        const subCommand = data.commands.shift();
        if (subCommand) {
            return fn.exec(subCommand, data, emitter);
        }
        try {
            return fn.exec("help", data, emitter);
        } catch (err) {
            throw new SubCommandNotSuppliedError();
        }
    }
}
