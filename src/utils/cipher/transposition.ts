import { ICipherOutput, encodingType, randomEncoding } from ".";
import { CipherFn } from "../../managers/cipher";

// printable ascii range: 32 - 126
// therefor max print range = 32 + 94

export const cipher: CipherFn = (text: string, encoding?: encodingType, offset?: number): ICipherOutput => {
    // random encoding
    encoding = encoding ?? randomEncoding();
    // clamp given or random number betwen 1 and 127
    let clampedOffset: number = Math.max(1, Math.min(94, offset ?? Math.round(Math.random() * 94)));

    // offset of 63 would just push lower case chars to upper case
    if (clampedOffset === 63) {
        clampedOffset++;
    }

    return {
        cipher: "transposition",
        cipherOpts: Buffer.from(`offset=${clampedOffset};min=32;max=126;charset=ascii`).toString(encoding),
        encoding,
        digest: Buffer.from(
            text.split("").map(
                ch => ch.charCodeAt(0)
            ).map(
                code => {
                    code += clampedOffset;
                    return String.fromCharCode(code > 126 ? (code - 127) + 32 : code);
                }
            ).join("")
        ).toString(encoding)
    };
}
