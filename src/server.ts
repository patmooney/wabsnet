import net, { Socket } from "node:net";
import fs from "node:fs";
import xpipe from "xpipe";
import { catImage } from "./utils/cat";
import chalk from "chalk";
import { handler, setupEmitter } from "./server/request-handler";
import { haltLoop, startLoop, logManager, achievementManager, eventManager } from "./core";
import { onExit } from "signal-exit";
import { loadSave, setup } from "./setup";
import { AchievementsType } from "./managers/AchievementManager";
import { EventType } from "./managers/events";

const sock = xpipe.eq("/tmp/wabsnet");

export async function run() {
    console.log("\n\n");
    console.log(await catImage("logo.png", 60));
    console.log(chalk.green.bold("\n\n                    WABSNET v.1.933"));
    console.log("\n\n");

    await setup();
    await loadSave();
    startLoop();

    const server = net.createServer({ keepAlive: true }, (c: Socket) => {
        const emitter = setupEmitter(c);
        if (!achievementManager.hasAchievement(AchievementsType.firstConnection)) {
            eventManager.triggerEvent(
                eventManager.createEvent({
                    type: EventType.achievement,
                    content: {
                        achievement: AchievementsType.firstConnection,
                        date: new Date()
                    }
                })
            );
            // this is confusing as it doesn't follow the normal schema
            /*
             * catFile('intro.txt').then(
             *   text => c.write(JSON.stringify([null, text]))
             *);
             */
        }
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
        logManager.info("Assets loading...");
        logManager.info("Server setup completed.");
        logManager.info(`Listening to socket: ${sock}`);
    });

    onExit(() => {
        server.close();
        haltLoop().then(() => process.exit(0));
        return true;
    });
}
if (require.main === module) {
    run();
}
