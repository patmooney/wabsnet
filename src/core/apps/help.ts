import { IApp } from "../../managers/apps";
import { catFile } from "../../utils/cat";

export const app: IApp = {
    name: "help",
    label: "Help",
    isIndexed: false,
    exec: () => {
        return catFile("apps/help/help.txt");
    }
};
