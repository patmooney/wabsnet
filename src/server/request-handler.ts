import { Socket } from "node:net";
import { appsManager, logManager } from "../core";
import EventEmitter from "node:events";

export const parseData = (raw: Buffer) => {
    const data = raw.toString().trim();
    const options = data.match(/{.*}/)?.at(0);
    const commands = data.replace(/\s?{.*}/, "").split(" ").map(command => command.trim()).filter(Boolean);
    return { commands, options: options ? JSON.parse(options) : {} };
};

export const handler = async (emitter: EventEmitter, d: Buffer) => {
    try {
        const data = parseData(d);
        const app = data.commands.shift();
        if (!app) {
            emitter.emit("error", "Command invalid or not recognised");
            emitter.emit("end");
            return;
        }
        if (app === "pong") {
            // keep-alive
            return;
        }
        logManager.info(`Executing app: ${app}. Subcommands: ${data.commands.join(", ")}. Args: ${JSON.stringify(data.options)}`);
        await appsManager.execApp(app, data, emitter);
    } catch (e) {
        emitter.emit("error", "Error while processing request");
        emitter.emit("end");
    }
}

export const setupEmitter = (c: Socket) => {
    const emitter = new EventEmitter();
    emitter.on("msg", (text) => c.write(JSON.stringify([null, Buffer.from(text).toString("base64")])));
    emitter.on("ping", () => c.write(JSON.stringify(["ping", null])));
    emitter.on("end", () => c.end());
    emitter.on("error", (err) => c.write(JSON.stringify([err, null])));
    return emitter;
}
