type User ={
    userId: string;
    name: string | null;
    email: string | null;
    role: string;    
    status: string;
    phoneNumber: string | null;
}
type UserResponse = {
    message: string;
    status: number;
    data: User[];
}