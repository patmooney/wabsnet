/*
 * Command manager, you can register commands with this to make it accessible to the app
 */

import EventEmitter from "node:events";
import { CommandNotFoundError, SubCommandNotSuppliedError } from "../errors";

export const isCommandExecFn = (fn: CommandManager | CommandExecFn): fn is CommandExecFn => {
    return !(fn instanceof CommandManager);
};

export type CommandExecFn = (emitter: EventEmitter, argv: string[]) => Promise<void> | void;

export class CommandManager {
    private commandMap: Map<string, CommandManager | CommandExecFn>;

    constructor() {
        this.commandMap = new Map<string, CommandManager | CommandExecFn>();
    }

    // exec can be a function or another CommandManager
    public registerCommand (commandName: string, exec: CommandManager | CommandExecFn) {
        this.commandMap.set(commandName, exec);
    }

    public exec(commandName: string, argv: string[], emitter: EventEmitter): Promise<void> | void {
        const fn = this.commandMap.get(commandName);
        if (!fn) {
            throw new CommandNotFoundError(commandName);
        }
        if (isCommandExecFn(fn)) {
            return fn(emitter, argv);
        }
        const subCommand = argv.shift();
        if (subCommand) {
            return fn.exec(subCommand, argv, emitter);
        }
        try {
            return fn.exec("help", argv, emitter);
        } catch (err) {
            throw new SubCommandNotSuppliedError();
        }
    }
}
