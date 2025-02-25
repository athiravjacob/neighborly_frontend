export interface SignUpFormData{
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    otp?: string;
}