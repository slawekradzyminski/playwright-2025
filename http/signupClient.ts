import { API_BASE_URL } from "../config/constants";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { UserRegisterDto } from "../types/auth";

const SIGNUP_ENDPOINT = '/users/signup';

export const attemptSignup = async (request: APIRequestContext, signupData: UserRegisterDto): Promise<APIResponse> => {
    return await request.post(`${API_BASE_URL}${SIGNUP_ENDPOINT}`, {
        data: signupData,
        headers: {
            'Content-Type': 'application/json'
        },      
    });   
};

