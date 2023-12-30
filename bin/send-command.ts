import net from "node:net";
import { parseArgs } from "../src/utils/parse-args";
import xpipe from "xpipe";

const sock = xpipe.eq("/tmp/wabsnet");
const parts = process.argv.slice(2);
let timeoutId: NodeJS.Timeout;
const client = net.createConnection({ path: sock }, () => {
    const keepAlive = () => {
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => client.end(), 10000);
    };
    keepAlive();

    const args = parseArgs(parts.filter(part => /^--/.test(part)));
    const commands = parts.filter(part => /^[^-]/.test(part));
    const data = [...commands, JSON.stringify(args)].filter(Boolean).join(" ");

    console.log(`Sending command > ${data}`);
    client.on("data", (data: Buffer) => {
        keepAlive();
        const [err, msg] = JSON.parse(data.toString());
        if (err) {
            console.error(`ERROR: ${err}`);
            client.end();
        } else {
            const content = Buffer.from(msg, "base64").toString();
            console.log(content);
        }
    });
    client.write(data);
    client.on("end", () => { 
        client.destroy();
        process.exit();
    });
});
