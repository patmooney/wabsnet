import { ICipherOutput, encodingType } from "../utils/cipher"

export type CipherFn = (text: string, enc?: encodingType, ...args: any[]) => Promise<ICipherOutput> | ICipherOutput;
