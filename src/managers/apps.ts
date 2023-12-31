import EventEmitter from "node:events";
import { AppNotFoundError } from "../errors";
import { CommandManager } from "./commands";

export interface IData {
    commands: string[];
    options: Record<string, any>;
}

export interface IApp {
    name: string;
    label: string;
    isIndexed: boolean;
    commands: CommandManager;
    description?: string;
    help?: string;
}

export class AppsManager {
    private appMap: Map<string, IApp>;

    public constructor() {
        this.appMap = new Map<string, IApp>();
    }

    public addApp(appName: string, app: IApp): void {
        this.appMap.set(appName, app);
    }

    public async execApp(appName: string, data: IData, emitter: EventEmitter): Promise<void> {
        try {
            const app = this.appMap.get(appName);
            if (!app) {
                throw new AppNotFoundError(appName);
            }
            const subCommand = data.commands.shift() ?? "default";
            const help = app.help ?? "No help available";
            if (subCommand === "help" || !app.commands.hasCommand(subCommand)) {
                emitter.emit("msg", JSON.stringify({ help }));
            } else {
                await app.commands.exec(subCommand, data, emitter);
            }
            emitter.emit("end");
        } catch (e) {
            console.error(e);
            emitter.emit("error", (e as Error).message);
        }
    }

    public listApps(): IApp[] {
        return Array.from(this.appMap.values());
    }
}

