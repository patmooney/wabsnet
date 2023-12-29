// http://www.crypto-it.net/eng/simple/rail-fence-cipher.html

import { ICipherOutput, encodingType, randomEncoding } from ".";

export const cipher = (text: string, encoding?: encodingType): ICipherOutput => {
    encoding = encoding ?? randomEncoding();
    const key = Math.round(Math.random() * 10) + 3;
    const rails: string[][] = [];
    let railIdx = 0;
    let dir: 1 | -1 = 1;
    text.split("").forEach(
        (c) => {
            rails[railIdx] = (rails[railIdx] ?? []).concat([c]);
            railIdx += dir;
            if (railIdx > (key - 1)) {
                dir = -1;
                railIdx = key - 2;
            } else if (railIdx < 0) {
                dir = 1;
                railIdx = 1;
            }
        }
    );
    return {
        cipher: "railfence",
        cipherOpts: Buffer.from(`key=${key}`).toString(encoding),
        encoding,
        digest: Buffer.from(rails.flatMap(r => r).join("")).toString(encoding)
    };
};
