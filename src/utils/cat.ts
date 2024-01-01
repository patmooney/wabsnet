import fs from "node:fs/promises";
import { toAnsii } from "terminal-art";

export const catFile = async (fileName: string) => {
    const path = `./src/core/content/${fileName}`;
    const content = await fs.readFile(path);
    return content.toString();
}

export const catImage = async (fileName: string,  maxCharWidth = 100) => {
    const path = `./src/core/content/${fileName}`;
    return toAnsii(path, { maxCharWidth });
}
