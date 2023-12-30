import EventEmitter from "node:events";
import { AppNotFoundError } from "../errors";
import { CommandExecFn } from "./commands";

export interface IApp {
    name: string;
    label: string;
    isIndexed: boolean;
    exec: CommandExecFn;
    description?: string;
}

export class AppsManager {
    private appMap: Map<string, IApp>;

    public constructor() {
        this.appMap = new Map<string, IApp>();
    }

    public addApp(appName: string, app: IApp): void {
        this.appMap.set(appName, app);
    }

    public async execApp(appName: string, argv: string[], emitter: EventEmitter): Promise<void> {
        try {
            const app = this.appMap.get(appName);
            if (!app) {
                throw new AppNotFoundError(appName);
            }
            const result = await app.exec(emitter, argv);
            return result;
        } catch (e) {
            console.error(e);
            emitter.emit("error", (e as Error).message);
        }
    }

    public listApps(): IApp[] {
        return Array.from(this.appMap.values());
    }
}

