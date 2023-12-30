import net from "node:net";

const parts = process.argv.slice(2);
let timeoutId: NodeJS.Timeout;
const client = net.createConnection({ path: "/tmp/wabsnet" }, () => {
    const keepAlive = () => {
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => client.end(), 10000);
    };
    keepAlive();

    console.log(`Sending command > ${parts.join(" ")}`);
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
    client.write(parts.join(" "));
    client.on("end", () => { 
        client.destroy();
        process.exit();
    });
});
