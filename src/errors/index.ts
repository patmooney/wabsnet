export class CommandNotFoundError extends Error {
    constructor(commandName: string) {
        super(`'${commandName}' is not recognised`);
    }
}

export class SubCommandNotSuppliedError extends Error {};

export class AppNotFoundError extends Error {
    constructor(appName: string) {
        super(`'${appName}' is not installed`);
    }
}
