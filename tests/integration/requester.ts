import EventEmitter from "node:events";
import net from "node:net";
import xpipe from "xpipe";

const sock = xpipe.eq("/tmp/wabsnet");

/* EventEmitter
* - error: there was an error
* - msg: send this to the remove server
* - end: end the connection
* - data: response from server
*/

export const session = (): Promise<EventEmitter> => {
    return new Promise((resolve) => {
        const emitter = new EventEmitter();
        const client = net.createConnection({ path: sock }, () => {
            client.on("data", (data: Buffer) => {
                try {
                    const [err, msg] = JSON.parse(data.toString());
                    if (err === "ping") {
                        client.write("pong");
                        return;
                    }
                    if (err) {
                        emitter.emit("error", err);
                    } else {
                        const content = Buffer.from(msg, "base64").toString();
                        try {
                            emitter.emit("data", JSON.parse(content));
                        } catch (e) {
                            emitter.emit("error", e);
                        }
                    }
                } catch (err) {
                    emitter.emit("error", err);
                }
            });

            emitter.on("end", () => setTimeout(() => client.end(), 200));
            emitter.on("msg", (data) => client.write(data));

            client.on("end", () => { 
                client.destroy();
            });
            resolve(emitter);
        });
    });
};

export const reset = async (emitters: EventEmitter[]) => {
    const [emitter] = emitters;
    if (!emitter) {
        return;
    }
    emitter.emit("msg", "reset");
    await awaitResponse(emitter);
    emitters.forEach(emitter => emitter.emit("end"));
}

export const awaitResponse = (emitter: EventEmitter): Promise<any> => {
    return new Promise((resolve, reject) => {
        emitter.once("data", (data) => {
            resolve(data);
        });
        emitter.once("error", reject);
    });
};

export const makeRequest = async (emitter: EventEmitter, request: string): Promise<any> => {
    //console.log(`SENDING: ${request}`);
    emitter.emit("msg", request);
    const out = await awaitResponse(emitter);
    //console.log("RECIEVED", out);
    return out;
};
