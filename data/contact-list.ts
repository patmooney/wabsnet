import { faker } from "@faker-js/faker";
import type { IContactList } from "../src/core/content/types";

const count = parseInt(process.argv[2] ?? "10", 10);

const contacts = new Array(count).fill(null).map<IContactList>(() => ({
    username: faker.internet.userName(),
    details: faker.person.jobDescriptor(),
    notes: faker.lorem.sentence(Math.floor(Math.random() * 20)),
    date: faker.date.anytime(),
    name: Math.floor(Math.random() * 10) === 0 ? "" : faker.person.fullName()
}));
//console.log(contacts);
console.log(JSON.stringify(contacts));
