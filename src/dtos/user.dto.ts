export interface RegisterUserInputDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface RegisterUserOutputDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginUserInputDTO {
    email: string;
    password: string;
}
export interface LoginUserOutputDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
}