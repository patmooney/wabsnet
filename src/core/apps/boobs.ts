import { IApp } from "../../managers/apps";
import { catImage } from "../../utils/cat";

export const app: IApp = {
    name: "boobs",
    label: "Boobs",
    description: "Pictures of Boobs",
    isIndexed: true,
    exec: () => catImage("apps/boobs/boobs.jpeg", false, 60)
}
