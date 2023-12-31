jest.mock("../../src/managers/apps", () => jest.fn().mockImplementation(
    () => ({
        addApp: jest.fn(),
    })
));

jest.mock("../../src/managers/events", () => jest.fn().mockImplementation(
    () => ({
        loadEvents: jest.fn(),
        saveEvents: jest.fn()
    })
));

jest.mock("../../src/managers/network", () => jest.fn().mockImplementation(
    () => ({
        prune: jest.fn()
    })
));



describe("core", () => {
    describe("execPeriodicActions", () => {
        it ("should carry out period actions", () => {
            execPeriodicActions(
    });
});
