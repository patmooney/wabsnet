import { appsManager, eventManager } from "../../../../src/core";
import { list, install } from "../../../../src/core/apps/apps";
import { EventType } from "../../../../src/managers/events";

jest.mock("../../../../src/core", () => ({
    appsManager: {
        listAvailable: jest.fn(),
        listInstalled: jest.fn()
    },
    eventManager: {
        createEvent: jest.fn(),
        triggerEvent: jest.fn()
    }
}));

describe("core/apps/apps", () => {
    describe("list", () => {
        it("should list apps", () => {
            (appsManager.listAvailable as jest.Mock).mockReturnValue([{
                name: "test",
                description: "test description",
                label: "Test",
                hidden: "property"
            }]);
            expect(list({} as any)).toEqual([{
                name: "test",
                description: "test description",
                label: "Test"
            }]);
        });
    });

    describe("install", () => {
        it("should fail if args aren't provided", () => {
            expect(() => install({ commands: [], options: {} })).toThrow(/appName is required/);
        });
        it("should throw if app already installed", () => {
            (appsManager.listInstalled as jest.Mock).mockReturnValue([{
                name: "the-app-name",
                description: "test description",
                label: "Test"
            }]);
            expect(() => install({ commands: [], options: { appName: "the-app-name" } })).toThrow(/the-app-name already installed/);
        });
        it("should install an app", () => {
            (appsManager.listInstalled as jest.Mock).mockReturnValue([]);
            (eventManager.createEvent as jest.Mock).mockReturnValue("the-event");
            expect(install({ commands: [], options: { appName: "the-app-name" } })).toEqual("the-app-name installed");
            expect(eventManager.createEvent).toHaveBeenCalledWith({
                type: EventType.app_installed,
                content: { appName: "the-app-name" }
            });
            expect(eventManager.triggerEvent).toHaveBeenCalledWith("the-event");
        });
    });
});
