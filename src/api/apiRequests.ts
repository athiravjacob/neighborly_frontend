import { UserInfo } from "../types/settings";
import api from "./apiConfig";
import axios from "axios";
// Define response types
interface AuthResponse {
  user: UserInfo;
  accessToken: string;
}

// Public endpoints (no token required initially)
export const sendMail = async (email: string): Promise<void> => {
  try {
    const response = await api.post("/sendMail", { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to send OTP");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  try {
    const response = await api.post("/verifyOTP", { email, otp });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "OTP not verified");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signup = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/signup", { name, email, phone, password });
    return response.data; // Expecting { user, accessToken }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Signup failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
      const response = await api.post("/login", { email, password });
      console.log(response.data.data)
      return response.data.data;
      
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await api.post("/forgotPassword", { email })
    console.log(response.data.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "sending reset link to given email failed");
    }
    throw new Error("An unexpected error occurred");
  }
}

export const resetPassword = async (token: string,newPassword:string): Promise<void> => {
  try {
    const response = await api.post("/resetPassword", { token,newPassword })
    console.log(response.data.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "sending reset link to given email failed");
    }
    throw new Error("An unexpected error occurred");
  }
}
export const loginWithGoogle = async (googleId: string): Promise<AuthResponse> => {
  try {
    const response = await api.post("/login/google", { googleId });
    return response.data; // Adjust based on your API response
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login with Google failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

// Protected endpoints (token added by interceptor)
export const getUser = async (userId: string): Promise<UserInfo> => {
  try {
    const response = await api.get(`/user/getUser/${userId}`);
    return response.data.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to fetch user details");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const saveBasicInfo = async (userBasicInfo: object): Promise<any> => {
  console.log("save basic api")
  try {
    const response = await api.patch("/user/update_basic_info", { userBasicInfo });
    console.log(response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to update basic info");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const saveAddress = async (id: string, address: object): Promise<any> => {
  try {
    const response = await api.patch("/user/update_address", { id, address });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to update address");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyId = async (govtId:string,imageUrl: string): Promise<any> => {
  try {
    const response = await api.post("/user/verify_govt_id",{govtId,imageUrl});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Unable to verify govtid");
    }
    throw new Error("An unexpected error occurred");
  }
};
  

