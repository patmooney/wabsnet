import { IApp, IData } from "../../managers/apps";
import { CommandExecFn, CommandManager } from "../../managers/commands";
import { networkManager } from "../../core";
import { IFileContent } from "../content-types";
import { loadJSON } from "../../utils/resource";

const files = loadJSON<IFileContent>("apps/file/list.json");
const fileCommands = new CommandManager();

const help = `file

Remote file tools

Commands:

    list    List files on the remote device.
    copy    Retrieve the contents of a remote file.
`;

const list: CommandExecFn = async (data: IData) => {
    const { remoteHost, token } = data.options;
    if (!remoteHost || !token) {
        throw new Error("remoteHost and token is required");
    }
    if (!networkManager.validateToken(remoteHost, token)) {
        throw new Error("Inavlid token");
    }
    return (await files)[remoteHost]?.list ?? [];
};

const copy: CommandExecFn = async (data: IData) => {
    const { remoteHost, token, fileName } = data.options;

    if (!remoteHost || !token || !fileName) {
        throw new Error("remoteHost, token and fileName is required");
    }
    if (!networkManager.validateToken(remoteHost, token)) {
        throw new Error("Inavlid token");
    }
    const content = (await files)[remoteHost]?.content[fileName];
    if (!content) {
        throw new Error(`File ${fileName} not found`);
    }
    return content;
}

export const app: IApp = {
    name: "file",
    label: "File",
    description: "Remote file actions",
    isIndexed: true,
    commands: fileCommands,
    help
};

/** COMMAND REGISTRATION + HELP **/

fileCommands.registerCommand(
    "list", list,
    `file list

List files on the remove device

Usage: file list {"remoteHost": "abcd:abcd:abcd:abcd:abcd:abcd:abcd:abcd", "token": "example-token"}

Args:

    remoteHost    String, required. IPv6/Domain for remote device.
    token         String, required. Authentication token for remote device.
`);

fileCommands.registerCommand(
    "copy", copy,
    `file copy

Retrieve the contents of a remote file.

Usage: file copy {"remoteHost": "abcd:abcd:abcd:abcd:abcd:abcd:abcd:abcd", "token": "example-token", "fileName": "the-file-name.txt"}

Args:

    remoteHost    String, required. IPv6/Domain for remote device.
    token         String, required. Authentication token for remote device.
    fileName      String, required. Name of file from which to retrieve contents.
`);


