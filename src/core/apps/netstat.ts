import { networkManager } from "../../core";
import { IApp } from "../../managers/apps";
import { cat } from "../../utils/cat";

export const app: IApp = {
    name: "netstat",
    label: "netstat",
    description: "Network controls",
    exec: () => cat(networkManager.getActive().map(cxn => `${cxn.ip}       [${cxn.app}]`).join("\n"))
};
