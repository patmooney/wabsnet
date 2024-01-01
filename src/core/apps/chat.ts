import { IApp, IData } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";
import { pause } from "../../utils/pause";
import { networkManager } from "../../core";
import type { IChatThread, IContact } from "../content-types";
import { loadJSON } from "../../utils/resource";

const chats = loadJSON<{ [key: string]: { [key: string]: IChatThread[] } }>("apps/chat/threads.json");
const contacts = loadJSON<IContact[]>("apps/chat/contact.json");

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
    const { username, realName, remoteHost } = data.options;
    const matches = (await contacts).filter(
        (contact) => {
            return username ? contact.username === username : true
                && realName ? contact.realName === realName : true
                && remoteHost ? contact.remoteHost === remoteHost : true;
        }
    );
    return matches;
};

async function* chat (data:IData) {
    const { username, subject } = data.options;
    if (!username) {
        throw new Error(`username is required`);
    }
    const contact = (await contacts).find(
        (contact) => contact.username === username
    );
    if (!contact) {
        throw new Error (`user ${username} not found`);
    }
    const threads = (await chats)[username] ?? (await chats)["*"];
    const thread = threads[subject ?? "*"]
        ?? [{"text": "I don't know anything about that.", "meta": { "isUser": false }}];
    try {
        networkManager.addActive("chat", contact.remoteHost);
        for (let d of thread) {
            yield d;
            await pause(CHAT_MESSAGE_DELAY);
        }
    } finally {
        networkManager.removeActive("chat", contact.remoteHost);
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

    username      String, optional.
    realName      String, optional.
    remoteHost    String, optional.
`);

chatCommands.registerCommand(
    "chat",
    chat,
    `chat chat

Initiate a private chat session with the given username

Usage: chat chat {"username": "example"}

Args:

    username    String, required.
    subject     String, optional. If there is something specific to talk about.
`);
