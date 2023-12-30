import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";

export const app: IApp = {
    name: "help",
    label: "Help",
    isIndexed: false,
    exec: async (emitter: EventEmitter) => {
        emitter.emit("msg", JSON.stringify({ help: await catFile("apps/help/help.txt") }));
        emitter.emit("end");
    }
};
