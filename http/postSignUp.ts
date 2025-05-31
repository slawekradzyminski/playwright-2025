import { API_URL } from "../config/constants";
import { APIRequestContext } from "@playwright/test";
import { RegisterDto } from "../types/auth";

const USERS_SIGNUP = '/users/signup';

export function postSignUp(request: APIRequestContext, registerData: RegisterDto) {
    return request.post(`${API_URL}${USERS_SIGNUP}`, {
        data: registerData,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}