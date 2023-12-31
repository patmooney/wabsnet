import { handler, parseData } from "../../../src/server/request-handler";
import { appsManager } from "../../../src/core";

jest.mock("../../../src/core", () => {
    const appsManager = {
        execApp: jest.fn()
    };
    return { appsManager };
});

describe("server/request-handler", () => {
    describe("handler", () => {
        it("should handle throw if no app is found", async () => {
            const data = Buffer.from(``);
            const fakeEmitter = {
                on: jest.fn(),
                emit: jest.fn()
            } as any;
            const fakeSocket = {
                write: jest.fn(),
                end: jest.fn()
            } as any;
            await handler(fakeSocket, fakeEmitter, data);
            expect(fakeEmitter.emit).toHaveBeenCalledTimes(2);
            expect(fakeEmitter.emit).toHaveBeenNthCalledWith(1, "error", expect.stringMatching(/not recognised/));
            expect(fakeEmitter.emit).toHaveBeenNthCalledWith(2, "end");
        });

        it("should parse arguments", async () => {
            const data = Buffer.from(`main-command sub-command sub-command2 {"the": "args"}`);
            const fakeEmitter = {
                on: jest.fn(),
                emit: jest.fn()
            } as any;
            const fakeSocket = {
                write: jest.fn(),
                end: jest.fn()
            } as any;
            await handler(fakeSocket, fakeEmitter, data);
            expect(appsManager.execApp).toHaveBeenCalledWith(
                "main-command",
                {
                    commands: ["sub-command", "sub-command2"],
                    options: { the: "args" }
                },
                fakeEmitter
            );
            expect(fakeEmitter.emit).not.toHaveBeenCalled();
        });

        it("should handle app errors", async () => {
            const data = Buffer.from(`main-command sub-command sub-command2 {"the": "args"}`);
            const fakeEmitter = {
                on: jest.fn(),
                emit: jest.fn()
            } as any;
            const fakeSocket = {
                write: jest.fn(),
                end: jest.fn()
            } as any;
            (appsManager.execApp as jest.Mock).mockRejectedValue(new Error("bad stuff"));
            await handler(fakeSocket, fakeEmitter, data);
            expect(appsManager.execApp).toHaveBeenCalled();
            expect(fakeEmitter.emit).toHaveBeenCalledTimes(2);
            expect(fakeEmitter.emit).toHaveBeenNthCalledWith(1, "error", expect.stringMatching(/while processing/));
            expect(fakeEmitter.emit).toHaveBeenNthCalledWith(2, "end");
        });
    });

    describe("parseData", () => {
        it("should extract data", () => {
            expect(parseData(Buffer.from('command1 command2 command3 command4'))).toEqual({
                commands: ["command1", "command2", "command3", "command4"],
                options: {}
            });
            expect(parseData(Buffer.from('{"args": { "stuff": "deep" }, "arr": ["whatever"]}'))).toEqual({
                commands: [],
                options: { args: { stuff: "deep" }, arr: ["whatever"] }
            });

            expect(parseData(Buffer.from('command1 command2 command3 command4 {"args": { "stuff": "deep" }, "arr": ["whatever"]}'))).toEqual({
                commands: ["command1", "command2", "command3", "command4"],
                options: { args: { stuff: "deep" }, arr: ["whatever"] }
            });
        });
    });
});
