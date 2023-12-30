import { faker } from "@faker-js/faker";
import type { IContact } from "../src/core/content/types";

const count = parseInt(process.argv[2] ?? "10", 10);

const contacts = new Array(count).fill(null).map<IContact>(() => ({
    username: faker.internet.userName(),
    realName: faker.person.fullName(),
    remoteIp: faker.internet.ipv4()
}));

console.log(JSON.stringify(contacts));
