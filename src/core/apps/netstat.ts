import { networkManager } from "../../core";
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

const scan = () => networkManager.getActive();

async function* trace (data: IData) {
    const { remoteIp } = data.options;
    if (!remoteIp) {
        throw new Error("remoteIp is required");
    }

    let i = 0;
    const ciphers = [trans, poly, rail, brute];
    while (networkManager.getCxn(undefined, remoteIp)) {
        let activeToken = networkManager.getActiveAccessTokens(remoteIp).at(0);
        if (!activeToken) {
            activeToken = networkManager.addAccess(remoteIp);
        }
        const chunkSize = Math.ceil(activeToken.token.length / 8);
        const chunks = activeToken.token.match(new RegExp(`.{1,${chunkSize}}`, 'g'));
        if (!chunks) {
            throw new Error("Unable to divide token to chunks");
        }
        i = i === (chunks.length - 1) ? 0 : i + 1;
        const cipher = cycle<CipherFn>(ciphers);
        yield cipher(chunks[i]);
        await pause(200);
    }

    if (!networkManager.getCxn(undefined, remoteIp)) {
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

Usage: netstat trace {"remoteIp": "111.111.111.111"}

Args:

    remoteIp    String, required. Display packet data for this IP.
`);
