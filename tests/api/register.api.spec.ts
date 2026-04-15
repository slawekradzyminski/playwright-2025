import { test, expect, APIResponse } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import { registerClient } from '../../httpclients/registerClient';

test.describe('/api/v1/users/signin API tests', () => {
    test('should successfully register new user - 201', async ({ request }) => {
        // given
        const randomUser = generateUser();

        // when
        const response = await registerClient.postRegister(request, randomUser);

        // then
        expect(response.status()).toBe(201);
    });


    test('should return username already exists error - 400', async ({ request }) => {
        // given
        const randomUser = generateUser();
        await registerClient.postRegister(request, randomUser);

        // when
        const response = await registerClient.postRegister(request, randomUser);

        // then
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Username is already in use');
    });

    test('should trigger validation errors for length constraints - 400', async ({ request }) => {
        // given
        const user = {
            ...generateUser(),
            username: 'abc',
            password: 'abc'
        }

        // when
        const response = await registerClient.postRegister(request, user);

        // then
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject({
           username: 'Minimum username length: 4 characters',
           password: 'Minimum password length: 8 characters',
        });
    });

    test('should trigger validation error for invalid email - 400', async ({ request }) => {
        // given
        const user = {
            ...generateUser(),
            email: 'invalidemail'
        }

        // when
        const response = await registerClient.postRegister(request, user);

        // then
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.email).toBe('Email should be valid');
    });
}); 
