import net, { Socket } from "node:net";
import fs from "node:fs";
import EventEmitter from "node:events";
import xpipe from "xpipe";
import { catImage } from "./utils/cat";
import chalk from "chalk";
import { handler } from "./server/request-handler";
import { haltLoop, startLoop } from "./core";
import { onExit } from "signal-exit";
import { setup } from "./setup";

const sock = xpipe.eq("/tmp/wabsnet");

async function run() {
    console.log("\n\n");
    console.log(await catImage("logo.png", 60));
    console.log(chalk.green.bold("\n\n                    WABSNET v.1.933"));
    console.log("\n\n");

    setup();
    startLoop();

    const server = net.createServer({ keepAlive: true }, (c: Socket) => {
        const emitter = new EventEmitter();
        console.log("client connected");
        c.on("end", () => {
            console.log("client disconnected");
            emitter.emit("close");
            c.end();
        });
        c.on("data", async (d) => {
            handler(c, emitter, d);
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

    onExit(() => {
        server.close();
        haltLoop().then(() => process.exit(0));
        return true;
    });
}

run();

