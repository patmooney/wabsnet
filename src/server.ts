import net from "node:net";
import fs from "node:fs";
import { appsManger } from "./core";
import EventEmitter from "node:events";

// apps should be given an even emitter

const sock = "/tmp/wabsnet";
const server = net.createServer({ keepAlive: true }, (c) => {
    const emitter = new EventEmitter();
    console.log("client connected");
    c.on("end", () => {
        console.log("client disconnected");
        emitter.emit("close");
        c.end();
    });
    c.on("data", async (d) => {
        const data = d.toString().trim();
        const [app, ...argv] = data.split(" ");
        emitter.on("msg", (text) => c.write(JSON.stringify([null, Buffer.from(text).toString("base64")])));
        emitter.on("end", () => c.end());
        emitter.on("error", (err) => c.write(JSON.stringify([err, null])));
        appsManger.execApp(app, argv, emitter);
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
