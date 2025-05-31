import { faker } from '@faker-js/faker';
import { Role } from '../types/auth';

export const generateRandomUser = () => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roles: [Role.ROLE_CLIENT, Role.ROLE_ADMIN]
  };
};