import axios from "axios";
import BasicInfo from "../components/user/settings/BasicInfo";

const API_BASE_URL = 'http://localhost:4000'

export const sendMail =async (email:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/sendMail`, {
            email
        })
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to send OTP');
          }
          throw new Error('An unexpected error occurred');
           
    }
}

export const verifyOTP =async (email:string,otp:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verifyOTP`, {
            email,
            otp
        })
        console.log(response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'OTP not verified');
          }
          throw new Error('An unexpected error occurred');
           
    }
}
export const signup =async (name:string,email:string,phone:string,password:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
            name,
            email,
            phone,
            password
        })
        console.log(response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'signup failed');
          }
          throw new Error('An unexpected error occurred');
           
    }
}
export const login =async (email:string,password:string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password
        })
        console.log(response.data.data)
        return response.data.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'login failed');
          }
          throw new Error('An unexpected error occurred');
           
    }
}

export const loginWithGoogle = async (googleId: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login/google`, { googleId })
        console.log(response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'login with google failed');
          }
          throw new Error('An unexpected error occurred');
    }
}

export const getUser = async (userId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/getUser/${userId}`)
        console.log(response)
        return response.data.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Unavle to fetch user details');
          }
          throw new Error('An unexpected error occurred');
    }
}

export const saveBasicInfo = async (userBasicInfo: object) => {
    try {
        console.log("save basic");
        const response = await axios.patch(`${API_BASE_URL}/user/update_basic_info`,{userBasicInfo})
        console.log(response)
        return response
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Unavle to fetch user details');
          }
          throw new Error('An unexpected error occurred');
    }
    
}
export const saveAddress = async (id:string,address: object) => {
    try {
        console.log("save basic");
        const response = await axios.patch(`${API_BASE_URL}/user/update_address`,{id,address})
        console.log(response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Unavle to fetch user details');
          }
          throw new Error('An unexpected error occurred');
    }
    
}

