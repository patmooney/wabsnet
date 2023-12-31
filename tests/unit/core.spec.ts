import { eventManager, execPeriodicActions, haltLoop, networkManager, startLoop } from "../../src/core";

jest.mock("../../src/managers/apps", () => ({
    AppsManager: jest.fn().mockImplementation(
        () => ({
            addApp: jest.fn(),
        })
    )
}));

jest.mock("../../src/managers/events", () => ({
    EventManager: jest.fn().mockImplementation(
        () => ({
            loadEvents: jest.fn(),
            saveEvents: jest.fn()
        })
    )
}));

jest.mock("../../src/managers/network", () => ({
    NetworkManager: jest.fn().mockImplementation(
        () => ({
            prune: jest.fn()
        })
    )
}));

describe("core", () => {
    describe("execPeriodicActions", () => {
        it ("should carry out period actions", async () => {
            await execPeriodicActions();
            expect(eventManager.saveEvents).toHaveBeenCalled();
            expect(networkManager.prune).toHaveBeenCalled();
        });
    });

    describe("startLoop", () => {
        it ("should start and stop", async () => {
            startLoop();
            await haltLoop();
            expect(eventManager.saveEvents).toHaveBeenCalled();
            expect(networkManager.prune).toHaveBeenCalled();
        });
    });
});
