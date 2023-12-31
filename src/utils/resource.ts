import { catFile } from "./cat"

export const loadResouce = async <T>(path: string): Promise<T> => {
    const data = await catFile(path);
    return data as T;
};

export const loadJSON = async <T>(path: string): Promise<T> => {
    const data = await loadResouce<string>(path);
    return JSON.parse(data) as T;
};

