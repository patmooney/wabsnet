import { IApp, IData } from "../../managers/apps";
import { CommandExecFn, CommandManager } from "../../managers/commands";
import { networkManager } from "../../core";
import { IFileContent } from "../content/types";
const fileData = require("../content/apps/file/list.json") as IFileContent;

const list: CommandExecFn = (data: IData) => {
    const { remoteIp, token } = data.options;
    if (!remoteIp || !token) {
        throw new Error("remoteIp and token is required");
    }
    if (!networkManager.validateToken(remoteIp, token)) {
        throw new Error("Inavlid token");
    }
    return fileData[remoteIp]?.list ?? [];
};

const copy: CommandExecFn = (data: IData) => {
    const { remoteIp, token, fileName } = data.options;

    if (!remoteIp || !token || !fileName) {
        throw new Error("remoteIp, token and fileName is required");
    }
    if (!networkManager.validateToken(remoteIp, token)) {
        throw new Error("Inavlid token");
    }
    const content = fileData[remoteIp]?.content[fileName];
    if (!content) {
        throw new Error(`File ${fileName} not found`);
    }
    return content;
}

const fileCommands = new CommandManager();
fileCommands.registerCommand("list", list);
fileCommands.registerCommand("copy", copy);

export const app: IApp = {
    name: "file",
    label: "File",
    description: "Remote file actions",
    isIndexed: true,
    commands: fileCommands
};
