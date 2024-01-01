const maxNum = 65535;
const sections = 8;

console.log(
    new Array(8).fill(null).map(() => Math.round(Math.random() * 65535).toString(16)).join(":")
);
