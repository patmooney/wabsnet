import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";

export const app: IApp = {
    name: "news",
    label: "The News",
    description: "Access daily news articles",
    isIndexed: true,
    exec: () => {
        return catFile("apps/news/article.txt");
    }
};
