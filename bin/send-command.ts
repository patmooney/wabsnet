import net from "node:net";
import { parseArgs } from "../src/utils/parse-args";
import xpipe from "xpipe";

const sock = xpipe.eq("/tmp/wabsnet");
const parts = process.argv.slice(2);
const client = net.createConnection({ path: sock }, () => {
    const args = parseArgs(parts.filter(part => /^--/.test(part)));
    const commands = parts.filter(part => /^[^-]/.test(part));
    const data = [...commands, JSON.stringify(args)].filter(Boolean).join(" ");

    console.log(`Sending command > ${data}`);
    client.on("data", (data: Buffer) => {
        const [err, msg] = JSON.parse(data.toString());
        if (err === "ping") {
            client.write("pong");
            return;
        }
        if (err) {
            console.error(`ERROR: ${err}`);
            client.end();
        } else {
            const content = Buffer.from(msg, "base64").toString();
            try {
                const json = JSON.parse(content);
                if (json.help) {
                    console.log(json.help);
                } else {
                    console.log(json);
                }
            } catch (e) {
                console.log(content);
            }
        }
    });
    client.write(data);
    client.on("end", () => { 
        console.log("CXN closed");
        client.destroy();
        process.exit();
    });
    client.on("timeout", () => {
        console.log("CXN timed out");
    });
});
