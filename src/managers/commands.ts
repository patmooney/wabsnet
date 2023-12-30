/*
 * Command manager, you can register commands with this to make it accessible to the app
 */

import EventEmitter from "node:events";
import { CommandNotFoundError, SubCommandNotSuppliedError } from "../errors";
import { IData } from "./apps";

export const isCommandExecFn = (fn: CommandFnUnion): fn is CommandExecFn => {
    return !(fn instanceof CommandManager);
};

export const isGenerator = (fn: CommandFnUnion): fn is CommandExecGenerator => {
    return fn.constructor.name === "AsyncGeneratorFunction";
};

export const isCommandManager = (fn: CommandFnUnion): fn is CommandManager => {
    return fn.constructor.name === "CommandManager";
};

export type CommandExecFn = ((data: IData) => Promise<any> | any);
export type CommandExecGenerator = (data: IData) => AsyncGenerator<any, void, unknown>;
export type CommandFnUnion = CommandExecFn | CommandExecGenerator | CommandManager;

export class CommandManager {
    private commandMap: Map<string, CommandFnUnion>;

    constructor() {
        this.commandMap = new Map<string, CommandFnUnion>();
    }

    // exec can be a function or another CommandManager
    public registerCommand (commandName: string, exec: CommandFnUnion) {
        this.commandMap.set(commandName, exec);
    }

    public async exec(commandName: string, data: IData, emitter: EventEmitter): Promise<void> {
        const fn = this.commandMap.get(commandName);
        if (!fn) {
            throw new CommandNotFoundError(commandName);
        }
        if (isGenerator(fn)) {
            const gen = fn(data);
            let connected = true;
            emitter.on("close", () => connected = false);
            while (connected) {
                const { value, done } = await gen.next();
                emitter.emit("msg", JSON.stringify(value));
                if (done) { break; }
            }
            gen.return();
        } else if (isCommandExecFn(fn)) {
            emitter.emit("msg", JSON.stringify(await fn(data)));
        } else if (isCommandManager(fn)) {
            const subCommand = data.commands.shift();
            if (subCommand) {
                emitter.emit("msg", await fn.exec(subCommand, data, emitter));
            }
            try {
                emitter.emit("msg", await fn.exec("help", data, emitter));
            } catch (err) {
                throw new SubCommandNotSuppliedError();
            }
        }
    }
}
