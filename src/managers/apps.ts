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

    public execApp(appName: string, argv: string[]): Promise<void> {
        const app = this.appMap.get(appName);
        if (!app) {
            throw new AppNotFoundError(appName);
        }
        return app.exec(argv);
    }

    public listApps(): IApp[] {
        return Array.from(this.appMap.values());
    }
}

