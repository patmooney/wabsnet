import { ICipherOutput, encodingType } from ".";
import { createCipheriv } from "node:crypto";
import { CipherFn } from "../../managers/cipher";

const characters = "abcdefghijklmnopqrstuvwxyz1234567890";

export const cipher: CipherFn = async (text: string, encoding?: encodingType, missingKeyLength = 3): Promise<ICipherOutput> => {
    encoding = "hex";

    const key = generateKey(16);
    const watchPhrase = generateKey(64);
    const iv = Buffer.from(generateKey(16));
    const crypt = createCipheriv("aes-128-cbc", Buffer.from(key), iv);

    return {
        cipher: "brute-aes",
        cipherOpts: `algorithm=aes-128-cbc;keyLength=32;keyPrefix=${key.slice(0, 32 - missingKeyLength)};watchPhrase=${watchPhrase};characterSet=${characters};iv=${iv};`,
        encoding,
        digest: Buffer.concat([crypt.update(watchPhrase + text), crypt.final()]).toString(encoding)
    };
};

const generateKey = (length: number): string => {
    return new Array(length).fill(null)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("");
};
