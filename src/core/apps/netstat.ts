import { businessManager, networkManager } from "../../core";
import { IApp, IData } from "../../managers/apps";
import { CommandManager } from "../../managers/commands";
import { pause } from "../../utils/pause";

import { cipher as trans } from "../../utils/cipher/transposition";
import { cipher as poly } from "../../utils/cipher/polyalphabetic";
import { cipher as rail } from "../../utils/cipher/railfence";
import { cipher as brute } from "../../utils/cipher/brute";
import { cycle } from "../../utils/array";
import { CipherFn } from "../../managers/cipher";

const netCommands = new CommandManager();

const help = `netstat

Networking tools.

Usage: netstat [command] [args?]

Commands:

    scan     List of current active connections by application.
    trace    Display raw traffic by given remote-ip.
`;

const scan = (data: IData) => {
    const { proxyHost } = data.options;
    if (proxyHost) {
        businessManager.generateCustomers(proxyHost);
    }
    return networkManager.getActive(proxyHost);
};

async function* trace (data: IData) {
    const { remoteHost, proxyHost } = data.options;
    if (!remoteHost) {
        throw new Error("remoteHost is required");
    }
    let i = 0;
    const ciphers = [trans, poly, rail, brute];
    while (networkManager.getCxn(undefined, remoteHost, proxyHost)) {
        let activeToken = networkManager.getActiveAccessTokens(remoteHost).at(0);
        if (!activeToken) {
            activeToken = networkManager.addAccess(remoteHost);
        }
        const chunkSize = Math.ceil(activeToken.token.length / 8);
        const chunks = activeToken.token.match(new RegExp(`.{1,${chunkSize}}`, 'g'));
        if (!chunks) {
            throw new Error("Unable to divide token to chunks");
        }
        i = i === (chunks.length - 1) ? 0 : i + 1;
        const cipher = cycle<CipherFn>(ciphers);
        const packet = await cipher(chunks[i]);
        if (true) {
            packet.token = activeToken.token;
        }
        yield packet;
        await pause(200);
    }

    if (!networkManager.getCxn(undefined, remoteHost)) {
        throw new Error("Lost connection with host");
    }
};


export const app: IApp = {
    name: "netstat",
    label: "netstat",
    description: "Network controls",
    isIndexed: true,
    commands: netCommands,
    help
};

/** COMMAND REGISTRATION + HELP **/

netCommands.registerCommand(
    "scan", scan,
    `netstat scan

List of current active connections by application.

Usage: netstat scan
`);

netCommands.registerCommand(
    "trace", trace,
    `netstat trace

Display raw traffic by given remote-ip.

Usage: netstat trace {"remoteHost": "abcd:abcd:abcd:acbd:acbd:acbd:acbd:abcd"}

Args:

    remoteHost    String, required. Display packet data for this IPv6/Domain.
`);
