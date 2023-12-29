
type Extends<T, U extends T> = U;
export type encodingType = Extends<BufferEncoding, "utf8" | "base64" | "hex">;
export const encodingTypeArray: Array<encodingType> = ["utf8", "base64", "hex"];
export const randomEncoding = () => encodingTypeArray[Math.round(Math.random() * (encodingTypeArray.length-0.5))] as encodingType;

export interface ICipherOutput {
    cipher: string;
    cipherOpts?: string;
    encoding: encodingType;
    digest: string;
}
