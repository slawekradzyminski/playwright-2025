import { RegisterDto } from "../types/auth";
import { faker } from '@faker-js/faker';

const generateMinLength = (generator: () => string, minLength: number): string => {
    let value = '';

    for (let i = 0; i < 20; i++) {
        value = generator();
        if (value.length >= minLength) {
            return value;
        }
    }

    // fallback – if failed to draw valid one add 'A's to meet the length requirement
    return value.padEnd(minLength, 'A');
};

export const generateUser = (): RegisterDto => {
    return {
        username: generateMinLength(() => faker.internet.username(), 4),
        password: faker.internet.password({ length: 8 }),
        email: faker.internet.email(),
        firstName: generateMinLength(() => faker.person.firstName(), 4),
        lastName: generateMinLength(() => faker.person.lastName(), 4)
    };
};