import axios from "axios";

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
            throw new Error(error.response.data.message || 'Failed to send OTP');
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
            throw new Error(error.response.data.message || 'Failed to send OTP');
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
        console.log(response)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Failed to send OTP');
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
            throw new Error(error.response.data.message || 'Failed to send OTP');
          }
          throw new Error('An unexpected error occurred');
    }
}
