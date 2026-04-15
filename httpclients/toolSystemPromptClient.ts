import { APIRequestContext, APIResponse } from "@playwright/test";
import { APP_BASE_URL } from "../config/constants";
import { ToolSystemPromptChangeRequest } from "../types/prompts";

export const TOOL_SYSTEM_PROMPT_ENDPOINT = '/api/v1/users/tool-system-prompt';

export const toolSystemPromptClient = {
    async getToolSystemPrompt(request: APIRequestContext, token?: string): Promise<APIResponse> {
        return await request.get(`${APP_BASE_URL}${TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
            headers: {
                'Content-Type': 'application/json',
                // if token is provided, include Authorization header
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
    },

    async putToolSystemPrompt(request: APIRequestContext, body: ToolSystemPromptChangeRequest, token?: string): Promise<APIResponse> {
        return await request.put(`${APP_BASE_URL}${TOOL_SYSTEM_PROMPT_ENDPOINT}`, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                // if token is provided, include Authorization header
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
    }

};