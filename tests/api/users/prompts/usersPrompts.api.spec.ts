import { expect } from '@playwright/test';
import { API_BASE_URL } from '../../../../config/constants';
import {
  getChatSystemPrompt,
  getToolSystemPrompt,
  updateChatSystemPrompt,
  updateToolSystemPrompt
} from '../../../../http/userProfileClient';
import { test } from '../../../fixtures/auth.fixture';

test.describe('/users prompts API tests', () => {
  test('should return chat system prompt for authenticated user - 200', async ({
    request,
    clientAuth
  }) => {
    // given
    // when
    const response = await getChatSystemPrompt(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.chatSystemPrompt).toBeDefined();
  });

  test('should return unauthorized for chat system prompt request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/chat-system-prompt`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should update chat system prompt for authenticated user - 200', async ({
    request,
    clientAuth
  }) => {
    // given
    const payload = { chatSystemPrompt: 'Respond with short and clear answers.' };

    // when
    const response = await updateChatSystemPrompt(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  test('should return unauthorized for update chat system prompt without token - 401', async ({
    request
  }) => {
    // given
    const payload = { chatSystemPrompt: 'Short answers only.' };

    // when
    const response = await request.put(`${API_BASE_URL}/users/chat-system-prompt`, {
      data: payload
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should return tool system prompt for authenticated user - 200', async ({
    request,
    clientAuth
  }) => {
    // given
    // when
    const response = await getToolSystemPrompt(request, clientAuth.jwtToken);

    // then
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.toolSystemPrompt).toBeDefined();
  });

  test('should return unauthorized for tool system prompt request without token - 401', async ({
    request
  }) => {
    // given
    // when
    const response = await request.get(`${API_BASE_URL}/users/tool-system-prompt`);

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  test('should update tool system prompt for authenticated user - 200', async ({
    request,
    clientAuth
  }) => {
    // given
    const payload = { toolSystemPrompt: 'Always query product data before answering.' };

    // when
    const response = await updateToolSystemPrompt(request, clientAuth.jwtToken, payload);

    // then
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(payload);
  });

  test('should return unauthorized for update tool system prompt without token - 401', async ({
    request
  }) => {
    // given
    const payload = { toolSystemPrompt: 'Use tools.' };

    // when
    const response = await request.put(`${API_BASE_URL}/users/tool-system-prompt`, {
      data: payload
    });

    // then
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });
});
