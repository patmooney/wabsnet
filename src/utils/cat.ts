import fs from "node:fs/promises";
import { toAnsii } from "terminal-art";
import path from "node:path";

export const catFile = async (fileName: string) => {
    const path = getPath(fileName);
    const content = await fs.readFile(path);
    return content.toString();
}

export const catImage = async (fileName: string,  maxCharWidth = 100) => {
    const path = getPath(fileName);
    return toAnsii(path, { maxCharWidth });
}

export const getPath = (fileName: string) => {
    // /opt/wabsnet/resources/app.asar/dist
    if (__dirname.includes('app.asar')) {
        return path.join(__dirname, '../../../', 'content', fileName);
    }
    return path.join(__dirname, '../../', 'content', fileName);
}
