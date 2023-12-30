import { ICipherOutput, encodingType, randomEncoding } from ".";
import { CipherFn } from "../../managers/cipher";
import { cycle, shuffle } from "../array";

type cipherRules = { [key: string]: { cycle: () => string, subs: string[] } };

export const cipher: CipherFn = (text: string, encoding?: encodingType): ICipherOutput => {
    // random encoding
    encoding = encoding ?? randomEncoding();
    const ascii = new Array(94).fill(null).map((_, idx) => String.fromCharCode(idx + 32)) as string[];
    const rules = generateRules(ascii);
    return {
        cipher: "polyalphabetic",
        cipherOpts: Buffer.from(`delim=\x00;` +
            ascii.map(
                (c) => `${c}=${rules[c].subs.join("")}`
            ).join("\x00")
        ).toString(encoding),
        encoding,
        digest: Buffer.from(toDigest(text, rules)).toString(encoding)
    };
};

// http://www.crypto-it.net/eng/simple/polyalphabetic-substitution-ciphers.html
const generateRules = (ascii: string[]): cipherRules => {
    const iterations = Math.round(Math.random() * 5) + 3;
    const iterArrs = new Array(iterations).fill(null).map(() => shuffle([...ascii])) as string[][];
    // may need to escape some characters here...
    return ascii.reduce<{ [key: string]: { cycle: () => string, subs: string[] } }>(
        (acc, c, idx) => {
            const iter = iterArrs.map(a => a[idx]);
            acc[c] = {
                cycle: function () {
                    return cycle(iter);
                },
                subs: [...iter]
            }
            return acc;
        }, {}
    );
};

const toDigest = (text: string, rules: cipherRules): string => {
    const chars = text.split("");
    return chars.map(
        (c) => rules[c].cycle()
    ).join("")
};
