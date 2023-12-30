import { encodingType } from "../src/utils/cipher";
import { cipher as poly } from "../src/utils/cipher/polyalphabetic";
import { cipher as trans } from "../src/utils/cipher/transposition";
import { cipher as rail } from "../src/utils/cipher/railfence";
import { cipher as brute } from "../src/utils/cipher/brute";

const ciphers = [poly, trans, rail, brute];
//const text = "!The quick brown fox, jumps over the lazy dog :D";
const text = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOGD";
const encoding = ["utf8"];

for (let cipher of ciphers) {
    for (let enc of encoding) {
        const out = cipher(text, enc as encodingType);
        console.log(out);
    }
}
