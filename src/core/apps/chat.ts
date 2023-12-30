import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";
import { pause } from "../../utils/pause";
import { networkManager } from "../../core";
import { parseArgs } from "../../utils/parse-args";
const chatData = require("../content/apps/chat/chat.json");

const CHAT_MESSAGE_DELAY = 5000;

interface IChatContact {
    name: string;
    username: string;
    remoteIp: string;
}

const search = async (emitter: EventEmitter, argv: string[]) => {
    const options = parseArgs<{
        username?: string;
        name?: string;
        remoteIp?: string;
    }>(argv);
    const matches = (chatData.contacts as IChatContact[]).filter(
        (contact) => {
            return options.username ? contact.username === options.username : true
                && options.name ? contact.name === options.name : true
                && options.remoteIp ? contact.remoteIp === options.remoteIp : true;
        }
    );
    emitter.emit("msg", JSON.stringify(matches));
};

const chat = async (emitter: EventEmitter, argv: string[]) => {
    const options = parseArgs<{
        username?: string;
    }>(argv);
    if (!options.username) {
        throw new Error(`username is required`);
    }
    const contact = (chatData.contacts as IChatContact[]).find(
        (contact) => contact.username === options.username
    );
    if (!contact) {
        throw new Error (`user ${options.username} not found`);
    }
    networkManager.addActive("chat", contact.remoteIp);
    for (let d of chatData.threads["oljohnnyfranco"]) {
        emitter.emit("msg", JSON.stringify(d));
        await pause(CHAT_MESSAGE_DELAY);
    }
    networkManager.removeActive("chat", contact.remoteIp);
}

const chatCommands = new CommandManager();
chatCommands.registerCommand("search", search);
chatCommands.registerCommand("chat", chat);

export const app: IApp = {
    name: "chat",
    isIndexed: true,
    label: "WeChat",
    description: "Distributed direct messaging",
    exec: async (emitter: EventEmitter, [subCommand, ...argv]: string[]) => {
        await chatCommands.exec(subCommand, argv, emitter);
        emitter.emit("end");
    }
};
