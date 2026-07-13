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