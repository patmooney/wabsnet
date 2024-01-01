import net, { Socket } from "node:net";
import fs from "node:fs";
import xpipe from "xpipe";
import { catImage } from "./utils/cat";
import chalk from "chalk";
import { handler, setupEmitter } from "./server/request-handler";
import { haltLoop, startLoop, logManager } from "./core";
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
        const emitter = setupEmitter(c);
        logManager.debug("client connected");
        c.on("end", () => {
            logManager.debug("client disconnected");
            emitter.emit("close");
            c.end();
        });
        c.on("data", async (d) => {
            handler(emitter, d);
        });
    });

    server.on('error', function (e: NodeJS.ErrnoException) {
        if (e.code == 'EADDRINUSE') {
            var clientSocket = new net.Socket();
            clientSocket.on('error', function(e: NodeJS.ErrnoException) { // handle error trying to talk to server
                if (e.code == 'ECONNREFUSED') {  // No other server listening
                    fs.unlinkSync(sock);
                    server.listen(sock, function() { //'listening' listener
                        logManager.debug('server recovered');
                    });
                }
            });
            clientSocket.connect({path: sock}, function() {
                logManager.fatal('Server running, giving up...');
                process.exit();
            });
        }
    });

    server.listen(sock, () => {
        logManager.info(`listening to ${sock}`);
    });

    onExit(() => {
        server.close();
        haltLoop().then(() => process.exit(0));
        return true;
    });
}

run();

