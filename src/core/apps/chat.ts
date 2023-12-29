import { IApp } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";
const chatData = require("../content/apps/chat/chat.json");

const search = async (argv: string[]) => {
    
}

const chatCommands = new CommandManager();
chatCommands.registerCommand("search", search);

export const app: IApp = {
    name: "chat",
    isIndexed: true,
    label: "WeChat",
    description: "Distributed direct messaging",
    exec: chatCommands
};
