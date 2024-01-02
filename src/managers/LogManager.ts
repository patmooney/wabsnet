export type LogLevel = "info" | "debug" | "fatal" | "warning" | "error";
const levelOrder = ["debug", "info", "warning", "error", "fatal"] as LogLevel[];

export type LogHandlerFn = (level: LogLevel, log: string) => boolean | Promise<boolean>;
export interface ILogSubscriber {
    isRemoved?: boolean;
    handler: LogHandlerFn;
    level: LogLevel;
}

export class LogManager {
    private subscribers: Set<ILogSubscriber>;
    private allowedLevels: Set<LogLevel>;

    constructor(level: LogLevel = "info") {
        this.subscribers = new Set<ILogSubscriber>();
        this.allowedLevels = new Set<LogLevel>(levelOrder.slice(levelOrder.indexOf(level)));
    }

    subscribe(level: LogLevel, handler: LogHandlerFn) {
        this.subscribers.add({ level, handler });
    }

    info (log: string) { this.log("info", log); }
    debug (log: string) { this.log("debug", log); }
    fatal (log: string) { this.log("fatal", log); }
    warning (log: string) { this.log("warning", log); }
    error (log: string) { this.log("error", log); }

    stack (e: Error) {
        this.log("error", e.message);
        if (this.allowedLevels.has("error")) {
            console.log(e.stack);
        }
    }

    log (level: LogLevel, log: string) {
        if (!this.allowedLevels.has(level)) {
            return;
        }
        console.log(`[${level.toUpperCase()}] - ${log}`);
        Array.from(this.subscribers.values())
            .filter((subscriber) =>
                levelOrder.indexOf(level) >= levelOrder.indexOf(subscriber.level)
            ).forEach(
                async (subscriber) => {
                    if (!subscriber.isRemoved) {
                        subscriber.isRemoved = !(await subscriber.handler(level, log));
                    }
                    if (subscriber.isRemoved) {
                        console.log("removing subscriber");
                        this.subscribers.delete(subscriber);
                    }
                }
            );
    }
}
