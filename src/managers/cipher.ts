import { ICipherOutput, encodingType } from "../utils/cipher"

export type CipherFn = (text: string, enc?: encodingType, ...args: any[]) => Promise<ICipherOutput> | ICipherOutput;

export class CipherManager {
    private ciphers: CipherFn[];

    constructor(ciphers: CipherFn[]) {
        this.ciphers = ciphers;
    }

    public digest (key: string, iteration = 0) {
        const cipher = this.ciphers[Math.floor(Math.random() * (this.ciphers.length - 0.01))];
    }
}
