import { test as base } from '@playwright/test';
import { RegisterDto } from '../types/auth';
import { generateUser } from '../generators/userGenerator';
import { registerClient } from '../httpclients/registerClient';
import { loginClient } from '../httpclients/loginClient';

type AuthFixtureReturn = {
    auth: {
        user: RegisterDto,
        token: string
    }
};

export const test = base.extend<AuthFixtureReturn>({
    auth: async ({ request }, use) => {
        // This block will run before each test using this fixture.
        const user = generateUser();
        await registerClient.postRegister(request, user);
        const loginResponse = await loginClient.postLogin(request, {
            username: user.username,
            password: user.password
        });
        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.token;

        // This is the actual "return" so what we inject to tests
        await use({
            user,
            token
        });

        // This is cleanup section which will run after each test (example: remove created customer)
    }
});

export { expect } from '@playwright/test';
