import { ICipherOutput, encodingType, randomEncoding } from ".";

// printable ascii range: 32 - 126
// therefor max print range = 32 + 94

export const cipher = (text: string, offset?: number, encoding?: encodingType): ICipherOutput => {
    // random encoding
    encoding = encoding ?? randomEncoding();
    // clamp given or random number betwen 1 and 127
    const clampedOffset: number = Math.min(1, Math.max(94, offset ?? Math.round(Math.random() * 94)));

    return {
        cipher: "transposition",
        cipherOpts: `offset=${offset};min=32;max=126;charset=ascii`,
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
