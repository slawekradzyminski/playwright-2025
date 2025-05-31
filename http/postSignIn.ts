import { LoginDto } from "../types/auth";
import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const SIGNIN_ENDPOINT = '/users/signin';

export function postSignIn(request: APIRequestContext, loginData: LoginDto) {
    return request.post(`${API_URL}${SIGNIN_ENDPOINT}`, {
        data: loginData,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}