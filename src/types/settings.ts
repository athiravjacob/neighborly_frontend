
export interface UserInfo {
    id: string ;
    profile_pic?: string | null;
    name: string;
    email: string;
    phone: string;
    DOB?: string|Date|null;
    bio?: string | null;
    address?: {
        street: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null
    };
    role: 'user' | 'admin';
    govtId: string | null;
    isVerified?: boolean; 
}
  
export interface BasicInfoProps {
    User?:UserInfo
}
  

