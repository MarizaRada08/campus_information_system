import { IUser } from "./userInterface";

export interface IAuthPayload {
    email: string;
    password: string;
    otp: string;
}

export interface IAuthResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: IUser;
}