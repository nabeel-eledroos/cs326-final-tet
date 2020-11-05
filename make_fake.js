/**
 * Generates fake user data. Change "userCount" to change the number of users
 * you want information generated for.
 */

const faker = require('faker');

const data = [];
const userCount = 100;

for(let i = 0; i < userCount; ++i) {
    const user = {
        email: faker.internet.email(),
        password: faker.internet.password()
    };
    data.push(user);
}

console.dir(data);