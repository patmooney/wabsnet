declare module 'terminal-art' {
    type args = {
        output?: "log";
        maxCharWidth?: number;
    }
    export const toAnsii: (path: string, opts?: args) => Promise<string>;
}
