import { appsManger } from "./core";
import { toAnsii } from "terminal-art";

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import chalk from "chalk";

let _isInteractive = false;
export const isInteractive = () => _isInteractive;

async function run () {
    const argv = process.argv.slice(2);
    if (argv.length) {
        await exec(argv);
        return;
    }

    _isInteractive = true;
    const rl = readline.createInterface({ input, output });
    const logo = await toAnsii("./src/core/content/logo.png", { maxCharWidth: 60 });
    console.log("\n\n");
    console.log(logo);
    console.log(chalk.green.bold("\n\n                        WABSNET v.1.933"));
    console.log("\n\n");
    console.log("Please enter command...");
    while (true) {
        const out = await rl.question('> ');
        if (!out) {
            continue;
        }
        if (/^exit/i.test(out)) {
            break;
        }
        const argv = out.split(" ");
        try {
            await exec(argv);
        } catch (err) {
            console.error((err as Error).message);
        }
    }
    console.log('Shut down...');
    rl.close();
}

function exec ([appName, ...argv]: string[]) {
    return appsManger.execApp(appName, argv);
}

run();
