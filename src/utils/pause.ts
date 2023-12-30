export const pause = (ms = 100) =>
    new Promise(res => setTimeout(res, ms));
