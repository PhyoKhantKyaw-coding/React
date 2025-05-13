type LoginPayload = {
    email : string;
    password: string;
}
type LoginResponse = {
    message: string;
    status: number;
    data: string;
}