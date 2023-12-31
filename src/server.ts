import net from "node:net";
import fs from "node:fs";
import { appsManager } from "./core";
import EventEmitter from "node:events";
import xpipe from "xpipe";
import { catImage } from "./utils/cat";
import chalk from "chalk";

// apps should be given an even emitter

const parseData = (data: string) => {
    const options = data.match(/{.*}/)?.at(0);
    const commands = data.replace(/ {.*}/, "").split(" ").map(command => command.trim());
    return { commands, options: options ? JSON.parse(options) : {} };
};

const sock = xpipe.eq("/tmp/wabsnet");

async function run() {
    const logo = await catImage("logo.png", 60);
    console.log("\n\n");
    console.log(logo);
    console.log(chalk.green.bold("\n\n                    WABSNET v.1.933"));
    console.log("\n\n");

    const server = net.createServer({ keepAlive: true }, (c) => {
        const emitter = new EventEmitter();
        console.log("client connected");
        c.on("end", () => {
            console.log("client disconnected");
            emitter.emit("close");
            c.end();
        });
        c.on("data", async (d) => {
            const data = parseData(d.toString().trim());
            emitter.on("msg", (text) => c.write(JSON.stringify([null, Buffer.from(text).toString("base64")])));
            emitter.on("end", () => c.end());
            emitter.on("error", (err) => c.write(JSON.stringify([err, null])));
            const app = data.commands.shift();
            if (!app) {
                emitter.emit("error", "Command not recognised");
                emitter.emit("end");
                return;
            }
            appsManager.execApp(app, data, emitter);
        });
    });

    server.on('error', function (e: NodeJS.ErrnoException) {
        if (e.code == 'EADDRINUSE') {
            var clientSocket = new net.Socket();
            clientSocket.on('error', function(e: NodeJS.ErrnoException) { // handle error trying to talk to server
                if (e.code == 'ECONNREFUSED') {  // No other server listening
                    fs.unlinkSync(sock);
                    server.listen(sock, function() { //'listening' listener
                        console.log('server recovered');
                    });
                }
            });
            clientSocket.connect({path: sock}, function() {
                console.log('Server running, giving up...');
                process.exit();
            });
        }
    });

    server.listen(sock, () => {
        console.log(`listening to ${sock}`);
    });
    process.on("beforeExit", () => server.close());
}

run();

