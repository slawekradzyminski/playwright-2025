import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../constants/config";
import { RegisterDto } from "../types/auth";

export const attemptRegister = (request: APIRequestContext, registerDto: RegisterDto) => {
    return request.post(`${API_BASE_URL}/users/signup`, {
        data: registerDto,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
