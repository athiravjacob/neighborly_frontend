export interface SignupFormData{
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    otp: string;
}
export interface LoginFormData{
    email: string;
    password: string;
}