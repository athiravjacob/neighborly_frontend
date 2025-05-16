
export interface UserInfo {
    _id: string ;
    profilePicture?: string | null;
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
    isBanned:boolean
}
  
export interface BasicInfoProps {
    User?:UserInfo
}
  
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    profilePicture: string | null;
  }
  


 