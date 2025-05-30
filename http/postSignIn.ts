import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";
import { LoginDto } from "../types/auth";

export const attemptLogin = (request: APIRequestContext, loginDto: LoginDto) => {
    return request.post(`${API_BASE_URL}/users/signin`, {
        data: loginDto,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}