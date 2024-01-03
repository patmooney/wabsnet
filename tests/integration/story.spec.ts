import { EventEmitter } from "node:events";
import { makeRequest, reset, session } from "./requester";

describe("story - integration", () => {
    let emitters: EventEmitter[] = [];
    afterEach(() => {
        reset(emitters);
        emitters = [];
    });

    it("should get help", async () => {
        emitters.push(await session());
        const data = await makeRequest(emitters[0], "help");
        expect(data).toEqual(expect.stringContaining("help"));
    });

    it("should allow you to install an app", async () => {
        emitters.push(await session());
        const data = await makeRequest(emitters[0], `apps install {"appName": "chat"}`);
        expect(data).toMatch(/installed/);
    });

    it("should allow you to scan for connections", async () => {
        const session1 = await session();
        const session2 = await session();
        emitters.push(session1, session2);
        await Promise.all([
            makeRequest(session1, `apps install {"appName": "chat"}`),
            makeRequest(session2, `apps install {"appName": "netstat"}`)
        ]);
        await makeRequest(session1, `chat chat {"username": "oljohnnyfranco"}`);
        const scan = await makeRequest(session2, "netstat scan");
        session1.emit("end");
        expect(scan).toEqual([
            {
                app: "chat",
                ip: expect.stringMatching(/^[a-f0-9]{4}:/)
            }
        ]);
    });

    it("should allow you to list files", async () => {
        const session1 = await session();
        const session2 = await session();
        emitters.push(session1, session2);
        await Promise.all([
            makeRequest(session1, `apps install {"appName": "chat"}`),
            makeRequest(session2, `apps install {"appName": "netstat"}`)
        ]);
        await makeRequest(session1, `apps install {"appName": "file"}`);
        await makeRequest(session1, `chat chat {"username": "oljohnnyfranco"}`);
        const scan = await makeRequest(session2, "netstat scan");
        const { ip } = scan?.at(0) ?? {};
        const files = await makeRequest(session2, `file list {"remoteHost":"${ip}", "token":"test"}`);
        expect(files).toEqual(expect.arrayContaining([expect.any(String)]));
        session1.emit("end");
    });

});
