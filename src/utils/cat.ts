import fs from "node:fs/promises";
import { toAnsii } from "terminal-art";

export const catFile = async (fileName: string) => {
    const path = `./content/${fileName}`;
    const content = await fs.readFile(path);
    return content.toString();
}

export const catImage = async (fileName: string,  maxCharWidth = 100) => {
    const path = `./content/${fileName}`;
    return toAnsii(path, { maxCharWidth });
}
