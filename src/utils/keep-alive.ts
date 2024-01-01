import EventEmitter from "node:events";
export const keepAlive = (emitter: EventEmitter, ms = 2000) => {
    let connected = true;
    emitter.on("close", () => connected = false);
    const ping = () => {
        if (connected) {
            emitter.emit("ping");
        }
        setTimeout(ping, ms);
    };
}
