import api from "./apiConfig";
import axios from "axios";
import { userGeneralInfo } from "../types/UserDTO";

interface AuthResponse {
  id: string,
  name: string,
  email: string,
  type:string
}
//************Sending email to new user during signup*********** */
export const sendMail = async (email: string): Promise<void> => {
  try {
    const response = await api.post("/auth/users/otp/send", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to send OTP");
    }
    throw new Error("An unexpected error occurred");
  }
};

//********Verify email with the OTP during signup****************** */
export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  try {
    const response = await api.post("/auth/users/otp/verify", { email, otp });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "OTP not verified");
    }
    throw new Error("An unexpected error occurred");
  }
};

//*************** Signup for users ************ */
export const signup = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const user={name,email,phone,password}
    const response = await api.post("/auth/users", {user});
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Signup failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
// ********************User Login*************************

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log("login")
    const response = await api.post("/auth/users/login", { email, password }, { withCredentials: true });
    console.log(response)
      return response.data.data;
      
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
//******************** Google Login ********************* */
export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/users/google-login", { idToken },{ withCredentials: true })
    console.log(response.data.data,"login with google")
    return response.data.data
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
}
//********************* Logout **************************** */
export const logout = async (): Promise<void> => {
  try {
    console.log("hello")
    const response = await api.post("/auth/users/logout", { withCredentials: true });
    console.log(response)
      return response.data.data;
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Logout failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

//*********************** forgot Password ************************** */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await api.post("/auth/users/password/forgot", { email })
    console.log(response.data.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "sending reset link to given email failed");
    }
    throw new Error("An unexpected error occurred");
  }
}
//******************** Reset Password *****************************8 */
export const resetPassword = async (email:string,token: string,newPassword:string): Promise<void> => {
  try {
    const response = await api.post("/auth/users/password/reset", {email,token,newPassword })
    console.log(response.data.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "sending reset link to given email failed");
    }
    throw new Error("An unexpected error occurred");
  }
}


//*****************************Save Profile Details ****************** */
export const saveProfile = async (userId:string,profileDetails: userGeneralInfo): Promise<any> => {
  try {
    const response = await api.patch(`/users/${userId}`, { profileDetails });
    console.log(response.data.data,"save profile function")
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to update basic info");
    }
    throw new Error("An unexpected error occurred");
  }
};

//****************************Get Profile Details****************************/

export const fetchProfile = async (userId:string): Promise<userGeneralInfo> => {
  try {
    const response = await api.get(`/users/${userId}`);
    console.log(response.data.data,"fetch profile")
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to update basic info");
    }
    throw new Error("An unexpected error occurred");
  }
}
// //****************************Save Address ********************************** */
// export const saveAddress = async (id: string, address: object): Promise<any> => {
//   try {
//     const response = await api.patch("/users/update_address", { id, address });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || "Unable to update address");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };

  

//**********************Change Password ************* */
export const changePassword_user = async (userId:string,currentPassword:string, newPassword:string): Promise<void> => {
  try {
   console.log("change pass",newPassword)
   const response = await api.post(`/auth/users/${userId}/password/change`, { currentPassword, newPassword })
   console.log(response.data.data)
 } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
    console.log(error)
    throw new Error(error.response.data.message || "Unable to change password");
  }
  throw new Error("An unexpected error occurred");
 } 
}