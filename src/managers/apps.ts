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
    isInstalled?: boolean;
}

export class AppsManager {
    private appMap: Map<string, IApp>;

    public constructor() {
        this.appMap = new Map<string, IApp>();
    }

    public addApp(app: IApp): void {
        this.appMap.set(app.name, app);
    }

    public installApp(appName: string): void {
        const app = this.appMap.get(appName);
        if (!app) {
            throw new Error(`${appName} not found`);
        }
        app.isInstalled = true;
    }

    public removeApp(appName: string): void {
        const app = this.appMap.get(appName);
        if (!app) {
            throw new Error(`${appName} not found`);
        }
        app.isInstalled = false;
    }

    public async execApp(appName: string, data: IData, emitter: EventEmitter): Promise<void> {
        try {
            const app = this.appMap.get(appName);
            if (!app || !app.isInstalled) {
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

    public listInstalled(): IApp[] {
        return this.listApps().filter(app => app.isInstalled);
    }

    public listAvailable(): IApp[] {
        return this.listApps().filter(app => !app.isInstalled && app.isIndexed);
    }
}

