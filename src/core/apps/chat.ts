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
const chatCommands = new CommandManager();

const help = `chat

Basic private messaging tool

Usage: chat chat { "username": "example-user" }

Commands:

    search    Use filters to find details of matching users.
    chat      Initiate a private messaging session with the given user.
`;

const search = async (data: IData) => {
    const { username, realName, remoteIp } = data.options;
    const matches = contacts.filter(
        (contact) => {
            return username ? contact.username === username : true
                && realName ? contact.realName === realName : true
                && remoteIp ? contact.remoteIp === remoteIp : true;
        }
    );
    return matches;
};

async function* chat (data:IData) {
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
    try {
        networkManager.addActive("chat", contact.remoteIp);
        const threads = chats[username] ?? chats["*"];
        for (let d of threads) {
            yield d;
            await pause(CHAT_MESSAGE_DELAY);
        }
    } finally {
        networkManager.removeActive("chat", contact.remoteIp);
    }
}

export const app: IApp = {
    name: "chat",
    isIndexed: true,
    label: "WeChat",
    description: "Distributed direct messaging",
    commands: chatCommands,
    help
};

/** COMMAND REGISTRATION + HELP */

chatCommands.registerCommand(
    "search",
    search,
    `chat search

Use filters to find details of matching users.

Usage: chat search [args?]

Args:

    username    String, optional.
    realName    String, optional.
    remoteIp    String, optional.
`);

chatCommands.registerCommand(
    "chat",
    chat,
    `chat chat

Initiate a private chat session with the given username

Usage: chat chat {"username": "example"}

Args:

    username    String, required.
`);
