import fs from "node:fs/promises";
import { toAnsii } from "terminal-art";

const pause = (ms = 100) =>
    new Promise(res => setTimeout(res, ms));

export const catFile = async (fileName: string, isInteractive = false) => {
    const path = `./src/core/content/${fileName}`;
    const content = await fs.readFile(path);
    return cat(content.toString(), isInteractive);
}

export const cat = async (content: string, isInteractive = false) => {
    if (isInteractive) {
        const lines = content.split("\n");
        for (let line of lines) {
            await pause();
            console.log(line);
        }
        return;
    }
    console.log("\n\n" + content + "\n\n");
}

export const catImage = async (fileName: string, isInteractive = false, maxCharWidth = 100) => {
    const path = `./src/core/content/${fileName}`;
    const ansii = await toAnsii(path, { maxCharWidth });
    return cat(ansii, isInteractive);
}
