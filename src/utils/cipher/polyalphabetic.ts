import { ICipherOutput } from ".";
import { shuffle } from "../array";

export const cipher = (text: string, encoding?: ICipherOutput["encoding"]): ICipherOutput => {
    // random encoding
    encoding = encoding ?? ["base64", "hex"][Math.round(Math.random())] as ICipherOutput["encoding"];

};
// http://www.crypto-it.net/eng/simple/polyalphabetic-substitution-ciphers.html
const generateRules = () => {
    const ascii = new Array(94).fill(null).map((_, idx) => String.fromCharCode(idx + 32));
    const iterations = 3;
    const iterArrs = new Array(iterations).fill(null).map(() => shuffle([...ascii]));
    // may need to escape some characters here...
    return ascii.map(
        (c, idx) => `${c}=${iterArrs.map(a => a[idx]).join("")}`
    ).join(';');
};
