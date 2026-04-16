import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { ToolSystemPromptChangeRequest } from "../types/prompts";
import { loggedApiCall } from "../utils/apiLogger";

export const TOOL_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/tool-system-prompt';

export const toolSystemPromptClient = {
    async getToolSystemPrompt(request: APIRequestContext, token?: string): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${TOOL_SYSTEM_PROMPT_ENDPOINT}`;
        return loggedApiCall(
            { method: 'GET', url },
            () => request.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }),
        );
    },

    async putToolSystemPrompt(request: APIRequestContext, body: ToolSystemPromptChangeRequest, token?: string): Promise<APIResponse> {
        const url = `${APP_BASE_URL}${TOOL_SYSTEM_PROMPT_ENDPOINT}`;
        return loggedApiCall(
            { method: 'PUT', url, body },
            () => request.put(url, {
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            }),
        );
    }

};