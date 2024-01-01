import EventEmitter from "node:events";
import { logManager } from "../../core";
import { LogLevel } from "../../managers/LogManager";
import { IApp, IData } from "../../managers/apps";
import { CommandExecFn, CommandManager, RemainConnected } from "../../managers/commands";
import { keepAlive } from "../../utils/keep-alive";

const help = `log

More information on errors for debugging.

Usage: wabsnet log [args?]

Args:

    level    String, optional, default=info. Options: debug, info, warning, error, fatal
`;

export const log: CommandExecFn = (data: IData, emitter: EventEmitter) => {
    const { level } = data.options;
    let connected = true;
    emitter.on("close", () => connected = false);

    keepAlive(emitter);

    logManager.subscribe(
        level ?? "info",
        (level: LogLevel, log: string) => {
            emitter.emit("msg", JSON.stringify({ level, log, time: (new Date()).toISOString() }));
            return connected;
        }
    );
    // Indicate to command manager to take no further cxn related actions.
    return RemainConnected;
};

const commands = new CommandManager();
commands.registerCommand("default", log);

export const app: IApp = {
    name: "log",
    label: "Logger",
    description: "Server logging for debug",
    isIndexed: true,
    commands,
    help
};
