import EventEmitter from "node:events";
import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";

export const app: IApp = {
    name: "news",
    label: "The News",
    description: "Access daily news articles",
    isIndexed: true,
    exec: async (emitter: EventEmitter) => {
        emitter.emit("msg", JSON.stringify({ news: await catFile("apps/news/article.txt") }));
        emitter.emit("end");
    }
};
