import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { catImage } from "../../utils/cat";

export const app: IApp = {
    name: "boobs",
    label: "Boobs",
    description: "Pictures of Boobs",
    isIndexed: true,
    exec: async (emitter: EventEmitter) => {
        emitter.emit("msg", JSON.stringify(({ image: await catImage("apps/boobs/boobs.jpeg", 60) })));
        emitter.emit("end");
    }
}
