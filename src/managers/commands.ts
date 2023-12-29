/*
 * Command manager, you can register commands with this to make it accessible to the app
 */

import { CommandNotFoundError, SubCommandNotSuppliedError } from "../errors";

export const isCommandExecFn = (fn: CommandManager | CommandExecFn): fn is CommandExecFn => {
    return !(fn instanceof CommandManager);
};

export type CommandExecFn = (argv: string[]) => Promise<void>;

export class CommandManager {
    private commandMap: Map<string, CommandManager | CommandExecFn>;

    // exec can be a function or another CommandManager
    public registerCommand (commandName: string, exec: CommandManager | CommandExecFn) {
        this.commandMap = new Map<string, CommandManager | CommandExecFn>();
        this.commandMap.set(commandName, exec);
    }

    public exec(commandName: string, argv: string[]): Promise<void> | void {
        const fn = this.commandMap.get(commandName);
        if (!fn) {
            throw new CommandNotFoundError(commandName);
        }
        if (isCommandExecFn(fn)) {
            return fn(argv);
        }
        const subCommand = argv.shift();
        if (!subCommand) {
            try {
                fn.exec("help", argv);
            } catch (err) {
                throw new SubCommandNotSuppliedError();
            }
        }
    }
}
