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

const netCommands = new CommandManager();
netCommands.registerCommand("scan", scan);
netCommands.registerCommand("trace", trace);

export const app: IApp = {
    name: "netstat",
    label: "netstat",
    description: "Network controls",
    isIndexed: true,
    commands: netCommands
};
