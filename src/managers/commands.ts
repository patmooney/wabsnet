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
    private commandMap: Map<string, { exec: CommandFnUnion, help?: string }>;

    constructor() {
        this.commandMap = new Map<string, { exec: CommandFnUnion, help?: string }>();
    }

    // exec can be a function or another CommandManager
    public registerCommand (commandName: string, exec: CommandFnUnion, help?: string) {
        this.commandMap.set(commandName, { exec, help });
    }

    public async exec(commandName: string, data: IData, emitter: EventEmitter): Promise<void> {
        console.log(data.commands);
        const command = this.commandMap.get(commandName);
        if (!command) {
            throw new CommandNotFoundError(commandName);
        }
        const { exec, help } = command;

        // If help is requested for a command - i.e. `wabsnet.exe chat search help`
        if (data.commands.at(0) === "help") {
            emitter.emit("msg", JSON.stringify({ help: help ?? "No help available" }));
            return;
        }

        if (isGenerator(exec)) {
            const gen = exec(data);
            let connected = true;
            emitter.on("close", () => connected = false);
            while (connected) {
                const { value, done } = await gen.next();
                value && emitter.emit("msg", JSON.stringify(value));
                if (done) { break; }
            }
            gen.return();
        } else if (isCommandExecFn(exec)) {
            emitter.emit("msg", JSON.stringify(await exec(data)));
        } else if (isCommandManager(exec)) {
            const subCommand = data.commands.shift();
            if (subCommand) {
                emitter.emit("msg", await exec.exec(subCommand, data, emitter));
            }
            try {
                emitter.emit("msg", await exec.exec("help", data, emitter));
            } catch (err) {
                throw new SubCommandNotSuppliedError();
            }
        }
    }

    public listCommands(): string[] {
        const commands = Array.from(this.commandMap.keys());
        const stack = [];
        for (let command of commands) {
            const { exec } = this.commandMap.get(command) ?? {};
            if (!exec) {
                continue;
            }
            const subCommands = isCommandManager(exec) ? exec.listCommands() : [];
            if (subCommands.length) {
                stack.push(...subCommands.map(sC => [command, ...sC].join(" ")));
            } else {
                stack.push(command);
            }
        }
        return stack;
    }

    public hasCommand(commandName: string): boolean {
        return this.commandMap.has(commandName);
    }
}
