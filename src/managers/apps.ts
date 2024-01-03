import EventEmitter from "node:events";
import { AppNotFoundError } from "../errors";
import { CommandManager } from "./commands";
import { achievementManager, emailManager, eventManager, logManager, networkManager, notificationManager } from "../core";
import { setup } from "../setup";

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

    reset() {
        Array.from(this.appMap.values() ?? []).forEach(
            (app) => app.isInstalled = false
        );
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

    public resetGame() {
        this.reset();
        emailManager.reset();
        eventManager.reset();
        networkManager.reset();
        achievementManager.reset();
        notificationManager.reset();
        setup();
    }

    public async execApp(appName: string, data: IData, emitter: EventEmitter): Promise<void> {
        try {
            if (appName === "reset") {
                this.resetGame();
                emitter.emit("msg", JSON.stringify({ result: true }));
                emitter.emit("end");
                return;
            }
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
        } catch (e) {
            logManager.stack(e as Error);
            emitter.emit("error", (e as Error).message);
            emitter.emit("end");
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

