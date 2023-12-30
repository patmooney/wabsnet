import EventEmitter from "node:events";
import { IApp, IData } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";
import { pause } from "../../utils/pause";
import { networkManager } from "../../core";
import type { IChatThread, IContact } from "../content/types";

import chatData from "../content/apps/chat/threads.json";
import contactData from "../content/apps/chat/contact.json";
const chats: { [key: string]: IChatThread[] } = chatData;
const contacts: IContact[] = contactData;

const CHAT_MESSAGE_DELAY = 5000;

const search = async (emitter: EventEmitter, data: IData) => {
    const { username, realName, remoteIp } = data.options;
    const matches = contacts.filter(
        (contact) => {
            return username ? contact.username === username : true
                && realName ? contact.realName === realName : true
                && remoteIp ? contact.remoteIp === remoteIp : true;
        }
    );
    emitter.emit("msg", JSON.stringify(matches));
};

const chat = async (emitter: EventEmitter, data: IData) => {
    const { username } = data.options;
    if (!username) {
        throw new Error(`username is required`);
    }
    const contact = contacts.find(
        (contact) => contact.username === username
    );
    if (!contact) {
        throw new Error (`user ${username} not found`);
    }
    networkManager.addActive("chat", contact.remoteIp);
    for (let d of chats[username]) {
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
    commands: chatCommands
};
