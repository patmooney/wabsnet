import { Socket } from "node:net";
import { appsManager } from "../core";
import EventEmitter from "node:events";

export const parseData = (raw: Buffer) => {
    const data = raw.toString().trim();
    const options = data.match(/{.*}/)?.at(0);
    const commands = data.replace(/\s?{.*}/, "").split(" ").map(command => command.trim()).filter(Boolean);
    return { commands, options: options ? JSON.parse(options) : {} };
};

export const handler = async (c: Socket, emitter: EventEmitter, d: Buffer) => {
    try {
        emitter.on("msg", (text) => c.write(JSON.stringify([null, Buffer.from(text).toString("base64")])));
        emitter.on("end", () => c.end());
        emitter.on("error", (err) => c.write(JSON.stringify([err, null])));
        const data = parseData(d);
        const app = data.commands.shift();
        if (!app) {
            emitter.emit("error", "Command not recognised");
            emitter.emit("end");
            return;
        }
        await appsManager.execApp(app, data, emitter);
    } catch (e) {
        emitter.emit("error", "Error while processing request");
        emitter.emit("end");
    }
}
