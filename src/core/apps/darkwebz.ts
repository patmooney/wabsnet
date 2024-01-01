import { IApp } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";

const commands = new CommandManager();

export const app: IApp = {
    name: "darkwebz",
    label: "D4rkW3bz",
    description: "",
    help: `connect [address]`,
    commands,
    isIndexed: false
};
