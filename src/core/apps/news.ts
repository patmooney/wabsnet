import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";
import { CommandExecFn, CommandManager } from "../../managers/commands";

const exec: CommandExecFn = async (emitter: EventEmitter) => {
    emitter.emit("msg", JSON.stringify({ news: await catFile("apps/news/article.txt") }));
};

const newsCommands = new CommandManager();
newsCommands.registerCommand("default", exec);

export const app: IApp = {
    name: "news",
    label: "The News",
    description: "Access daily news articles",
    isIndexed: true,
    commands: newsCommands
};
