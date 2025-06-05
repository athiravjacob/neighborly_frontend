export interface UserDTO {
  id: string;
  name: string;
  email: string;
  type: string;
}

export interface userGeneralInfo{
  id?: string,
  name: string,
  email: string,
  phone?: string,
  dob?:Date|string,
  profilePicture?: string,
  isBanned?:boolean
}