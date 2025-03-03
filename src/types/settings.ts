export interface BasicInfoData {
    imageUrl: string | null;
    name: string;
    email: string;
    phone: string;
    dob: string;
    bio: string;
}
  
export interface BasicInfoProps {
    onSave: (data: BasicInfoData) => void;
  }